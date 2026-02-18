import { verifyToken } from '@clerk/backend';
import type { Request } from 'express';
import {
  CanActivate,
  ExecutionContext,
  HttpException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

@Injectable()
export class ClerkGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<Request>();
    const authHeader = req.headers['authorization'];

    if (!authHeader?.startsWith('Bearer ')) {
      throw new UnauthorizedException('Missing Authorization header');
    }

    const token = authHeader.split(' ')[1];

    try {
      const payload = await verifyToken(token, {
        secretKey: process.env.CLERK_SECRET_KEY,
      });
      req.auth = { userId: payload.sub };
      return true;
    } catch (err) {
      if (err instanceof HttpException) throw err;
      console.error('Token verification failed:', err);

      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
