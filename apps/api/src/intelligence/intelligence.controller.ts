import { Controller, Get, Post, Body, Query, Param } from '@nestjs/common';
import { IntelligenceService, CapacitySimulationDto } from './intelligence.service';

@Controller('intelligence')
export class IntelligenceController {
  constructor(private readonly intelligenceService: IntelligenceService) {}

  @Get('bottlenecks')
  async getBottlenecks(@Query('district') district?: string) {
    const data = await this.intelligenceService.getBottlenecks(district);
    return {
      success: true,
      count: data.length,
      data,
    };
  }

  @Post('simulate-capacity')
  simulateCapacity(@Body() dto: CapacitySimulationDto) {
    const result = this.intelligenceService.simulateCapacity(dto);
    return {
      success: true,
      data: result,
    };
  }

  @Get('no-show-analysis')
  getNoShowAnalysis() {
    const analysis = this.intelligenceService.getNoShowAnalysis();
    return {
      success: true,
      data: analysis,
    };
  }

  @Get('rebalancing-recommendations')
  getRebalancingRecommendations() {
    const recommendations = this.intelligenceService.getRebalancingRecommendations();
    return {
      success: true,
      count: recommendations.length,
      data: recommendations,
    };
  }

  @Get('journey-timeline/:bookingId')
  getJourneyTimeline(@Param('bookingId') bookingId: string) {
    const timeline = this.intelligenceService.getJourneyTimeline(bookingId);
    return {
      success: true,
      count: timeline.length,
      data: timeline,
    };
  }
}
