import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { AuditService } from '../audit/audit.service';
import { EncryptionService } from '../common/encryption.service';
import * as bcrypt from 'bcryptjs';

export interface UpdateProfileDto {
  name?: string;
  preferredLanguage?: string;
  village?: string;
  pincode?: string;
  landHoldingAcres?: number;
  kisanCreditCard?: string;
}

export interface AddTrustedHelperDto {
  helperMobile: string;
  helperName: string;
  relationship: string;
  permissions?: string;
}

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private auditService: AuditService,
    private encryptionService: EncryptionService,
  ) {}

  async getProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        farmerProfile: true,
        officerCenter: true,
        helperAuthorizations: {
          include: {
            helper: {
              select: { id: true, name: true, mobile: true },
            },
          },
        },
      },
    });

    if (!user) throw new NotFoundException('User not found');

    if (user.farmerProfile?.kisanCreditCard) {
      user.farmerProfile.kisanCreditCard = this.encryptionService.decrypt(user.farmerProfile.kisanCreditCard);
    }

    return user;
  }

  async updateProfile(userId: string, dto: UpdateProfileDto) {
    const data: any = {
      name: dto.name,
      preferredLanguage: dto.preferredLanguage,
      farmerProfile: {
        upsert: {
          create: {
            village: dto.village || 'Kalyanpur',
            pincode: dto.pincode || '756001',
            landHoldingAcres: dto.landHoldingAcres || 2.5,
            kisanCreditCard: dto.kisanCreditCard ? this.encryptionService.encrypt(dto.kisanCreditCard) : undefined,
          },
          update: {
            village: dto.village,
            pincode: dto.pincode,
            landHoldingAcres: dto.landHoldingAcres,
            kisanCreditCard: dto.kisanCreditCard ? this.encryptionService.encrypt(dto.kisanCreditCard) : undefined,
          },
        },
      },
    };

    const updated = await this.prisma.user.update({
      where: { id: userId },
      data,
      include: { farmerProfile: true },
    });

    if (updated.farmerProfile?.kisanCreditCard) {
      updated.farmerProfile.kisanCreditCard = this.encryptionService.decrypt(updated.farmerProfile.kisanCreditCard);
    }

    return updated;
  }

  async addTrustedHelper(farmerId: string, dto: any) {
    const mobile = dto.helperMobile || dto.mobile;
    const name = dto.helperName || dto.name;
    const relationship = dto.relationship || 'Family Member';
    const permissions = dto.permissions || 'VIEW_AND_BOOK';

    if (!mobile || !name) {
      throw new BadRequestException('Helper name and mobile number are required');
    }

    let helperUser = await this.prisma.user.findUnique({
      where: { mobile },
    });

    if (!helperUser) {
      // Create user record for helper
      const pwd = await bcrypt.hash('kisan123', 10);
      helperUser = await this.prisma.user.create({
        data: {
          mobile,
          name,
          passwordHash: pwd,
          role: 'TRUSTED_HELPER',
          preferredLanguage: 'hi',
        },
      });
    }

    const helperRecord = await this.prisma.trustedHelper.create({
      data: {
        farmerId,
        helperUserId: helperUser.id,
        relationship,
        permissions,
        consentGiven: true,
      },
      include: {
        helper: {
          select: { id: true, name: true, mobile: true },
        },
      },
    });

    await this.auditService.log({
      actorId: farmerId,
      actorRole: 'FARMER',
      action: 'TRUSTED_HELPER_ADDED',
      entityName: 'TrustedHelper',
      entityId: helperRecord.id,
      newState: { helperMobile: mobile, relationship },
      reason: 'Farmer delegated helper permissions with explicit consent',
    });

    return helperRecord;
  }

  async revokeTrustedHelper(farmerId: string, helperRecordId: string) {
    const record = await this.prisma.trustedHelper.findUnique({
      where: { id: helperRecordId },
    });

    if (!record || record.farmerId !== farmerId) {
      throw new NotFoundException('Helper authorization not found');
    }

    const updated = await this.prisma.trustedHelper.update({
      where: { id: helperRecordId },
      data: {
        isRevoked: true,
        revokedAt: new Date(),
      },
    });

    await this.auditService.log({
      actorId: farmerId,
      actorRole: 'FARMER',
      action: 'TRUSTED_HELPER_REVOKED',
      entityName: 'TrustedHelper',
      entityId: helperRecordId,
      reason: 'Farmer revoked helper authorization',
    });

    return updated;
  }
}
