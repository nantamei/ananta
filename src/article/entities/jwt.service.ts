import { Injectable } from "@nestjs/common";
import * as jwt from 'jsonwebtoken'

@Injectable()
export class JwtService {
    private readonly secretKey = 'ananta123456';

    decodeToken(token: string): any {
        try {
            const decoded = jwt.verify(token, this.secretKey);
            return decoded;
        } catch(error){
            throw new error('Invalid token')
        }
    }
}