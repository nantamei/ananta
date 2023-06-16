import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { timeStamp } from "console";
import { ObjectId, Types } from 'mongoose'

@Schema({
    timestamps: true
})

export class Article{

    // @Prop()
    // _id: Types.ObjectId

    @Prop()
    title: string

    @Prop()
    description: string

    @Prop()
    userId: Types.ObjectId
}

export const articleSchema = SchemaFactory.createForClass(Article)