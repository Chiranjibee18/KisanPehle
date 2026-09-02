import { Module } from '@nestjs/common';
import { IvrService } from './ivr.service';
import { IvrController } from './ivr.controller';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [NotificationsModule],
  controllers: [IvrController],
  providers: [IvrService],
  exports: [IvrService],
})
export class IvrModule {}
