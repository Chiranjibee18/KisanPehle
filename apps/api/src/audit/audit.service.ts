import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

export interface CreateAuditLogDto {
  actorId?: string;
  actorRole: string;
  action: string;
  entityName: string;
  entityId: string;
  previousState?: any;
  newState?: any;
  reason?: string;
  ipAddress?: string;
  userAgent?: string;
}

@Injectable()
export class AuditService {
  private readonly logger = new Logger(AuditService.name);

  constructor(private prisma: PrismaService) {}

  async log(dto: CreateAuditLogDto) {
    try {
      const record = await this.prisma.auditLog.create({
        data: {
          actorId: dto.actorId || null,
          actorRole: dto.actorRole || 'SYSTEM',
          action: dto.action,
          entityName: dto.entityName,
          entityId: dto.entityId,
          previousStateJson: dto.previousState ? JSON.stringify(dto.previousState) : null,
          newStateJson: dto.newState ? JSON.stringify(dto.newState) : null,
          reason: dto.reason || null,
          ipAddress: dto.ipAddress || '127.0.0.1',
          userAgent: dto.userAgent || 'KisanPehele/1.0',
        },
      });
      this.logger.log(`[AUDIT] ${dto.actorRole} -> ${dto.action} on ${dto.entityName}#${dto.entityId}`);
      return record;
    } catch (err) {
      this.logger.error(`Failed to record audit log: ${(err as any).message}`);
    }
  }

  async findAll(params?: {
    entityName?: string;
    entityId?: string;
    actorRole?: string;
    limit?: number;
  }) {
    const where: any = {};
    if (params?.entityName) where.entityName = params.entityName;
    if (params?.entityId) where.entityId = params.entityId;
    if (params?.actorRole) where.actorRole = params.actorRole;

    return this.prisma.auditLog.findMany({
      where,
      include: {
        actor: {
          select: {
            id: true,
            name: true,
            mobile: true,
            role: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: params?.limit || 100,
    });
  }
}
