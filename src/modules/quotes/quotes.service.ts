import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma.service";

@Injectable()
export class QuotesService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.quote.findMany({
      where: { isDeleted: false },
      include: {
        author: true,
        tags: true,
      },
    });
  }
  async create(data: {
    text: string;
    language: string;
    authorId: number;
    tagIds: number[];
  }) {
    return this.prisma.quote.create({
      data: {
        text: data.text,
        language: data.language,
        authorId: data.authorId,
        tags: {
          connect: data.tagIds.map((id) => ({ id })),
        },
      },
      include: {
        author: true,
        tags: true,
      },
    });
  }

  async getRandom(tag?: string) {
    const where = tag
      ? {
          isDeleted: false,
          tags: {
            some: {
              name: tag,
            },
          },
        }
      : {
          isDeleted: false,
        };
    const count = await this.prisma.quote.count({
      where,
    });
    if (count === 0) return null;
    const skip = Math.floor(Math.random() * count);
    const [item] = await this.prisma.quote.findMany({
      where,
      skip,
      take: 1,
      include: {
        author: true,
        tags: true,
      },
    });

    return item ?? null;
  }
}
