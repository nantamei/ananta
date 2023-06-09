import { Injectable, UnauthorizedException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import {PassportStrategy} from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { Users } from "./entities/user.schema";
import { Model } from 'mongoose';



@Injectable()
export class jwtstrategy extends PassportStrategy(Strategy){
    constructor(
        @InjectModel(Users.name)
        private Usermodel: Model<Users>
    ){
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme("jwt"),
            secretOrKey: process.env.JWT_SECRET
        })
    }

    async validate(payload){
        const { id } = payload;

        const user = await this.Usermodel.findById(id);
        if(!user){
            throw new UnauthorizedException('Login first to access this endpoin.')
        }
        return user
    }
}