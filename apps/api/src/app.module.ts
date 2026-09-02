import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { DatabaseModule } from './database/database.module';
import { EventsModule } from './events/events.module';
import { AuditModule } from './audit/audit.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { CropsModule } from './crops/crops.module';
import { CentersModule } from './procurement-centers/centers.module';
import { SchedulesModule } from './schedules/schedules.module';
import { BookingsModule } from './bookings/bookings.module';
import { QueueModule } from './queue/queue.module';
import { ProcurementModule } from './procurement/procurement.module';
import { NotificationsModule } from './notifications/notifications.module';
import { AiModule } from './ai/ai.module';
import { VoiceModule } from './voice/voice.module';
import { IvrModule } from './ivr/ivr.module';
import { AdminModule } from './admin/admin.module';
import { IntelligenceModule } from './intelligence/intelligence.module';
import { GrievanceModule } from './grievance/grievance.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    EventsModule,
    AuditModule,
    AuthModule,
    UsersModule,
    CropsModule,
    CentersModule,
    SchedulesModule,
    BookingsModule,
    QueueModule,
    ProcurementModule,
    NotificationsModule,
    AiModule,
    VoiceModule,
    IvrModule,
    AdminModule,
    IntelligenceModule,
    GrievanceModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
