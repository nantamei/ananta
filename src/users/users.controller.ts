import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UsersService } from './users.service';
import { loginUserDto } from './dto/login-user.dto';
import { registerUserDto } from './dto/register-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

    @Post('/auth/register')
     register(@Body() registerUserDto: registerUserDto): Promise<{ token: String}> {
      return this.usersService.register(registerUserDto);
    }

    @Post('/auth/login')
     login(@Body() loginUserDto: loginUserDto): Promise<{ token: String}> {
      return this.usersService.login(loginUserDto);
    }
  }
