import { ExecutionContext, Injectable } from '@nestjs/common';
import { ClerkGuard } from './clerk.guard';

@Injectable()
export class ClerkSoftGuard extends ClerkGuard {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      return await super.canActivate(context);
    } catch {
      // Not authenticated — allow through, req.auth will be undefined
      // DbService will set anon role, RLS will only show public content
      return true;
    }
  }
}