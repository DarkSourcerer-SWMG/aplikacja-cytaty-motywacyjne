import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { QuotesModule } from './modules/quotes/quotes.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    QuotesModule
  ],
})
export class AppModule {}
