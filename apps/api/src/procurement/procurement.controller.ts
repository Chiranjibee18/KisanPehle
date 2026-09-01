import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  Query,
  UseGuards,
  Req,
} from '@nestjs/common';
import {
  ProcurementService,
  VerifyProcurementDto,
  InspectCropDto,
} from './procurement.service';
import { JwtAuthGuard } from '../common/jwt-auth.guard';
import { RolesGuard } from '../common/roles.guard';
import { Roles } from '../common/roles.decorator';

@Controller('procurement')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ProcurementController {
  constructor(private readonly procurementService: ProcurementService) {}

  @Get('cases')
  @Roles('OFFICER', 'DISTRICT_ADMIN', 'STATE_ADMIN', 'AUDITOR', 'SUPER_ADMIN')
  async getCases(
    @Query('centerId') centerId: string,
    @Query('status') status?: string,
  ) {
    const cases = await this.procurementService.getCasesByCenter(centerId, status);
    return {
      success: true,
      count: cases.length,
      data: cases,
    };
  }

  @Get('cases/:id')
  async getCase(@Param('id') id: string) {
    const pCase = await this.procurementService.getCaseById(id);
    return {
      success: true,
      data: pCase,
    };
  }

  @Post('cases/:id/arrive')
  @Roles('OFFICER', 'SUPER_ADMIN')
  async markArrived(@Param('id') id: string, @Req() req: any) {
    const result = await this.procurementService.markArrived(id, req.user);
    return {
      success: true,
      message: 'Farmer arrival recorded',
      data: result,
    };
  }

  @Post('cases/:id/verify')
  @Roles('OFFICER', 'SUPER_ADMIN')
  async verifyFarmer(
    @Param('id') id: string,
    @Body() dto: VerifyProcurementDto,
    @Req() req: any,
  ) {
    const result = await this.procurementService.recordVerification(id, dto, req.user);
    return {
      success: true,
      message: 'Farmer documents & quota verified',
      data: result,
    };
  }

  @Post('cases/:id/inspect')
  @Roles('OFFICER', 'SUPER_ADMIN')
  async inspectCrop(
    @Param('id') id: string,
    @Body() dto: InspectCropDto,
    @Req() req: any,
  ) {
    const result = await this.procurementService.recordInspection(id, dto, req.user);
    return {
      success: true,
      message: dto.isAccepted
        ? 'Crop inspection passed and procurement recorded!'
        : 'Crop rejected due to quality standard failure.',
      data: result,
    };
  }

  @Post('cases/:id/pay')
  @Roles('OFFICER', 'DISTRICT_ADMIN', 'STATE_ADMIN', 'SUPER_ADMIN')
  async processPayment(@Param('id') id: string, @Req() req: any) {
    const result = await this.procurementService.processPayment(id, req.user);
    return {
      success: true,
      message: 'Direct Benefit Transfer (DBT) payment simulated & credited.',
      data: result,
    };
  }
}
