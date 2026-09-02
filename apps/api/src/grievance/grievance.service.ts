import { Injectable, Logger } from '@nestjs/common';
import * as crypto from 'crypto';
import { PrismaService } from '../database/prisma.service';
import { AuditService } from '../audit/audit.service';

export interface CreateGrievanceDto {
  bookingId?: string;
  tokenNumber?: string;
  farmerId?: string;
  farmerName?: string;
  farmerMobile?: string;
  centerId?: string;
  centerName?: string;
  cropName?: string;
  issueType:
    | 'SLOT_ISSUE'
    | 'TOKEN_ISSUE'
    | 'EXCESSIVE_WAITING'
    | 'WEIGHMENT_DISPUTE'
    | 'QUALITY_GRADE_DISPUTE'
    | 'PAYMENT_DELAY'
    | 'OFFICER_CONDUCT';
  description: string;
}

@Injectable()
export class GrievanceService {
  private readonly logger = new Logger(GrievanceService.name);

  private grievances: any[] = [
    {
      id: 'grv-001',
      grievanceNumber: 'KP-GRV-1024',
      farmerId: 'usr_9876543210',
      farmerName: 'Ramesh Patel',
      farmerMobile: '9876543210',
      bookingId: 'bk-20260902-102',
      tokenNumber: 'A-102',
      centerId: 'c1',
      centerName: 'Balasore RMC Central Mandi',
      cropName: 'Paddy (Common)',
      issueType: 'WEIGHMENT_DISPUTE',
      description:
        'Farmer requested re-verification of tare weight differential on vehicle OD-01-AB-1234; claimed 0.4 Q variance compared to certified farm scale.',
      status: 'UNDER_REVIEW',
      createdAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
      updatedAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
      resolutionNotes: 'Assistant Quality Supervisor assigned for secondary weighbridge audit and load-cell calibration check.',
      evidencePack: this.generateEvidencePack({
        grievanceNumber: 'KP-GRV-1024',
        bookingNumber: 'KP-BKG-20260902-8821',
        tokenNumber: 'A-102',
        centerName: 'Balasore RMC Central Mandi',
        farmerName: 'Ramesh Patel',
      }),
    },
    {
      id: 'grv-002',
      grievanceNumber: 'KP-GRV-1025',
      farmerId: 'usr_9876543212',
      farmerName: 'Manoj Mohapatra',
      farmerMobile: '9876543212',
      bookingId: 'bk-20260902-103',
      tokenNumber: 'A-103',
      centerId: 'c3',
      centerName: 'Basta Block Direct Purchase Depo',
      cropName: 'Paddy (Grade A)',
      issueType: 'EXCESSIVE_WAITING',
      description:
        'Wait time exceeded recommended slot by 48 minutes due to counter breakdown at Basta Depo.',
      status: 'OPEN',
      createdAt: new Date(Date.now() - 1000 * 60 * 20).toISOString(),
      updatedAt: new Date(Date.now() - 1000 * 60 * 20).toISOString(),
      resolutionNotes: undefined,
      evidencePack: this.generateEvidencePack({
        grievanceNumber: 'KP-GRV-1025',
        bookingNumber: 'KP-BKG-20260902-4412',
        tokenNumber: 'A-103',
        centerName: 'Basta Block Direct Purchase Depo',
        farmerName: 'Manoj Mohapatra',
      }),
    },
  ];

  constructor(
    private prisma: PrismaService,
    private auditService: AuditService,
  ) {}

  async findAll() {
    return this.grievances;
  }

  async findOne(id: string) {
    const item = this.grievances.find((g) => g.id === id || g.grievanceNumber === id);
    if (!item) return null;
    return item;
  }

  async create(dto: CreateGrievanceDto) {
    const grievanceNumber = `KP-GRV-${Math.floor(1026 + Math.random() * 900)}`;
    const id = `grv-${Date.now()}`;
    const evidencePack = this.generateEvidencePack({
      grievanceNumber,
      bookingNumber: `KP-BKG-${dto.bookingId || Date.now()}`,
      tokenNumber: dto.tokenNumber || 'A-102',
      centerName: dto.centerName || 'Balasore RMC Central Mandi',
      farmerName: dto.farmerName || 'Ramesh Patel',
    });

    const newGrievance = {
      id,
      grievanceNumber,
      farmerId: dto.farmerId || 'usr_9876543210',
      farmerName: dto.farmerName || 'Ramesh Patel',
      farmerMobile: dto.farmerMobile || '9876543210',
      bookingId: dto.bookingId || 'bk-20260902-102',
      tokenNumber: dto.tokenNumber || 'A-102',
      centerId: dto.centerId || 'c1',
      centerName: dto.centerName || 'Balasore RMC Central Mandi',
      cropName: dto.cropName || 'Paddy (Common)',
      issueType: dto.issueType,
      description: dto.description,
      status: 'OPEN',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      evidencePack,
    };

    this.grievances.unshift(newGrievance);

    // Record immutable audit event
    await this.auditService.log({
      actorId: dto.farmerId || 'usr_9876543210',
      actorRole: 'FARMER',
      action: 'GRIEVANCE_FILED',
      entityName: 'GrievanceRecord',
      entityId: id,
      newState: { grievanceNumber, issueType: dto.issueType },
      reason: `Farmer reported formal operational dispute: ${dto.issueType}`,
    });

    return newGrievance;
  }

  async updateStatus(id: string, status: string, resolutionNotes?: string) {
    const grv = this.grievances.find((g) => g.id === id || g.grievanceNumber === id);
    if (!grv) return null;

    grv.status = status;
    grv.updatedAt = new Date().toISOString();
    if (resolutionNotes) grv.resolutionNotes = resolutionNotes;

    await this.auditService.log({
      actorId: 'usr_officer_admin',
      actorRole: 'DISTRICT_ADMIN',
      action: `GRIEVANCE_STATUS_${status}`,
      entityName: 'GrievanceRecord',
      entityId: grv.id,
      newState: { status, resolutionNotes },
      reason: `Administrative resolution: ${resolutionNotes || status}`,
    });

    return grv;
  }

  private generateEvidencePack(context: {
    grievanceNumber: string;
    bookingNumber: string;
    tokenNumber: string;
    centerName: string;
    farmerName: string;
  }) {
    const rawData = JSON.stringify({
      ...context,
      timestamp: new Date().toISOString(),
      certifier: 'Kisan Pehele Statutory Verification Engine',
    });
    const cryptographicProofHash = crypto.createHash('sha256').update(rawData).digest('hex');

    return {
      compiledAt: new Date().toISOString(),
      bookingNumber: context.bookingNumber,
      journeyTimeline: [
        {
          stepId: 'ev-1',
          order: 1,
          title: 'Slot Booked & Cryptographically Registered',
          description: `Farmer ${context.farmerName} scheduled slot for Balasore Mandi.`,
          timestamp: '08:15 AM, 02 Sep 2026',
          actor: `${context.farmerName} (Farmer)`,
          actorRole: 'FARMER',
          channel: 'Mobile PWA',
          status: 'COMPLETED' as const,
        },
        {
          stepId: 'ev-2',
          order: 2,
          title: `Token ${context.tokenNumber} Generated`,
          description: 'Sequential electronic queue token generated with geofenced arrival window.',
          timestamp: '08:16 AM, 02 Sep 2026',
          actor: 'Queue Intelligence Engine',
          actorRole: 'SYSTEM',
          channel: 'Telecom CPaaS SMS',
          status: 'COMPLETED' as const,
        },
        {
          stepId: 'ev-3',
          order: 3,
          title: 'Gate Security Arrival Verified',
          description: 'Vehicle OD-01-AB-1234 scanned at yard gate.',
          timestamp: '08:48 AM, 02 Sep 2026',
          actor: 'Gate Officer',
          actorRole: 'OFFICER',
          channel: 'Biometric QR Terminal',
          status: 'COMPLETED' as const,
        },
        {
          stepId: 'ev-4',
          order: 4,
          title: 'Weighbridge Gross & Tare Measurement Certified',
          description: 'Electronic weighbridge raw sensor capture certified.',
          timestamp: '09:12 AM, 02 Sep 2026',
          actor: 'Rajesh Kumar (Mandi Officer)',
          actorRole: 'OFFICER',
          channel: 'Load Cell Terminal #WB-02',
          status: 'COMPLETED' as const,
        },
      ],
      weighmentReceipt: {
        weighbridgeId: 'WB-02 (Calibrated Grade-I)',
        grossWeightQuintals: 28.4,
        tareWeightQuintals: 3.4,
        netWeightQuintals: 25.0,
        moistureContentPercent: 14.2,
        recordedAt: '09:12 AM, 02 Sep 2026',
        operatorName: 'Rajesh Kumar (Mandi Officer)',
      },
      qualityAssay: {
        inspectorName: 'S. N. Mohanty (Authorized Quality Assayer)',
        qualityGrade: 'FAQ Grade A (Conforms to National Mandi Guidelines)',
        foreignMatterPercent: 0.8,
        damagedGrainsPercent: 1.2,
        approvedMspRatePerQuintal: 2183,
        assayNotes: 'Moisture content 14.2% verified within permissible 17% limit. Grain density verified.',
        inspectedAt: '09:18 AM, 02 Sep 2026',
      },
      paymentStatus: {
        status: 'PAID (PFMS Electronic Direct Benefit Transfer)',
        amountRupees: 54575,
        transactionRef: 'PFMS-OD-BAL-20260902-991',
        bankAccountMasked: 'SBI ****4921',
        processedAt: '09:25 AM, 02 Sep 2026',
      },
      officerActionsLog: [
        {
          actor: 'Rajesh Kumar (Mandi Officer)',
          action: 'WEIGHMENT_COMMITTED',
          timestamp: '09:12 AM, 02 Sep 2026',
          notes: 'Gross weight 28.4 Q and tare weight 3.4 Q digitally signed.',
        },
        {
          actor: 'S. N. Mohanty (Quality Inspector)',
          action: 'ASSAY_CERTIFIED',
          timestamp: '09:18 AM, 02 Sep 2026',
          notes: 'FAQ Grade A certified with zero moisture penalty.',
        },
      ],
      cryptographicProofHash,
    };
  }
}
