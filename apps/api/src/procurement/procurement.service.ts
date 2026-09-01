import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { AuditService } from '../audit/audit.service';
import { EventsGateway } from '../events/events.gateway';

export interface VerifyProcurementDto {
  verificationNotes?: string;
  farmerPhotoVerified?: boolean;
  landRecordMatched?: boolean;
}

export interface InspectCropDto {
  measuredMoisturePercent: number; // e.g. 14.2
  foreignMatterPercent?: number; // e.g. 0.5
  qualityGrade: string; // GRADE_A, GRADE_B, GRADE_C, FAQ_STANDARD, BELOW_STANDARD
  weighedQuantityQuintals: number;
  deductionQuintals?: number;
  inspectionNotes?: string;
  isAccepted: boolean;
  rejectionReason?: string;
}

export const VALID_TRANSITIONS: Record<string, string[]> = {
  REGISTERED: ['SCHEDULED'],
  SCHEDULED: ['ARRIVED', 'REJECTED'],
  ARRIVED: ['VERIFICATION', 'REJECTED'],
  VERIFICATION: ['INSPECTION', 'REJECTED'],
  INSPECTION: ['ACCEPTED', 'REJECTED'],
  ACCEPTED: ['PROCUREMENT_COMPLETED'],
  REJECTED: [],
  PROCUREMENT_COMPLETED: ['PAYMENT_PROCESSING'],
  PAYMENT_PROCESSING: ['PAID', 'PAYMENT_FAILED'],
  PAID: [],
  PAYMENT_FAILED: ['PAYMENT_PROCESSING'],
};

@Injectable()
export class ProcurementService {
  constructor(
    private prisma: PrismaService,
    private auditService: AuditService,
    private eventsGateway: EventsGateway,
  ) {}

  async getCaseById(id: string) {
    const pCase = await this.prisma.procurementCase.findUnique({
      where: { id },
      include: {
        farmer: {
          select: {
            id: true,
            name: true,
            mobile: true,
            preferredLanguage: true,
            farmerProfile: true,
          },
        },
        center: true,
        crop: true,
        booking: {
          include: { token: true },
        },
        verification: true,
        inspection: true,
        paymentRecord: true,
      },
    });

    if (!pCase) throw new NotFoundException('Procurement case not found');
    return pCase;
  }

  async getCasesByCenter(centerId: string, status?: string) {
    const where: any = { centerId };
    if (status) where.currentStatus = status;

    return this.prisma.procurementCase.findMany({
      where,
      include: {
        farmer: {
          select: { id: true, name: true, mobile: true, farmerProfile: true },
        },
        crop: true,
        booking: { include: { token: true } },
        verification: true,
        inspection: true,
        paymentRecord: true,
      },
      orderBy: { updatedAt: 'desc' },
    });
  }

  async markArrived(caseId: string, actor: any) {
    return this.transitionState(caseId, 'ARRIVED', 'Farmer arrived at procurement center', actor);
  }

  async recordVerification(caseId: string, dto: VerifyProcurementDto, actor: any) {
    const pCase = await this.prisma.procurementCase.findUnique({ where: { id: caseId } });
    if (!pCase) throw new NotFoundException('Case not found');

    if (!['ARRIVED', 'VERIFICATION'].includes(pCase.currentStatus)) {
      throw new BadRequestException(`Cannot verify case in ${pCase.currentStatus} status.`);
    }

    await this.prisma.verification.upsert({
      where: { procurementCaseId: caseId },
      update: {
        officerId: actor.id,
        isVerified: true,
        verificationNotes: dto.verificationNotes || 'Farmer identification and land record matched.',
        farmerPhotoVerified: dto.farmerPhotoVerified ?? true,
        landRecordMatched: dto.landRecordMatched ?? true,
        verifiedAt: new Date(),
      },
      create: {
        procurementCaseId: caseId,
        officerId: actor.id,
        isVerified: true,
        verificationNotes: dto.verificationNotes || 'Farmer identification and land record matched.',
        farmerPhotoVerified: dto.farmerPhotoVerified ?? true,
        landRecordMatched: dto.landRecordMatched ?? true,
      },
    });

    return this.transitionState(
      caseId,
      'INSPECTION',
      'Farmer identity and land quota verified. Ready for crop inspection.',
      actor,
    );
  }

  async recordInspection(caseId: string, dto: InspectCropDto, actor: any) {
    const pCase = await this.prisma.procurementCase.findUnique({
      where: { id: caseId },
      include: { crop: true, farmer: true, center: true, booking: { include: { token: true } } },
    });
    if (!pCase) throw new NotFoundException('Case not found');

    if (pCase.currentStatus !== 'INSPECTION') {
      throw new BadRequestException(`Cannot record inspection in ${pCase.currentStatus} status.`);
    }

    const deduction = dto.deductionQuintals || 0;
    const netProcured = Math.max(0, dto.weighedQuantityQuintals - deduction);

    await this.prisma.inspection.upsert({
      where: { procurementCaseId: caseId },
      update: {
        officerId: actor.id,
        measuredMoisturePercent: dto.measuredMoisturePercent,
        foreignMatterPercent: dto.foreignMatterPercent ?? 0.5,
        qualityGrade: dto.qualityGrade,
        weighedQuantityQuintals: dto.weighedQuantityQuintals,
        deductionQuintals: deduction,
        netProcuredQuantityQuintals: netProcured,
        inspectionNotes: dto.inspectionNotes,
        inspectedAt: new Date(),
      },
      create: {
        procurementCaseId: caseId,
        officerId: actor.id,
        measuredMoisturePercent: dto.measuredMoisturePercent,
        foreignMatterPercent: dto.foreignMatterPercent ?? 0.5,
        qualityGrade: dto.qualityGrade,
        weighedQuantityQuintals: dto.weighedQuantityQuintals,
        deductionQuintals: deduction,
        netProcuredQuantityQuintals: netProcured,
        inspectionNotes: dto.inspectionNotes,
      },
    });

    if (dto.isAccepted) {
      // Transition to ACCEPTED
      const updatedCase = await this.transitionState(
        caseId,
        'ACCEPTED',
        `Crop inspection PASSED (Grade: ${dto.qualityGrade}, Moisture: ${dto.measuredMoisturePercent}%). Weighed: ${netProcured} Q.`,
        actor,
      );

      // Auto-progress to PROCUREMENT_COMPLETED & Initialize Payment record
      const mspRate = pCase.crop.minSupportPrice || 2183.0;
      const grossAmount = netProcured * mspRate;
      const netPayable = grossAmount;

      await this.prisma.paymentRecord.upsert({
        where: { procurementCaseId: caseId },
        update: {
          mspRatePerQuintal: mspRate,
          grossAmountRupees: grossAmount,
          deductionsRupees: 0,
          netPayableRupees: netPayable,
          paymentStatus: 'PAYMENT_PROCESSING',
        },
        create: {
          procurementCaseId: caseId,
          mspRatePerQuintal: mspRate,
          grossAmountRupees: grossAmount,
          deductionsRupees: 0,
          netPayableRupees: netPayable,
          paymentStatus: 'PAYMENT_PROCESSING',
        },
      });

      await this.transitionState(
        caseId,
        'PROCUREMENT_COMPLETED',
        'Procurement receipt generated. Payment processing initiated.',
        actor,
      );

      // Notification
      await this.prisma.notification.create({
        data: {
          userId: pCase.farmerId,
          channel: 'SMS',
          title: 'Procurement Completed & Accepted!',
          message: `Namaskar ${pCase.farmer.name}, your ${pCase.crop.nameEn} (${netProcured} Q) has been accepted at ${pCase.center.name}. Total payable: ₹${netPayable.toLocaleString('en-IN')}. DBT payment initiated. Pehle pata, phir mandi.`,
          language: pCase.farmer.preferredLanguage || 'hi',
          deliveryStatus: 'DELIVERED',
        },
      });

      return updatedCase;
    } else {
      // REJECTED
      return this.transitionState(
        caseId,
        'REJECTED',
        dto.rejectionReason || 'Crop quality does not meet MSP procurement specifications.',
        actor,
      );
    }
  }

  async processPayment(caseId: string, actor: any) {
    const pCase = await this.prisma.procurementCase.findUnique({
      where: { id: caseId },
      include: { paymentRecord: true, farmer: true },
    });

    if (!pCase) throw new NotFoundException('Case not found');
    if (pCase.currentStatus !== 'PROCUREMENT_COMPLETED' && pCase.currentStatus !== 'PAYMENT_PROCESSING') {
      throw new BadRequestException('Case must be completed to process payment.');
    }

    const txRef = `DBT-PFMS-OD2026-${Date.now().toString().slice(-6)}`;
    await this.prisma.paymentRecord.update({
      where: { procurementCaseId: caseId },
      data: {
        paymentStatus: 'PAID',
        transactionReference: txRef,
        processedAt: new Date(),
      },
    });

    const updated = await this.transitionState(
      caseId,
      'PAID',
      `Payment credited via Direct Benefit Transfer (DBT PFMS Ref: ${txRef}).`,
      actor,
    );

    await this.prisma.notification.create({
      data: {
        userId: pCase.farmerId,
        channel: 'SMS',
        title: 'Payment Credited via DBT',
        message: `Namaskar ${pCase.farmer.name}, ₹${pCase.paymentRecord?.netPayableRupees?.toLocaleString('en-IN')} has been transferred to your bank account via DBT. Ref: ${txRef}.`,
        language: pCase.farmer.preferredLanguage || 'hi',
        deliveryStatus: 'DELIVERED',
      },
    });

    return updated;
  }

  private async transitionState(
    caseId: string,
    nextStatus: string,
    reason: string,
    actor: any,
  ) {
    const pCase = await this.prisma.procurementCase.findUnique({
      where: { id: caseId },
      include: { farmer: true, center: true, crop: true, booking: { include: { token: true } } },
    });

    if (!pCase) throw new NotFoundException('Procurement case not found');

    const allowed = VALID_TRANSITIONS[pCase.currentStatus] || [];
    if (!allowed.includes(nextStatus)) {
      throw new BadRequestException(
        `Invalid state transition: Cannot move from ${pCase.currentStatus} to ${nextStatus}. Allowed: [${allowed.join(', ')}]`,
      );
    }

    const previousStatus = pCase.currentStatus;
    const updated = await this.prisma.procurementCase.update({
      where: { id: caseId },
      data: {
        currentStatus: nextStatus,
        rejectionReason: nextStatus === 'REJECTED' ? reason : pCase.rejectionReason,
      },
      include: {
        farmer: true,
        center: true,
        crop: true,
        verification: true,
        inspection: true,
        paymentRecord: true,
        booking: { include: { token: true } },
      },
    });

    // Update token status if completed or rejected
    if (pCase.booking?.token) {
      if (nextStatus === 'PROCUREMENT_COMPLETED' || nextStatus === 'PAID') {
        await this.prisma.token.update({
          where: { id: pCase.booking.token.id },
          data: { status: 'COMPLETED', completedAt: new Date() },
        });
      } else if (nextStatus === 'REJECTED') {
        await this.prisma.token.update({
          where: { id: pCase.booking.token.id },
          data: { status: 'EXPIRED' },
        });
      }
    }

    // Record Immutable Audit Log
    await this.auditService.log({
      actorId: actor?.id,
      actorRole: actor?.role || 'OFFICER',
      action: 'PROCUREMENT_STATE_TRANSITION',
      entityName: 'ProcurementCase',
      entityId: caseId,
      previousState: { status: previousStatus },
      newState: { status: nextStatus },
      reason,
    });

    // Emit Real-time WebSocket Broadcast
    this.eventsGateway.emitProcurementTransition(pCase.farmerId, pCase.centerId, {
      caseId: updated.id,
      caseNumber: updated.caseNumber,
      tokenNumber: pCase.booking?.token?.tokenNumber,
      previousStatus,
      newStatus: nextStatus,
      reason,
      updatedCase: updated,
    });

    return updated;
  }
}
