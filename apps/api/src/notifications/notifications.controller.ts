import { Controller, Get, Patch, Param, UseGuards, Req } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { JwtAuthGuard } from '../common/jwt-auth.guard';

@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get('my')
  @UseGuards(JwtAuthGuard)
  async getMyNotifications(@Req() req: any) {
    const notifications = await this.notificationsService.getUserNotifications(req.user.id);
    return {
      success: true,
      count: notifications.length,
      data: notifications,
    };
  }

  @Patch(':id/read')
  @UseGuards(JwtAuthGuard)
  async markRead(@Param('id') id: string) {
    const updated = await this.notificationsService.markAsRead(id);
    return {
      success: true,
      data: updated,
    };
  }

  @Get('sms-log')
  async getSmsLog() {
    const logs = await this.notificationsService.getRecentSmsLogs();
    return {
      success: true,
      count: logs.length,
      data: logs,
    };
  }
}
