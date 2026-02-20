import {
  Controller,
  ForbiddenException,
  Get,
  Param,
  Req,
  UseGuards,
} from '@nestjs/common';
import type { Request } from 'express';
import { AuthService } from './auth.service';
import { ClerkGuard } from 'src/guards/clerk/clerk.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('user/:id')
  @UseGuards(ClerkGuard)
  async getUser(@Param('id') id: string, @Req() req: Request) {
    if (id !== req.auth?.userId) {
      throw new ForbiddenException(
        'You are not authorized to access this user data',
      );
    }

    return this.authService.getUser(id);
  }
}
