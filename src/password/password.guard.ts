import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
  
@Injectable()
export class AuthGuard implements CanActivate {  
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const token = this.extractTokenFromHeader(request);
        if (!token) {
            throw new UnauthorizedException();
        }
        try {
            const api_url = `http://127.0.0.1:3001/oauth/token/verify/?access_token=${token}`
            const response = await fetch(api_url);
            const tokens = await response.json();
            console.log(tokens);
            if(tokens.status != 'Token valid') throw new UnauthorizedException();
            
      } catch {
        throw new UnauthorizedException();
      }
      return true;
    }
  
    private extractTokenFromHeader(request: Request): string | undefined {
      const [type, token] = request.headers.authorization?.split(' ') ?? [];
      return type === 'Bearer' ? token : undefined;
    }
  }