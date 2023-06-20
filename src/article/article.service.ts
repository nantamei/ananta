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

async create(user: any, CreateArticleDto: CreateArticleDto): Promise <any | Article>{
  try{
    const { title, description } = CreateArticleDto;
    const newArticle = new this.articleModel({
      title,
      description,
      userId: user.id,
    })
    const savedArticle = await newArticle.save();
    const responeArticle = await this.articleModel.findById(savedArticle._id).exec();
    return { docs : [responeArticle]}
  }catch (error){
    throw new UnauthorizedException('invalid token')
  }
}

async getDataByUserId(user: any): Promise<any | Article[]>{
  try {
    const userArticle = await this.articleModel.find({ userId: user.id }).exec();
    return { docs: userArticle };
  } catch (error) {
    throw new UnauthorizedException('data tidak ada');
  }
}

async updateDataArticle(user: any, dataUpdate: string, updateArticleDto: UpdateArticleDto): Promise<any | Article | boolean>{
  try{
  const article = await this.articleModel.find({ userId: user.id}).exec();
  const searchArticle = await this.articleModel.findOne({_id: dataUpdate}).exec();

    if (!article) {
      throw new UnauthorizedException('artikelId not found');
    } else{
      const valid = await this.articleModel.findOne({userId: user.id, _id: dataUpdate})
      if(valid){
        return this.articleModel.findByIdAndUpdate(dataUpdate, updateArticleDto,{new:true})
      }else{
      return('maaf anda salah mengambil artikel')  
    }
  }
  } catch(error){
    const searchArticle = await this.articleModel.findOne({_id: dataUpdate }).exec();
    if(!searchArticle){
      throw new UnauthorizedException('pastikan id benar');
    }else{
      const warning = "maaf token salah"
      throw new UnauthorizedException(warning);
    }
  }
}

async deleteData(user: any, id: string): Promise<Article>{
  try{
  const dArticle = await this.articleModel.find({ userId: user.id}).exec();
  const delArticle = await this.articleModel.findOne({_id: id, userId: user.id}).exec();
    if (!dArticle) {
      throw new UnauthorizedException('userId not found');
    } else if(!delArticle){
      throw new UnauthorizedException('Article not found');
    }else{  
      return this.articleModel.findByIdAndDelete(id,{new:true})
    }
    } catch(error){
      const searchArticle = await this.articleModel.findOne({_id: id }).exec();
    if(!searchArticle){
      throw new UnauthorizedException('pastikan token benar');
    }else{
      const warning = "maaf token salah"
      throw new UnauthorizedException(warning);
    }
  }
}
  
}
