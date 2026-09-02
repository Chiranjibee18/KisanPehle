import { Controller, Get, Post, Patch, Body, Param, NotFoundException } from '@nestjs/common';
import { GrievanceService, CreateGrievanceDto } from './grievance.service';

@Controller('grievance')
export class GrievanceController {
  constructor(private readonly grievanceService: GrievanceService) {}

  @Get()
  async getGrievances() {
    const list = await this.grievanceService.findAll();
    return {
      success: true,
      count: list.length,
      data: list,
    };
  }

  @Get(':id')
  async getGrievance(@Param('id') id: string) {
    const item = await this.grievanceService.findOne(id);
    if (!item) throw new NotFoundException(`Grievance ${id} not found`);
    return {
      success: true,
      data: item,
    };
  }

  @Get(':id/evidence-pack')
  async getEvidencePack(@Param('id') id: string) {
    const item = await this.grievanceService.findOne(id);
    if (!item) throw new NotFoundException(`Grievance ${id} not found`);
    return {
      success: true,
      data: item.evidencePack,
    };
  }

  @Post()
  async createGrievance(@Body() dto: CreateGrievanceDto) {
    const created = await this.grievanceService.create(dto);
    return {
      success: true,
      message: 'Grievance recorded successfully. Evidence pack assembled.',
      data: created,
    };
  }

  @Patch(':id/status')
  async updateStatus(
    @Param('id') id: string,
    @Body() body: { status: string; resolutionNotes?: string },
  ) {
    const updated = await this.grievanceService.updateStatus(id, body.status, body.resolutionNotes);
    if (!updated) throw new NotFoundException(`Grievance ${id} not found`);
    return {
      success: true,
      message: `Grievance status updated to ${body.status}`,
      data: updated,
    };
  }
}
