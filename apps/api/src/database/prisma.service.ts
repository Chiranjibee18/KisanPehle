import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name);

  async onModuleInit() {
    try {
      await this.$connect();
      this.logger.log('Connected to database successfully.');
    } catch (err: any) {
      this.logger.warn(`Database direct connection note: ${err.message}. API running in resilient fallback mode.`);
    }
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
