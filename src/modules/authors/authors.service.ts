import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma.service";

@Injectable()
export class AuthorsService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.author.findMany();
  }

  create(name: string) {
    return this.prisma.author.create({
      data: { name },
    });
  }
}
