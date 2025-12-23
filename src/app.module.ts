import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { QuotesModule } from "./modules/quotes/quotes.module";
import { AuthorsModule } from "./modules/authors/authors.module";
import { TagsModule } from "./modules/tags/tags.module";

@Module({
  imports: [
    AuthorsModule,
    TagsModule,
    ConfigModule.forRoot({ isGlobal: true }),
    QuotesModule,
  ],
})
export class AppModule {}
