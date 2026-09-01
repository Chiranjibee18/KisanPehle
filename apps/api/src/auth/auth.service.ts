import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../database/prisma.service';
import { AuditService } from '../audit/audit.service';
import * as bcrypt from 'bcryptjs';

export interface RegisterDto {
  mobile: string;
  name: string;
  password?: string;
  preferredLanguage?: string;
  state?: string;
  district?: string;
  village?: string;
  pincode?: string;
  aadhaarLast4?: string;
  landHoldingAcres?: number;
  role?: string;
}

export interface LoginDto {
  mobile: string;
  password?: string;
}

export interface VerifyOtpDto {
  mobile: string;
  otp: string;
  name?: string;
  preferredLanguage?: string;
  state?: string;
  district?: string;
  village?: string;
  pincode?: string;
  aadhaarLast4?: string;
  landHoldingAcres?: number;
}

@Injectable()
export class AuthService {
  // In-memory OTP storage for demo/development
  private otpStore = new Map<string, { otp: string; expiresAt: number }>();

  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private auditService: AuditService,
  ) {}

  async sendOtp(mobile: string) {
    if (!mobile || !/^\d{10}$/.test(mobile)) {
      throw new BadRequestException('Please enter a valid 10-digit mobile number.');
    }

    const otp = '123456'; // Deterministic testable OTP for seamless onboarding
    this.otpStore.set(mobile, {
      otp,
      expiresAt: Date.now() + 5 * 60 * 1000, // 5 mins
    });

    // Check if user exists
    const existing = await this.prisma.user.findUnique({
      where: { mobile },
    });

    if (existing) {
      await this.prisma.notification.create({
        data: {
          userId: existing.id,
          channel: 'SMS',
          title: 'Kisan Pehele OTP',
          message: `Your Kisan Pehele verification OTP is ${otp}. Valid for 5 minutes. Do not share with anyone.`,
          language: existing.preferredLanguage || 'hi',
          deliveryStatus: 'DELIVERED',
        },
      });
    }

    return {
      success: true,
      message: `OTP sent successfully to +91-${mobile}`,
      demoOtp: otp,
      isExistingUser: !!existing,
    };
  }

  async verifyOtp(dto: VerifyOtpDto) {
    const record = this.otpStore.get(dto.mobile);
    const isValid = dto.otp === '123456' || (record && record.otp === dto.otp);

    if (!isValid) {
      throw new BadRequestException('Invalid or expired OTP. Please enter 123456.');
    }

    let user = await this.prisma.user.findUnique({
      where: { mobile: dto.mobile },
      include: {
        farmerProfile: true,
        officerCenter: true,
      },
    });

    if (!user) {
      // Auto-register new farmer
      const passwordHash = await bcrypt.hash('kisan123', 10);
      user = await this.prisma.user.create({
        data: {
          mobile: dto.mobile,
          name: dto.name || `Farmer ${dto.mobile.slice(-4)}`,
          passwordHash,
          role: 'FARMER',
          preferredLanguage: dto.preferredLanguage || 'hi',
          state: dto.state || 'Odisha',
          district: dto.district || 'Balasore',
          farmerProfile: {
            create: {
              aadhaarLast4: dto.aadhaarLast4 || '8821',
              landHoldingAcres: dto.landHoldingAcres || 2.5,
              village: dto.village || 'Kalyanpur',
              pincode: dto.pincode || '756001',
            },
          },
        },
        include: {
          farmerProfile: true,
          officerCenter: true,
        },
      });

      await this.auditService.log({
        actorId: user.id,
        actorRole: 'FARMER',
        action: 'FARMER_OTP_ONBOARDED',
        entityName: 'User',
        entityId: user.id,
        newState: { mobile: user.mobile, name: user.name },
      });
    }

    const token = this.generateToken(user);
    return {
      success: true,
      message: 'Authentication successful',
      user: {
        id: user.id,
        mobile: user.mobile,
        name: user.name,
        role: user.role,
        preferredLanguage: user.preferredLanguage,
        state: user.state,
        district: user.district,
        farmerProfile: user.farmerProfile,
        officerCenter: user.officerCenter,
      },
      accessToken: token,
    };
  }

  async register(dto: RegisterDto) {
    const existing = await this.prisma.user.findUnique({
      where: { mobile: dto.mobile },
    });

    if (existing) {
      throw new BadRequestException('Mobile number is already registered.');
    }

    const passwordHash = await bcrypt.hash(dto.password || 'kisan123', 10);
    const role = dto.role || 'FARMER';

    const user = await this.prisma.user.create({
      data: {
        mobile: dto.mobile,
        name: dto.name,
        passwordHash,
        role,
        preferredLanguage: dto.preferredLanguage || 'hi',
        state: dto.state || 'Odisha',
        district: dto.district || 'Balasore',
        ...(role === 'FARMER'
          ? {
              farmerProfile: {
                create: {
                  aadhaarLast4: dto.aadhaarLast4 || null,
                  landHoldingAcres: dto.landHoldingAcres || 2.5,
                  village: dto.village || 'Kalyanpur',
                  pincode: dto.pincode || '756001',
                },
              },
            }
          : {}),
      },
      include: {
        farmerProfile: true,
        officerCenter: true,
      },
    });

    await this.auditService.log({
      actorId: user.id,
      actorRole: user.role,
      action: 'USER_REGISTERED',
      entityName: 'User',
      entityId: user.id,
      newState: { mobile: user.mobile, role: user.role, name: user.name },
    });

    const token = this.generateToken(user);
    return {
      success: true,
      message: 'Registration successful',
      user: {
        id: user.id,
        mobile: user.mobile,
        name: user.name,
        role: user.role,
        preferredLanguage: user.preferredLanguage,
        state: user.state,
        district: user.district,
        farmerProfile: user.farmerProfile,
      },
      accessToken: token,
    };
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { mobile: dto.mobile },
      include: {
        farmerProfile: true,
        officerCenter: true,
      },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid mobile number or password');
    }

    if (dto.password) {
      const isMatch = await bcrypt.compare(dto.password, user.passwordHash);
      if (!isMatch) {
        throw new UnauthorizedException('Invalid mobile number or password');
      }
    }

    await this.auditService.log({
      actorId: user.id,
      actorRole: user.role,
      action: 'USER_LOGIN',
      entityName: 'User',
      entityId: user.id,
    });

    const fullProfile = await this.getUserProfile(user.id);
    const token = this.generateToken(user);
    return {
      success: true,
      message: 'Login successful',
      user: fullProfile || user,
      accessToken: token,
    };
  }

  async getUserProfile(userId: string) {
    return this.prisma.user.findUnique({
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
  }

  async quickDemoLogin(role: string) {
    const roleMap: Record<string, string> = {
      FARMER: '9876543210',
      OFFICER: '9876543230',
      DISTRICT_ADMIN: '9876543240',
      STATE_ADMIN: '9876543250',
      AUDITOR: '9876543260',
      TRUSTED_HELPER: '9876543220',
    };

    const mobile = roleMap[role] || '9876543210';
    return this.login({ mobile, password: 'kisan123' });
  }

  private generateToken(user: { id: string; mobile: string; role: string; name: string }) {
    return this.jwtService.sign({
      sub: user.id,
      mobile: user.mobile,
      role: user.role,
      name: user.name,
    });
  }
}
