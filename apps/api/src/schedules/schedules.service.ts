import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class SchedulesService {
  constructor(private prisma: PrismaService) {}

  async findByCenterAndDate(centerId: string, date: string, cropId?: string) {
    const where: any = { centerId, date };
    if (cropId) where.cropId = cropId;

    const schedules = await this.prisma.procurementSchedule.findMany({
      where,
      include: {
        crop: true,
        center: true,
        bookings: {
          where: { status: { notIn: ['CANCELLED'] } },
        },
      },
    });

    if (schedules.length === 0) {
      // Auto-generate default published schedule for seamless demo if not explicitly seeded
      const crop = cropId
        ? await this.prisma.crop.findUnique({ where: { id: cropId } })
        : await this.prisma.crop.findFirst();

      if (crop) {
        const newSched = await this.prisma.procurementSchedule.create({
          data: {
            centerId,
            cropId: crop.id,
            date,
            startTime: '08:30',
            endTime: '16:30',
            totalSlots: 24,
            slotDurationMinutes: 20,
            capacityPerSlotQuintals: 25.0,
            status: 'PUBLISHED',
          },
          include: {
            crop: true,
            center: true,
            bookings: true,
          },
        });
        return [this.formatScheduleWithSlots(newSched)];
      }
    }

    return schedules.map((s) => this.formatScheduleWithSlots(s));
  }

  private formatScheduleWithSlots(schedule: any) {
    // Generate 20-minute slots from startTime to endTime
    const slots = [];
    const [startHour, startMinute] = schedule.startTime.split(':').map(Number);
    const [endHour, endMinute] = schedule.endTime.split(':').map(Number);

    let currentMinutes = startHour * 60 + startMinute;
    const endMinutes = endHour * 60 + endMinute;
    const duration = schedule.slotDurationMinutes || 20;

    let slotIdx = 1;
    while (currentMinutes + duration <= endMinutes) {
      const slotStart = this.minutesToTimeString(currentMinutes);
      const slotEnd = this.minutesToTimeString(currentMinutes + duration);
      const slotLabel = `${slotStart} - ${slotEnd}`;

      // Count bookings in this slot
      const bookedInSlot = schedule.bookings.filter((b: any) => b.slotTime === slotLabel);
      const bookedQuantity = bookedInSlot.reduce((sum: number, b: any) => sum + b.estimatedQuantityQuintals, 0);
      const isAvailable = bookedInSlot.length < 3 && schedule.status === 'PUBLISHED';

      slots.push({
        id: `slot-${slotIdx}`,
        slotTime: slotLabel,
        isAvailable,
        bookedCount: bookedInSlot.length,
        maxBookings: 3,
        allocatedCapacityQuintals: bookedQuantity,
        maxCapacityQuintals: schedule.capacityPerSlotQuintals,
      });

      currentMinutes += duration;
      slotIdx++;
    }

    return {
      id: schedule.id,
      centerId: schedule.centerId,
      centerName: schedule.center?.name,
      cropId: schedule.cropId,
      cropName: schedule.crop?.nameEn,
      date: schedule.date,
      status: schedule.status,
      slots,
    };
  }

  private minutesToTimeString(minutes: number): string {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    const period = hours >= 12 ? 'PM' : 'AM';
    const displayHour = hours % 12 === 0 ? 12 : hours % 12;
    const padMin = mins.toString().padStart(2, '0');
    return `${displayHour}:${padMin} ${period}`;
  }
}
