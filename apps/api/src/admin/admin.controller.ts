import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../common/jwt-auth.guard';
import { RolesGuard } from '../common/roles.guard';
import { Roles } from '../common/roles.decorator';

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('analytics')
  @Roles('DISTRICT_ADMIN', 'STATE_ADMIN', 'SUPER_ADMIN', 'AUDITOR')
  async getAnalytics(@Query('district') district?: string) {
    const data = await this.adminService.getDashboardMetrics(district);
    return {
      success: true,
      data,
    };
  }

  @Get('reports/export')
  @Roles('DISTRICT_ADMIN', 'STATE_ADMIN', 'SUPER_ADMIN', 'AUDITOR')
  async exportReport(@Query('district') district?: string) {
    const report = await this.adminService.generateReport(district);
    return {
      success: true,
      data: report,
    };
  }
}
