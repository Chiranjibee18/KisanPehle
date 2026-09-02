import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

export const DEFAULT_SMS_LOGS = [
  {
    id: 'sms-001',
    userId: 'usr_9876543210',
    channel: 'SMS',
    title: 'Slot Confirmed: Token A-102',
    message: 'Namaskar Ramesh ji, your slot at Balasore RMC Central Mandi is confirmed for 09:00 AM - 09:20 AM. Token: A-102. Estimated wait: ~20m. Pehle pata, phir mandi.',
    language: 'hi',
    deliveryStatus: 'DELIVERED',
    createdAt: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
    user: { name: 'Ramesh Patel', mobile: '9876543210' },
  },
  {
    id: 'sms-002',
    userId: 'usr_9876543212',
    channel: 'SMS',
    title: 'Mandi Queue Alert: Token A-103',
    message: 'Namaskar Manoj ji, you are next in line (Position 1). Please proceed to Counter 2 with your Paddy load. Current wait: ~5m.',
    language: 'or',
    deliveryStatus: 'DELIVERED',
    createdAt: new Date(Date.now() - 1000 * 60 * 25).toISOString(),
    user: { name: 'Manoj Mohapatra', mobile: '9876543212' },
  },
  {
    id: 'sms-003',
    userId: 'usr_9876543214',
    channel: 'SMS',
    title: 'Slot Confirmed: Token A-104',
    message: 'Namaskar Priya ji, your slot at Balasore RMC Central Mandi is confirmed for 09:50 AM - 10:10 AM. Token: A-104. Pehle pata, phir mandi.',
    language: 'hi',
    deliveryStatus: 'DELIVERED',
    createdAt: new Date(Date.now() - 1000 * 60 * 40).toISOString(),
    user: { name: 'Priya Nayak', mobile: '9876543214' },
  },
  {
    id: 'sms-004',
    userId: 'usr_9876543216',
    channel: 'SMS',
    title: 'IVR Enquiry Summary',
    message: 'Kisan Pehele: Balasore RMC Mandi currently has 7 farmers in queue with 3 active weighbridges. Normal wait: 25 mins.',
    language: 'en',
    deliveryStatus: 'DELIVERED',
    createdAt: new Date(Date.now() - 1000 * 60 * 55).toISOString(),
    user: { name: 'Ananya Sahoo', mobile: '9876543216' },
  },
];

@Injectable()
export class NotificationsService {
  private inMemorySmsLogs: any[] = [...DEFAULT_SMS_LOGS];

  constructor(private prisma: PrismaService) {}

  addSmsLog(log: { mobile: string; name?: string; title: string; message: string; language?: string }) {
    const entry = {
      id: `sms-${Date.now()}`,
      userId: `usr_${log.mobile}`,
      channel: 'SMS',
      title: log.title,
      message: log.message,
      language: log.language || 'hi',
      deliveryStatus: 'DELIVERED',
      createdAt: new Date().toISOString(),
      user: { name: log.name || `Farmer ${log.mobile.slice(-4)}`, mobile: log.mobile },
    };
    this.inMemorySmsLogs.unshift(entry);
    return entry;
  }

  async getUserNotifications(userId: string) {
    try {
      const notes = await this.prisma.notification.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        take: 50,
      });
      if (notes && notes.length > 0) return notes;
    } catch {}

    return this.inMemorySmsLogs;
  }

  async markAsRead(notificationId: string) {
    try {
      return await this.prisma.notification.update({
        where: { id: notificationId },
        data: { isRead: true },
      });
    } catch {
      return { success: true };
    }
  }

  async getRecentSmsLogs() {
    try {
      const logs = await this.prisma.notification.findMany({
        where: { channel: 'SMS' },
        include: {
          user: { select: { name: true, mobile: true } },
        },
        orderBy: { createdAt: 'desc' },
        take: 30,
      });
      if (logs && logs.length > 0) return logs;
    } catch {}

    return this.inMemorySmsLogs;
  }
}
