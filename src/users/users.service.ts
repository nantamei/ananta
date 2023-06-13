import { Injectable, UnauthorizedException } from '@nestjs/common';
import { loginUserDto } from './dto/login-user.dto';
import { registerUserDto } from './dto/register-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Users } from './entities/user.schema';
import { JwtService } from '@nestjs/jwt';
import { Model } from 'mongoose'

import * as bcrypt from 'bcryptjs'
import { User } from './entities/user.entity';


@Injectable()
export class UsersService {
  constructor(
    @InjectModel(Users.name)
    private usermodel: Model<Users>,
    private jwtService: JwtService
  ) {}

  async register(registerUserDto: registerUserDto): Promise <{ token: { accessToken: string, refreshToken : string}, user: { email: string, name : string}}>{
   const {name, email, password} = registerUserDto;

   const regis = await this.usermodel.findOne({email})

   if(!regis){
    const hashedpassword = await bcrypt.hash(password,10)

    const users = await this.usermodel.create({
      name,
      email,
      password: hashedpassword
    });

    // const token = this.jwtService.sign({id: users._id})

    const token = {
      accessToken: this.jwtService.sign({id: users._id}),
      refreshToken: this.jwtService.sign({id: users._id})
    }
      const user = {
        email: users.email,
        name: users.name,
      }
    return{token, user}
   }else{
    throw new UnauthorizedException('email duplicate')
   }
  }

  async login(loginUserDto:loginUserDto): Promise <{ token: { accessToken: string, refreshToken : string}, user: { email: string, name : string}}>{
    const {email, password} = loginUserDto

    const users = await this.usermodel.findOne({email})

    if(!users){
    throw new UnauthorizedException('invalid email or password')
    }
    const isPasswordMached = await bcrypt.compare(password, users.password)
    if(!isPasswordMached){
      throw new UnauthorizedException('invalid email or password')
    }
    
    const token = {
      accessToken: this.jwtService.sign({id: users._id}),
      refreshToken: this.jwtService.sign({id: users._id})
    }
      const user = {
        email: users.email,
        name: users.name,
      }
    return{token, user}
    
  }

  async getDataByToken(token: string): Promise <Users> {
    return this.usermodel.findOne({ _id: token }).exec();
  }

  // create(createUserDto: CreateUserDto) {
  //   return 'This action adds a new user';
  // }

  // findAll() {
  //   return `This action returns all users`;
  // }

  // findOne(id: number) {
  //   return `This action returns a #${id} user`;
  // }

  // update(id: number, updateUserDto: UpdateUserDto) {
  //   return `This action updates a #${id} user`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} user`;
  // }
}
