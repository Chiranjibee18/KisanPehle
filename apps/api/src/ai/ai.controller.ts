import { Controller, Get, Param, Query } from '@nestjs/common';
import { AiService } from './ai.service';

@Controller('ai')
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Get('wait-time/:centerId')
  async getWaitTimePrediction(@Param('centerId') centerId: string) {
    const prediction = await this.aiService.predictWaitTime(centerId);
    return {
      success: true,
      data: prediction,
    };
  }

  @Get('demand-forecast/:centerId')
  async getDemandForecast(
    @Param('centerId') centerId: string,
    @Query('cropId') cropId?: string,
  ) {
    const forecast = await this.aiService.forecastDemand(centerId, cropId);
    return {
      success: true,
      data: forecast,
    };
  }

  @Get('recommendations')
  async getRecommendations(
    @Query('cropId') cropId: string,
    @Query('lat') lat?: string,
    @Query('lng') lng?: string,
    @Query('currentCenterId') currentCenterId?: string,
  ) {
    const result = await this.aiService.recommendAlternativeCenters(
      cropId,
      lat ? parseFloat(lat) : 21.4934,
      lng ? parseFloat(lng) : 86.9135,
      currentCenterId,
    );
    return {
      success: true,
      data: result,
    };
  }
}
