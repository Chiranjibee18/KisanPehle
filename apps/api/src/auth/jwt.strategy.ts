import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private prisma: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'kisan_pehele_jwt_super_secret_key_sih26032_2026',
    });
  }

  async validate(payload: { sub: string; mobile: string; role: string }) {
    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
      include: {
        farmerProfile: true,
        officerCenter: true,
      },
    });

    if (!user || !user.isActive) {
      throw new UnauthorizedException('User account not found or deactivated');
    }

    return {
      id: user.id,
      mobile: user.mobile,
      name: user.name,
      role: user.role,
      preferredLanguage: user.preferredLanguage,
      state: user.state,
      district: user.district,
      farmerProfile: user.farmerProfile,
      officerCenter: user.officerCenter,
    };
  }
}
