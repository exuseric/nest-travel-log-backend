import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ClerkGuard } from 'src/guards/clerk/clerk.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('user/:id')
  @UseGuards(ClerkGuard)
  async getUser(@Param('id') id: string) {
    return this.authService.getUser(id);
  }
}
