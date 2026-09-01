import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { AuditService } from '../audit/audit.service';

export interface CenterFilterDto {
  cropId?: string;
  district?: string;
  state?: string;
  status?: string;
  lat?: number;
  lng?: number;
}

export interface UpdateCenterStatusDto {
  status: string; // ACTIVE, LIMITED_CAPACITY, PAUSED, CLOSED
  reason?: string;
  activeCounters?: number;
  maxDailyCapacityQuintals?: number;
}

@Injectable()
export class CentersService {
  constructor(
    private prisma: PrismaService,
    private auditService: AuditService,
  ) {}

  async findAll(filter: CenterFilterDto) {
    const where: any = {};
    if (filter.district) where.district = filter.district;
    if (filter.state) where.state = filter.state;
    if (filter.status) where.currentStatus = filter.status;

    if (filter.cropId) {
      where.cropSupports = {
        some: {
          cropId: filter.cropId,
          isActive: true,
        },
      };
    }

    const centers = await this.prisma.procurementCenter.findMany({
      where,
      include: {
        cropSupports: {
          include: { crop: true },
        },
        tokens: {
          where: {
            status: { in: ['ISSUED', 'ARRIVED', 'CALLED', 'SERVING'] },
          },
        },
      },
      orderBy: { name: 'asc' },
    });

    const farmerLat = filter.lat || 21.4934;
    const farmerLng = filter.lng || 86.9135;

    return centers.map((c) => {
      const activeQueueCount = c.tokens.length;
      const distanceKm = this.calculateDistance(farmerLat, farmerLng, c.lat, c.lng);
      // Wait time formula: (queue count / active counters) * avg service time (15 mins)
      const estimatedWaitMinutes = Math.max(
        10,
        Math.round((activeQueueCount / Math.max(1, c.activeCounters)) * 15),
      );

      return {
        id: c.id,
        code: c.code,
        name: c.name,
        district: c.district,
        state: c.state,
        address: c.address,
        lat: c.lat,
        lng: c.lng,
        distanceKm: Math.round(distanceKm * 10) / 10,
        operatingHours: c.operatingHours,
        maxDailyCapacityQuintals: c.maxDailyCapacityQuintals,
        currentStatus: c.currentStatus,
        statusReason: c.statusReason,
        activeCounters: c.activeCounters,
        contactNumber: c.contactNumber,
        supportedCrops: c.cropSupports.map((cs) => cs.crop),
        activeQueueCount,
        estimatedWaitMinutes,
      };
    });
  }

  async findOne(id: string) {
    const center = await this.prisma.procurementCenter.findUnique({
      where: { id },
      include: {
        cropSupports: { include: { crop: true } },
        schedules: {
          where: { date: new Date().toISOString().split('T')[0] },
          include: { crop: true },
        },
        tokens: {
          where: {
            status: { in: ['ISSUED', 'ARRIVED', 'CALLED', 'SERVING'] },
          },
          orderBy: { sequenceNumber: 'asc' },
        },
      },
    });

    if (!center) {
      throw new NotFoundException('Procurement center not found');
    }

    const activeQueueCount = center.tokens.length;
    const estimatedWaitMinutes = Math.max(
      10,
      Math.round((activeQueueCount / Math.max(1, center.activeCounters)) * 15),
    );

    return {
      ...center,
      activeQueueCount,
      estimatedWaitMinutes,
      supportedCrops: center.cropSupports.map((cs) => cs.crop),
    };
  }

  async updateStatus(id: string, dto: UpdateCenterStatusDto, actor: any) {
    const center = await this.prisma.procurementCenter.findUnique({ where: { id } });
    if (!center) throw new NotFoundException('Center not found');

    const previousState = {
      status: center.currentStatus,
      reason: center.statusReason,
      activeCounters: center.activeCounters,
      maxCapacity: center.maxDailyCapacityQuintals,
    };

    const updated = await this.prisma.procurementCenter.update({
      where: { id },
      data: {
        currentStatus: dto.status || center.currentStatus,
        statusReason: dto.reason !== undefined ? dto.reason : center.statusReason,
        activeCounters: dto.activeCounters !== undefined ? dto.activeCounters : center.activeCounters,
        maxDailyCapacityQuintals:
          dto.maxDailyCapacityQuintals !== undefined
            ? dto.maxDailyCapacityQuintals
            : center.maxDailyCapacityQuintals,
      },
    });

    await this.auditService.log({
      actorId: actor?.id,
      actorRole: actor?.role || 'OFFICER',
      action: 'CENTER_STATUS_UPDATED',
      entityName: 'ProcurementCenter',
      entityId: center.id,
      previousState,
      newState: {
        status: updated.currentStatus,
        reason: updated.statusReason,
        activeCounters: updated.activeCounters,
        maxCapacity: updated.maxDailyCapacityQuintals,
      },
      reason: dto.reason || 'Operational update by procurement authority',
    });

    return updated;
  }

  private calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Radius of earth in KM
    const dLat = this.deg2rad(lat2 - lat1);
    const dLon = this.deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(lat1)) *
        Math.cos(this.deg2rad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  private deg2rad(deg: number): number {
    return deg * (Math.PI / 180);
  }
}
