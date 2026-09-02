import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { SupabaseService } from './supabase.service';
import { EncryptionService } from '../common/encryption.service';

@Global()
@Module({
  providers: [PrismaService, SupabaseService, EncryptionService],
  exports: [PrismaService, SupabaseService, EncryptionService],
})
export class DatabaseModule {}
