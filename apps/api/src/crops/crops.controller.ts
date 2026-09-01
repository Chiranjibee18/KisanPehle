import { Controller, Get, Param } from '@nestjs/common';
import { CropsService } from './crops.service';

@Controller('crops')
export class CropsController {
  constructor(private readonly cropsService: CropsService) {}

  @Get()
  async getCrops() {
    const crops = await this.cropsService.findAll();
    return {
      success: true,
      data: crops,
    };
  }

  @Get(':id')
  async getCrop(@Param('id') id: string) {
    const crop = await this.cropsService.findOne(id);
    return {
      success: true,
      data: crop,
    };
  }
}
