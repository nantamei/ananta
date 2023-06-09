import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { Users, userSchema } from './entities/user.schema';
import { JwtService } from '@nestjs/jwt/dist';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { jwtstrategy } from './jwt.strategy';


@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true
    }),
    MongooseModule.forRoot(process.env.DB_URI,{dbName: 'pratama'}),
    MongooseModule.forFeature([{ name:Users.name, schema: userSchema}]),
    PassportModule.register({defaultStrategy: 'jwt'}),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService ) => {
        return{
          secret: config.get<string>('JWT_SECRET'),
          signOptions: {expiresIn: '1h' }
        };
      },
    }),
  ],
  controllers: [UsersController],
  providers: [UsersService, jwtstrategy],
  exports: [jwtstrategy,PassportModule]
})
export class UsersModule {}
