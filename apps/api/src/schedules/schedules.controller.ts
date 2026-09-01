import { Controller, Get, Param, Query } from '@nestjs/common';
import { SchedulesService } from './schedules.service';

@Controller('schedules')
export class SchedulesController {
  constructor(private readonly schedulesService: SchedulesService) {}

  @Get('center/:centerId')
  async getCenterSchedules(
    @Param('centerId') centerId: string,
    @Query('date') date?: string,
    @Query('cropId') cropId?: string,
  ) {
    const targetDate = date || new Date().toISOString().split('T')[0];
    const schedules = await this.schedulesService.findByCenterAndDate(centerId, targetDate, cropId);
    return {
      success: true,
      date: targetDate,
      data: schedules,
    };
  }
}
