import { IsEmail, IsNotEmpty, IsString } from 'class-validator'
import { ObjectId, Types }  from 'mongoose'
import { Schema } from '@nestjs/mongoose';

@Schema({
    timestamps: true
})

export class CreateArticleDto {

    // @IsNotEmpty()
    // @IsString()
    // readonly _id: Types.ObjectId

    @IsNotEmpty()
    @IsString()
    readonly title: string;

    @IsNotEmpty()
    @IsString()
    readonly description: string;

    @IsNotEmpty()
    @IsString()
    readonly userId: ObjectId;

}
