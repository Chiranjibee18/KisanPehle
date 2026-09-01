import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class CropsService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.crop.findMany({
      where: { isActive: true },
      orderBy: { nameEn: 'asc' },
    });
  }

  async findOne(id: string) {
    return this.prisma.crop.findUnique({
      where: { id },
    });
  }
}
