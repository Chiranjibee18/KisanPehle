import { Module } from '@nestjs/common';
import { GrievanceService } from './grievance.service';
import { GrievanceController } from './grievance.controller';
import { AuditModule } from '../audit/audit.module';

@Module({
  imports: [AuditModule],
  controllers: [GrievanceController],
  providers: [GrievanceService],
  exports: [GrievanceService],
})
export class GrievanceModule {}
