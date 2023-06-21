import { UseGuards, Controller, Get, Post, Body, Request, UnauthorizedException } from '@nestjs/common';
import { UsersService } from './users.service';
import { loginUserDto } from './dto/login-user.dto';
import { RegisterUserDto } from './dto/register-user.dto';
import { AuthGuard } from './users.guard';


class ResponseLogin { 
  token: { accessToken: string, refreshToken : string};
  user: { email: string, name : string}
}

class ResponseRegister extends ResponseLogin{}

class ResponseGetUser {
  name: string;
  email: string;
}

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('/auth/register')
    register(@Body() registerUserDto: RegisterUserDto): Promise <ResponseRegister> {
    return this.usersService.register(registerUserDto);
  }

  @Post('/auth/login')
    login(@Body() loginUserDto: loginUserDto): Promise <ResponseLogin> {
    return this.usersService.login(loginUserDto);
  }
    
  @Get('/auth/user')
  @UseGuards(AuthGuard)
  async getUserbyToken(@Request() req): Promise<ResponseGetUser> {
    if (req.user && req.user?.id) {
      const user = await this.usersService.getDataByToken(req.user.id);
      return {
        name: user.name,
        email: user.email,
      };
    } else {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
  