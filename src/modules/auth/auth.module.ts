import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { WebhooksController } from './webhooks.controller';

@Module({
  controllers: [AuthController, WebhooksController],
  providers: [AuthService],
})
export class AuthModule {}
