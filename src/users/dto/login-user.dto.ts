import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator'


export class loginUserDto {

    @IsNotEmpty()
    @IsEmail()
    readonly email: string;

    @IsNotEmpty()
    @IsString()
    @MinLength(6)
    readonly password: string;
}
