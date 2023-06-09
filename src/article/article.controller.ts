import { Controller, Get, Post, Body, Request, UnauthorizedException, Put, Delete, Param, UseGuards} from '@nestjs/common';
import { ArticleService } from './article.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { AuthGuard } from 'src/users/users.guard';
import { UpdateArticleDto } from './dto/update-article.dto';
import { Types } from 'mongoose';

@Controller('users')
export class ArticleController {
  constructor(
    private readonly articleService: ArticleService
    ) {}
    
  @Post('/article')
  @UseGuards(AuthGuard)
  async getUserId(@Request() req, @Body() CreateArticleDto: CreateArticleDto): Promise<any>{
    const user = req.user
    const userData = await this.articleService.create(user, CreateArticleDto)
    return userData;
  }

  @Get('/user/article')
  @UseGuards(AuthGuard)
  async getdatawithuser(@Request() req ): Promise<any>{
    try{
      const user = req.user
      const userData = await this.articleService.getDataByUserId(user)
      return userData;
    }catch(error){
      throw new UnauthorizedException('maaf gagal')
    }
  }

  @Put('user/article/:id')
  @UseGuards(AuthGuard)
  async updateArticle(@Request() req, @Param('id') idArticle: Types.ObjectId, @Body() updateArticleDto: UpdateArticleDto): Promise<any> {
    const user = req.user
    const updatedArticle = await this.articleService.updateArticle(user, idArticle, updateArticleDto);
    return updatedArticle;
  }

  @Delete('user/article/:id')
  @UseGuards(AuthGuard)
  async deleteArticle(@Param('id') idArticle: Types.ObjectId , @Request() req): Promise<any>{ 
    const user = req.user
    const deleteArticle = await this.articleService.deleteData(user, idArticle)
    if(!deleteArticle){
      throw new UnauthorizedException('User not authorized to delete data')
    }
    return { message: 'Article deleted successfully'}
  }

}
