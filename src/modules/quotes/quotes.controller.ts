import { Controller, Get, Query, Res, HttpStatus } from '@nestjs/common';
import { QuotesService } from './quotes.service';

@Controller('quotes')
export class QuotesController {
  constructor(private readonly quotesService: QuotesService) {}

  @Get('random')
  async random(@Query('tag') tag: string, @Res() res) {
    const q = await this.quotesService.getRandom(tag);
    if (!q) {
      return res.status(HttpStatus.NO_CONTENT).send();
    }
    return res.status(HttpStatus.OK).json(q);
  }
}
