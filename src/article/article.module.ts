import { Module } from '@nestjs/common';
import { ArticleService } from './article.service';
import { ArticleController } from './article.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { Article, articleSchema } from './entities/article.schema';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { userSchema } from 'src/users/entities/user.schema';
import { UsersModule } from 'src/users/users.module';

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
  providers: [ArticleService]
})
export class ArticleModule {}
