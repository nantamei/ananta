import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ObjectId, Types } from 'mongoose'

@Schema({
    timestamps: true
})

export class Article{

    @Prop()
    title: string

    @Prop()
    description: string

    @Prop()
    userId: Types.ObjectId
}

export const articleSchema = SchemaFactory.createForClass(Article)