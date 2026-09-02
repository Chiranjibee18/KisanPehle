import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

export const DEFAULT_CROPS = [
  {
    id: 'crop-paddy',
    code: 'PADDY_COMMON',
    nameEn: 'Paddy (Common)',
    nameHi: 'धान (सामान्य)',
    nameOr: 'ଧାନ (ସାଧାରଣ)',
    mspPerQuintal: 2183.0,
    maxMoisturePercent: 17.0,
    isActive: true,
  },
  {
    id: 'crop-wheat',
    code: 'WHEAT',
    nameEn: 'Wheat',
    nameHi: 'गेहूं',
    nameOr: 'ଗହମ',
    mspPerQuintal: 2275.0,
    maxMoisturePercent: 14.0,
    isActive: true,
  },
  {
    id: 'crop-ragi',
    code: 'RAGI',
    nameEn: 'Ragi (Finger Millet)',
    nameHi: 'रागी (मडुआ)',
    nameOr: 'ମାଣ୍ଡିଆ',
    mspPerQuintal: 3846.0,
    maxMoisturePercent: 12.0,
    isActive: true,
  },
  {
    id: 'crop-maize',
    code: 'MAIZE',
    nameEn: 'Maize',
    nameHi: 'मक्का',
    nameOr: 'ମକା',
    mspPerQuintal: 2090.0,
    maxMoisturePercent: 14.0,
    isActive: true,
  },
];

@Injectable()
export class CropsService {
  private readonly logger = new Logger(CropsService.name);

  constructor(private prisma: PrismaService) {}

  async findAll() {
    try {
      const crops = await this.prisma.crop.findMany({
        where: { isActive: true },
        orderBy: { nameEn: 'asc' },
      });
      return crops && crops.length > 0 ? crops : DEFAULT_CROPS;
    } catch {
      return DEFAULT_CROPS;
    }
  }

  async findOne(id: string) {
    try {
      const crop = await this.prisma.crop.findUnique({
        where: { id },
      });
      return crop || DEFAULT_CROPS.find((c) => c.id === id || c.code === id) || null;
    } catch {
      return DEFAULT_CROPS.find((c) => c.id === id || c.code === id) || null;
    }
  }
}
