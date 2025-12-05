import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';

@Injectable()
export class QuotesService {
  constructor(private prisma: PrismaService) {}

  async getRandom(tag?: string) {
    const where = tag ? { tags: { has: tag }, isDeleted: false } : { isDeleted: false };
    const count = await this.prisma.quote.count({ where });
    if (count === 0) return null;
    const skip = Math.floor(Math.random() * count);
    const [item] = await this.prisma.quote.findMany({ where, skip, take: 1 });
    return item ?? null;
  }
}
