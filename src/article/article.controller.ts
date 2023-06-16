import { Controller, Get, Post, Body, Request, UnauthorizedException, Put, UseGuards, Param} from '@nestjs/common';
import { ArticleService } from './article.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { Iarticle } from './entities/article.interface';
import { AuthGuard } from 'src/users/users.guard';
import { UpdateArticleDto } from './dto/update-article.dto';

@Controller('users')
export class ArticleController {
  constructor(
    private readonly articleService: ArticleService
    ) {}
    
  @Post('/article')
  async getUserId(@Request() req, @Body() CreateArticleDto: CreateArticleDto): Promise<any>{
    const token = req.headers.authorization.split(' ')[1];
    const userData = await this.articleService.create(token, CreateArticleDto)
    return userData;
  }

  @Get('/user/article')
  async getdatawithuser(@Request() req ): Promise<any>{
    try{
    const token = req.headers.authorization.split(' ')[1];
    const userData = await this.articleService.getDataByUserId(token)
    return userData;
    }catch(error){
      throw new UnauthorizedException('maaf gagal')
    }
  }

  // async updateUser(@Req() req,@Param() updateData: string, @Body() UpdateArticleDto: UpdateArticleDto): Promise<any[]>{
    //   try{
  //   const { token } = req.headers.authorization.split(' ')[1];
  //   const updateUser = await this.articleService.updateByToken(token ,updateData, UpdateArticleDto);
  //   return updateUser
  //   }catch(error){
  //     throw new UnauthorizedException('data invalid') 
  //   }
  // }
  @Put('user/article/:id')
  async updateArticle(@Request() req, @Param('id') dataUpdate: string, @Body() updateArticleDto: UpdateArticleDto): Promise<any[]> {
    const token = req.headers.authorization.split(' ')[1];
    const updatedArticle = await this.articleService.updateDataArticle(token, dataUpdate, updateArticleDto);
    if (!token) {
      throw new UnauthorizedException('User not authorized to update data');
    }
    return updatedArticle;
  }




  // @Get('user/article')
  // // @UseGuards(AuthGuard)
  // async getOneArticle(@Req() req: Request): Promise<CreateArticleDto | any> {
  //   const userId = req['userId'];
  //   const articles = await this.articleService.findOneByUserId(userId);
  //   return  {docs: articles} 
  // }
  

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.articleService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateArticleDto: UpdateArticleDto) {
  //   return this.articleService.update(+id, updateArticleDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.articleService.remove(+id);
  // }
}