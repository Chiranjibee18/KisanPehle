import { Controller, Post, Body } from '@nestjs/common';
import { VoiceService, ParseVoiceInputDto } from './voice.service';

@Controller('voice')
export class VoiceController {
  constructor(private readonly voiceService: VoiceService) {}

  @Post('parse-intent')
  async parseIntent(@Body() dto: ParseVoiceInputDto) {
    const result = await this.voiceService.parseIntent(dto);
    return {
      success: true,
      data: result,
    };
  }
}
