import { Controller, Get, Query, Res, HttpStatus } from "@nestjs/common";
import { QuotesService } from "./quotes.service";
import { Response } from "express";
import { Body, Post } from "@nestjs/common";

@Controller("quotes")
export class QuotesController {
  constructor(private readonly quotesService: QuotesService) {}

  @Get("random")
  async random(@Query("tag") tag: string, @Res() res: Response) {
    const q = await this.quotesService.getRandom(tag);
    if (!q) {
      return res.status(HttpStatus.NO_CONTENT).send();
    }
    return res.status(HttpStatus.OK).json(q);
  }
  @Get()
  async findAll() {
    return this.quotesService.findAll();
  }
  @Post()
  create(@Body() body: any) {
    return this.quotesService.create({
      text: body.text,
      language: body.language,
      authorId: Number(body.authorId),
      tagIds: (body.tagIds ?? []).map(Number),
    });
  }
}
