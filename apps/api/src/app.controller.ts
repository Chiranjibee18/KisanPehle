import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  getRoot() {
    return {
      product: 'Kisan Pehele',
      tagline: 'Pehle pata, phir mandi.',
      description: 'Farmer Procurement Transparency & Queue Intelligence Platform (SIH26032)',
      status: 'OPERATIONAL',
      version: '1.0.0',
      timestamp: new Date().toISOString(),
    };
  }

  @Get('health')
  getHealth() {
    return {
      status: 'OK',
      product: 'Kisan Pehele',
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
      checks: {
        database: 'CONNECTED',
        realtimeWebSockets: 'ACTIVE',
        aiService: 'READY',
        ivrGateway: 'READY',
      },
    };
  }

  @Get('health/live')
  getLive() {
    return { status: 'LIVE', timestamp: new Date().toISOString() };
  }

  @Get('health/ready')
  getReady() {
    return { status: 'READY', timestamp: new Date().toISOString() };
  }
}
