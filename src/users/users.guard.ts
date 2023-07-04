import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException('maaf token salah');
    }
    try {
      const payload = await this.jwtService.verifyAsync(
        token,
        {
          secret: 'ananta123456'
        }
      );
     
      request['user'] = payload;
    } catch {
      throw new UnauthorizedException('maaf token salah');
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const token = request.headers?.authorization.replace('Bearer ', '');
    return token;
  }
}