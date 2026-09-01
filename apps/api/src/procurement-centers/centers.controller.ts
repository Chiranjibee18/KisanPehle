import { Controller, Get, Patch, Param, Query, Body, UseGuards, Req } from '@nestjs/common';
import { CentersService, CenterFilterDto, UpdateCenterStatusDto } from './centers.service';
import { JwtAuthGuard } from '../common/jwt-auth.guard';
import { RolesGuard } from '../common/roles.guard';
import { Roles } from '../common/roles.decorator';

@Controller('procurement-centers')
export class CentersController {
  constructor(private readonly centersService: CentersService) {}

  @Get()
  async getCenters(
    @Query('cropId') cropId?: string,
    @Query('district') district?: string,
    @Query('state') state?: string,
    @Query('status') status?: string,
    @Query('lat') lat?: string,
    @Query('lng') lng?: string,
  ) {
    const centers = await this.centersService.findAll({
      cropId,
      district,
      state,
      status,
      lat: lat ? parseFloat(lat) : undefined,
      lng: lng ? parseFloat(lng) : undefined,
    });
    return {
      success: true,
      count: centers.length,
      data: centers,
    };
  }

  @Get(':id')
  async getCenter(@Param('id') id: string) {
    const center = await this.centersService.findOne(id);
    return {
      success: true,
      data: center,
    };
  }

  @Patch(':id/status')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('OFFICER', 'DISTRICT_ADMIN', 'STATE_ADMIN', 'SUPER_ADMIN')
  async updateStatus(
    @Param('id') id: string,
    @Body() dto: UpdateCenterStatusDto,
    @Req() req: any,
  ) {
    const updated = await this.centersService.updateStatus(id, dto, req.user);
    return {
      success: true,
      message: 'Procurement center status updated successfully',
      data: updated,
    };
  }
}
