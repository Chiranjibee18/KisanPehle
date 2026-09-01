import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { AuditService } from './audit.service';
import { JwtAuthGuard } from '../common/jwt-auth.guard';
import { RolesGuard } from '../common/roles.guard';
import { Roles } from '../common/roles.decorator';

@Controller('audit-logs')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AuditController {
  constructor(private readonly auditService: AuditService) {}

  @Get()
  @Roles('AUDITOR', 'DISTRICT_ADMIN', 'STATE_ADMIN', 'SUPER_ADMIN')
  async getAuditLogs(
    @Query('entityName') entityName?: string,
    @Query('entityId') entityId?: string,
    @Query('actorRole') actorRole?: string,
    @Query('limit') limit?: string,
  ) {
    const logs = await this.auditService.findAll({
      entityName,
      entityId,
      actorRole,
      limit: limit ? parseInt(limit, 10) : 100,
    });
    return {
      success: true,
      count: logs.length,
      data: logs,
    };
  }
}
