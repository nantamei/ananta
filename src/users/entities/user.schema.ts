import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'

@Schema({
    timestamps: true
})

export class Users{

    @Prop()
    name: string

    @Prop()
    email: string

    @Prop()
    password: string
}

export const userSchema = SchemaFactory.createForClass(Users);