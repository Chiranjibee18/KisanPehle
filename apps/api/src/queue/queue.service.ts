import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { EventsGateway } from '../events/events.gateway';
import { AuditService } from '../audit/audit.service';

@Injectable()
export class QueueService {
  constructor(
    private prisma: PrismaService,
    private eventsGateway: EventsGateway,
    private auditService: AuditService,
  ) {}

  async getCenterQueue(centerId: string, specificTokenIdOrNumber?: string) {
    const center = await this.prisma.procurementCenter.findUnique({
      where: { id: centerId },
    });
    if (!center) throw new NotFoundException('Procurement center not found');

    const allTokens = await this.prisma.token.findMany({
      where: {
        centerId,
        createdAt: {
          gte: new Date(new Date().setHours(0, 0, 0, 0)),
        },
      },
      include: {
        booking: {
          include: {
            farmer: {
              select: { id: true, name: true, mobile: true, preferredLanguage: true },
            },
            crop: true,
            procurementCase: true,
          },
        },
      },
      orderBy: { sequenceNumber: 'asc' },
    });

    const activeTokens = allTokens.filter((t) =>
      ['ISSUED', 'ARRIVED', 'CALLED', 'SERVING'].includes(t.status),
    );
    const currentlyServing = allTokens.find((t) => t.status === 'SERVING') || null;
    const completedTokens = allTokens.filter((t) => t.status === 'COMPLETED');

    // Calculate position and wait for specific token if requested
    let specificTokenDetails = null;
    if (specificTokenIdOrNumber) {
      const targetToken = allTokens.find(
        (t) => t.id === specificTokenIdOrNumber || t.tokenNumber === specificTokenIdOrNumber,
      );
      if (targetToken) {
        // Count how many active tokens have sequenceNumber < targetToken.sequenceNumber
        const aheadCount = activeTokens.filter(
          (t) => t.sequenceNumber < targetToken.sequenceNumber,
        ).length;
        const waitMinutes = Math.max(
          5,
          Math.round((aheadCount / Math.max(1, center.activeCounters)) * 15),
        );

        specificTokenDetails = {
          token: targetToken,
          aheadCount,
          estimatedWaitMinutes: waitMinutes,
          isServing: targetToken.status === 'SERVING',
          isCompleted: targetToken.status === 'COMPLETED',
        };
      }
    }

    return {
      centerId: center.id,
      centerName: center.name,
      centerStatus: center.currentStatus,
      activeCounters: center.activeCounters,
      totalIssuedToday: allTokens.length,
      currentlyServing: currentlyServing
        ? {
            id: currentlyServing.id,
            tokenNumber: currentlyServing.tokenNumber,
            farmerName: currentlyServing.booking?.farmer?.name,
            cropName: currentlyServing.booking?.crop?.nameEn,
            quantity: currentlyServing.booking?.estimatedQuantityQuintals,
            servingAt: currentlyServing.servingAt,
          }
        : null,
      activeQueueCount: activeTokens.length,
      completedCount: completedTokens.length,
      queue: activeTokens.map((t, idx) => ({
        id: t.id,
        tokenNumber: t.tokenNumber,
        sequenceNumber: t.sequenceNumber,
        status: t.status,
        recommendedArrival: t.recommendedArrival,
        slotTime: t.booking?.slotTime,
        farmerName: t.booking?.farmer?.name,
        cropName: t.booking?.crop?.nameEn,
        quantity: t.booking?.estimatedQuantityQuintals,
        procurementStatus: t.booking?.procurementCase?.currentStatus,
        caseId: t.booking?.procurementCase?.id,
        positionInQueue: idx + 1,
        estimatedWaitMinutes: Math.max(
          5,
          Math.round((idx / Math.max(1, center.activeCounters)) * 15),
        ),
      })),
      specificTokenDetails,
      lastUpdated: new Date().toISOString(),
    };
  }

  async advanceQueue(centerId: string, actor: any) {
    const activeTokens = await this.prisma.token.findMany({
      where: {
        centerId,
        status: { in: ['ISSUED', 'ARRIVED', 'CALLED', 'SERVING'] },
      },
      include: {
        booking: {
          include: { procurementCase: true },
        },
      },
      orderBy: { sequenceNumber: 'asc' },
    });

    if (activeTokens.length === 0) {
      throw new BadRequestException('No active tokens in queue to advance.');
    }

    // If there is a currently serving token, complete it or verify next
    const servingToken = activeTokens.find((t) => t.status === 'SERVING');
    if (servingToken) {
      await this.prisma.token.update({
        where: { id: servingToken.id },
        data: { status: 'COMPLETED', completedAt: new Date() },
      });
    }

    // Call the next token
    const nextToken = activeTokens.find((t) => t.status !== 'SERVING');
    if (nextToken) {
      const updatedNext = await this.prisma.token.update({
        where: { id: nextToken.id },
        data: { status: 'SERVING', servingAt: new Date() },
        include: {
          booking: {
            include: { procurementCase: true, farmer: true },
          },
        },
      });

      // Advance procurement case to ARRIVED / VERIFICATION if it was SCHEDULED
      if (
        updatedNext.booking?.procurementCase &&
        updatedNext.booking.procurementCase.currentStatus === 'SCHEDULED'
      ) {
        await this.prisma.procurementCase.update({
          where: { id: updatedNext.booking.procurementCase.id },
          data: { currentStatus: 'ARRIVED' },
        });
      }

      await this.auditService.log({
        actorId: actor.id,
        actorRole: actor.role,
        action: 'QUEUE_ADVANCED',
        entityName: 'Token',
        entityId: nextToken.id,
        newState: { tokenNumber: nextToken.tokenNumber, status: 'SERVING' },
        reason: 'Officer called and started serving next token in queue',
      });
    }

    const updatedQueue = await this.getCenterQueue(centerId);
    this.eventsGateway.emitQueueUpdated(centerId, updatedQueue);

    return {
      success: true,
      message: 'Queue advanced successfully',
      data: updatedQueue,
    };
  }

  async markTokenStatus(tokenId: string, status: string, actor: any) {
    const token = await this.prisma.token.findUnique({
      where: { id: tokenId },
      include: { booking: { include: { procurementCase: true } } },
    });

    if (!token) throw new NotFoundException('Token not found');

    const updated = await this.prisma.token.update({
      where: { id: tokenId },
      data: {
        status,
        ...(status === 'CALLED' ? { calledAt: new Date() } : {}),
        ...(status === 'SERVING' ? { servingAt: new Date() } : {}),
        ...(status === 'COMPLETED' ? { completedAt: new Date() } : {}),
      },
    });

    await this.auditService.log({
      actorId: actor.id,
      actorRole: actor.role,
      action: 'TOKEN_STATUS_CHANGED',
      entityName: 'Token',
      entityId: token.id,
      previousState: { status: token.status },
      newState: { status: updated.status },
      reason: `Officer updated token status to ${status}`,
    });

    const updatedQueue = await this.getCenterQueue(token.centerId);
    this.eventsGateway.emitQueueUpdated(token.centerId, updatedQueue);

    return {
      success: true,
      message: `Token status updated to ${status}`,
      data: updated,
    };
  }
}
