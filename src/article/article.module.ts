import { Module } from '@nestjs/common';
import { ArticleService } from './article.service';
import { ArticleController } from './article.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { Article, articleSchema } from './entities/article.schema';
import { JwtModule, JwtService } from '@nestjs/jwt';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true
    }),
    MongooseModule.forRoot(process.env.DB_URI,{dbName: 'pratama'}),
    MongooseModule.forFeature([{name: Article.name, schema: articleSchema}]),
  ],
  controllers: [ArticleController],
  providers: [ArticleService, JwtService]
})
export class ArticleModule {}
