import { Injectable,UnauthorizedException} from '@nestjs/common';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { Iarticle } from './entities/article.interface';
import { Article } from './entities/article.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose'
import { Users } from 'src/users/entities/user.schema';

import * as bcrypt from 'bcryptjs'
import * as jwt from 'jsonwebtoken';
import { exec } from 'child_process';

@Injectable()
export class ArticleService {
  private readonly secretKey = 'ananta123456';

  constructor(@InjectModel(Article.name) 
    private articleModel: Model<Article>
    ) {}

  async create(token: string, CreateArticleDto: CreateArticleDto): Promise <any | Article> {
    try{
    const decoded: any = jwt.verify(token, this.secretKey);
    const { id } = decoded;
    const { title, description } = CreateArticleDto;
    const newArticle = new this.articleModel({
      title,
      description,
      userId: id,
    })
    const savedArticle = await newArticle.save();
    const responeArticle = await this.articleModel.findById(savedArticle._id).exec();
    return { docs : [responeArticle]}
  }catch (error){
    throw new UnauthorizedException('invalid token')
  }
}

async getDataByUserId(token: string): Promise<any | Article[]> {
  const decoded: any = jwt.verify(token, this.secretKey);
  const { id } = decoded;
  try {
    const userArticle = await this.articleModel.find({ userId: id }).exec();
    return { docs: userArticle };
  } catch (error) {
    throw new UnauthorizedException('data tidak ada');
  }
}

async updateDataArticle(token: string, dataUpdate: string, updateArticleDto: UpdateArticleDto): Promise<any | Article | boolean>{
  try{
  const decoded: any = jwt.verify(token, this.secretKey);
  const { id } = decoded;
  const article = await this.articleModel.find({ userId: id}).exec();
  const searchArticle = await this.articleModel.findOne({_id: dataUpdate}).exec();

    if (!article) {
      throw new UnauthorizedException('userId not found');
    } else if(!searchArticle){
      throw new UnauthorizedException('Article not found');
    }else{  
      return this.articleModel.findByIdAndUpdate(dataUpdate, updateArticleDto,{new:true})
    }
  } catch(error){
    const searchArticle = await this.articleModel.findOne({_id: dataUpdate }).exec();
    if(!searchArticle){
      throw new UnauthorizedException('pastikan token benar');
    }else{
      const warning = "maaf token salah"
      throw new UnauthorizedException(warning);
    }
  }
}
// async updateDataArticle(token: string, updateData: string, updateArticleDto: UpdateArticleDto): Promise<any | Article[]> {
//   const decoded: any = jwt.verify(token, 'ananta123456');
//   const { id } = decoded;
//   const updatedArticle = await this.articleModel.findOneAndUpdate({ userId: id}, updateArticleDto, { new: true }).exec();
//   if (!updatedArticle) {
//     throw new UnauthorizedException('Article not found');
//   }const article = updateData
//   const useArticle = await this.articleModel.find({id: article});
//   if(!useArticle || useArticle.length == 0){
//     const updateArticle = await this.articleModel.findByIdAndUpdate(updatedArticle,UpdateArticleDto)
//     if(!updateArticle){
//       throw new UnauthorizedException('update gagal')
//     }else{
//       return updateArticle
//     }
//   }
// }






  // findOne(id: number) {
  //   return `This action returns a #${id} article`;
  // }

  // update(id: number, updateArticleDto: UpdateArticleDto) {
  //   return `This action updates a #${id} article`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} article`;
  
}
