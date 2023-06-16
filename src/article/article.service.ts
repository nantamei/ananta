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

async create(token: string, CreateArticleDto: CreateArticleDto): Promise <any | Article>{
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

async getDataByUserId(token: string): Promise<any | Article[]>{
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

async deleteData(token: string, id: string): Promise<Article>{
  try{
  const decoded: any = jwt.verify(token,this.secretKey);
  const {id: userId} = decoded;
  const dArticle = await this.articleModel.find({id, userId}).exec();
  const delArticle = await this.articleModel.findOne({_id: id}).exec();
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
  
  // if(!dArticle){
  //   throw new UnauthorizedException('article not found')
  // }
  // const deleteArticle = await this.articleModel.findByIdAndDelete('id').exec();
  // if(!deleteArticle){
  //   throw new UnauthorizedException('User not authorized to delete data')
  // }
  // return decoded;


}
