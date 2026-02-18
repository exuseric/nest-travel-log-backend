import { Controller, Get, UseGuards, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ClerkGuard } from 'src/guards/clerk/clerk.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('user')
  @UseGuards(ClerkGuard)
  async getUser(@Req() req: any) {
    const userId = req.userId;
    return this.authService.getUser(userId);
  }
}
