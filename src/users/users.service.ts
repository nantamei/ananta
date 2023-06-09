import { Injectable, UnauthorizedException } from '@nestjs/common';
import { loginUserDto } from './dto/login-user.dto';
import { registerUserDto } from './dto/register-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Users } from './entities/user.schema';
import { JwtService } from '@nestjs/jwt';
import { Model } from 'mongoose'

import * as bcrypt from 'bcryptjs'


@Injectable()
export class UsersService {
  constructor(
    @InjectModel(Users.name)
    private usermodel: Model<Users>,
    private jwtService: JwtService
  ) {}

  async register(registerUserDto: registerUserDto): Promise <{token: string}>{
   const {name, email, password} = registerUserDto;

   const regis = await this.usermodel.findOne({email})
   const hashedpassword = await bcrypt.hash(password,10)
   if(!regis){
    const user = await this.usermodel.create({
      name,
      email,
      password: hashedpassword
    });
    const token = this.jwtService.sign({id: user._id})
    return{token}
   }else{
    throw new UnauthorizedException('email duplicate')
   }
  }

  async login(loginUserDto:loginUserDto): Promise<{token: string}>{
    const {email, password} = loginUserDto

    const user = await this.usermodel.findOne({email})

    if(!user){
    throw new UnauthorizedException('invalid email or password')
    }
    const isPasswordMached = await bcrypt.compare(password, user.password)
    if(!isPasswordMached){
      throw new UnauthorizedException('invalid email or password')
    }
    const token = this.jwtService.sign({ id: user._id })
    return{ token }
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
