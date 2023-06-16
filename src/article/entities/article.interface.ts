import { Document, ObjectId, Types } from 'mongoose'

export interface Iarticle extends Document{
    readonly _id: Types.ObjectId;
    readonly title: string;
    readonly description: string;
    readonly userId: Types.ObjectId;
    readonly createdAt: Date;
    readonly updatedAt: Date;
}