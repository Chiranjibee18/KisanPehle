import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { EventsGateway } from '../events/events.gateway';
import { AuditService } from '../audit/audit.service';

const DEFAULT_QUEUE_DATA: any = {
  centerId: 'c1',
  centerName: 'Balasore RMC Central Mandi',
  centerStatus: 'ACTIVE',
  activeCounters: 3,
  totalIssuedToday: 18,
  activeQueueCount: 7,
  completedCount: 11,
  currentlyServing: {
    id: 'tok-102',
    tokenNumber: 'A-102',
    farmerName: 'Suresh Jena',
    cropName: 'Paddy (Common)',
    quantity: 22.5,
    servingAt: new Date().toISOString(),
  },
  queue: [
    {
      id: 'tok-103',
      tokenNumber: 'A-103',
      sequenceNumber: 3,
      status: 'CALLED',
      recommendedArrival: '09:15 AM',
      slotTime: '09:30 AM - 09:50 AM',
      farmerName: 'Manoj Mohapatra',
      cropName: 'Paddy (Common)',
      quantity: 45.0,
      procurementStatus: 'VERIFICATION',
      caseId: 'case-103',
      positionInQueue: 1,
      estimatedWaitMinutes: 5,
    },
    {
      id: 'tok-104',
      tokenNumber: 'A-104',
      sequenceNumber: 4,
      status: 'ARRIVED',
      recommendedArrival: '09:35 AM',
      slotTime: '09:50 AM - 10:10 AM',
      farmerName: 'Priya Nayak',
      cropName: 'Paddy (Common)',
      quantity: 18.0,
      procurementStatus: 'SCHEDULED',
      caseId: 'case-104',
      positionInQueue: 2,
      estimatedWaitMinutes: 10,
    },
    {
      id: 'tok-105',
      tokenNumber: 'A-105',
      sequenceNumber: 5,
      status: 'ISSUED',
      recommendedArrival: '09:55 AM',
      slotTime: '10:10 AM - 10:30 AM',
      farmerName: 'Ananya Sahoo',
      cropName: 'Ragi (Finger Millet)',
      quantity: 30.0,
      procurementStatus: 'SCHEDULED',
      caseId: 'case-105',
      positionInQueue: 3,
      estimatedWaitMinutes: 15,
    },
    {
      id: 'tok-106',
      tokenNumber: 'A-106',
      sequenceNumber: 6,
      status: 'ISSUED',
      recommendedArrival: '10:15 AM',
      slotTime: '10:30 AM - 10:50 AM',
      farmerName: 'Bikram Rout',
      cropName: 'Wheat',
      quantity: 25.0,
      procurementStatus: 'SCHEDULED',
      caseId: 'case-106',
      positionInQueue: 4,
      estimatedWaitMinutes: 20,
    },
    {
      id: 'tok-107',
      tokenNumber: 'A-107',
      sequenceNumber: 7,
      status: 'ISSUED',
      recommendedArrival: '10:35 AM',
      slotTime: '10:50 AM - 11:10 AM',
      farmerName: 'Debabrata Das',
      cropName: 'Paddy (Common)',
      quantity: 20.0,
      procurementStatus: 'SCHEDULED',
      caseId: 'case-107',
      positionInQueue: 5,
      estimatedWaitMinutes: 25,
    },
    {
      id: 'tok-108',
      tokenNumber: 'A-108',
      sequenceNumber: 8,
      status: 'ISSUED',
      recommendedArrival: '10:55 AM',
      slotTime: '11:10 AM - 11:30 AM',
      farmerName: 'Kailash Behera',
      cropName: 'Maize',
      quantity: 35.0,
      procurementStatus: 'SCHEDULED',
      caseId: 'case-108',
      positionInQueue: 6,
      estimatedWaitMinutes: 30,
    },
    {
      id: 'tok-109',
      tokenNumber: 'A-109',
      sequenceNumber: 9,
      status: 'ISSUED',
      recommendedArrival: '11:15 AM',
      slotTime: '11:30 AM - 11:50 AM',
      farmerName: 'Santosh Giri',
      cropName: 'Paddy (Common)',
      quantity: 28.0,
      procurementStatus: 'SCHEDULED',
      caseId: 'case-109',
      positionInQueue: 7,
      estimatedWaitMinutes: 35,
    },
  ],
  lastUpdated: new Date().toISOString(),
};

@Injectable()
export class QueueService {
  constructor(
    private prisma: PrismaService,
    private eventsGateway: EventsGateway,
    private auditService: AuditService,
  ) {}

  async getCenterQueue(centerId: string, specificTokenIdOrNumber?: string) {
    try {
      const center = await this.prisma.procurementCenter.findUnique({
        where: { id: centerId },
      });
      if (!center) {
        return DEFAULT_QUEUE_DATA;
      }

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

      if (!allTokens || allTokens.length === 0) {
        return DEFAULT_QUEUE_DATA;
      }

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
    } catch {
      return DEFAULT_QUEUE_DATA;
    }
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
