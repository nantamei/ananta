import { Injectable,UnauthorizedException} from '@nestjs/common';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { Article } from './entities/article.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose'

class artcontent{
  articleadd : {
    title : String,
    description : String,
    userId: Types.ObjectId
  }
}

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
      return responeArticle;
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

  async updateArticle(user: Types.ObjectId, idArticle: Types.ObjectId, updateArticle: UpdateArticleDto ): Promise<artcontent | string>{
    const { title, description } = updateArticle
    const validateArticle = await this.articleModel.findOne({_id : idArticle, by_user: user.id});
    if(!validateArticle){ 
      return (`maaf artikel milik anda dengan id = (${idArticle}) tidak di temukan !`)
    }
    if(title == "" || description == ""){
      return "gagal update karena data kosong"
    }
    return this.articleModel.findByIdAndUpdate(idArticle, UpdateArticleDto, {new:true})
  }

  async deleteData(user: Types.ObjectId, idArticle: Types.ObjectId): Promise<string | Article>{
    const validateDelete = await this.articleModel.findOne({_id : idArticle, by_user: user.id});
    if(!validateDelete){ 
      return (`maaf artikel milik anda dengan id = (${idArticle}) tidak di temukan !`)
    }
    return this.articleModel.findByIdAndDelete(idArticle)
  }
}
