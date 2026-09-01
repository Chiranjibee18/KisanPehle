import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class NotificationsService {
  constructor(private prisma: PrismaService) {}

  async getUserNotifications(userId: string) {
    return this.prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });
  }

  async markAsRead(notificationId: string) {
    return this.prisma.notification.update({
      where: { id: notificationId },
      data: { isRead: true },
    });
  }

  async getRecentSmsLogs() {
    return this.prisma.notification.findMany({
      where: { channel: 'SMS' },
      include: {
        user: { select: { name: true, mobile: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: 30,
    });
  }
}
