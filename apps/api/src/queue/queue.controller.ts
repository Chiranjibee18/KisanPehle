import { Controller, Get, Post, Patch, Param, Query, Body, UseGuards, Req } from '@nestjs/common';
import { QueueService } from './queue.service';
import { JwtAuthGuard } from '../common/jwt-auth.guard';
import { RolesGuard } from '../common/roles.guard';
import { Roles } from '../common/roles.decorator';

@Controller('queue')
export class QueueController {
  constructor(private readonly queueService: QueueService) {}

  @Get(':centerId')
  async getCenterQueue(
    @Param('centerId') centerId: string,
    @Query('tokenId') tokenId?: string,
  ) {
    const data = await this.queueService.getCenterQueue(centerId, tokenId);
    return {
      success: true,
      data,
    };
  }

  @Post(':centerId/advance')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('OFFICER', 'SUPER_ADMIN')
  async advanceQueue(@Param('centerId') centerId: string, @Req() req: any) {
    return this.queueService.advanceQueue(centerId, req.user);
  }

  @Patch('token/:tokenId/status')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('OFFICER', 'SUPER_ADMIN')
  async updateTokenStatus(
    @Param('tokenId') tokenId: string,
    @Body('status') status: string,
    @Req() req: any,
  ) {
    return this.queueService.markTokenStatus(tokenId, status, req.user);
  }
}
