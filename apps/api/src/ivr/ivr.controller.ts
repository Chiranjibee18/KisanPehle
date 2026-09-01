import { Controller, Post, Get, Body } from '@nestjs/common';
import { IvrService, IVRRequestDto } from './ivr.service';

@Controller('ivr')
export class IvrController {
  constructor(private readonly ivrService: IvrService) {}

  @Post('simulate')
  async simulateCall(@Body() dto: IVRRequestDto) {
    const response = await this.ivrService.handleCall(dto);
    return {
      success: true,
      data: response,
    };
  }

  @Get('logs')
  async getLogs() {
    const logs = await this.ivrService.getRecentLogs();
    return {
      success: true,
      count: logs.length,
      data: logs,
    };
  }
}
