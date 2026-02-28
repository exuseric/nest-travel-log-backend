import {
  BadRequestException,
  Controller,
  Headers,
  Post,
  type RawBodyRequest,
  Req,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Webhook } from 'svix';
import { WebhookEvent } from '@clerk/backend';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';

@ApiTags('Auth')
@Controller('webhooks')
export class WebhooksController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  @Post('clerk')
  @ApiOperation({ summary: 'Handle Clerk webhook events' })
  async handleClerkWebhook(
    @Headers() headers: Record<string, string>,
    @Req() req: RawBodyRequest<Request>,
  ) {
    const WEBHOOK_SECRET = this.configService.get<string>(
      'CLERK_WEBHOOK_SECRET',
    );

    if (!WEBHOOK_SECRET) {
      throw new Error('Missing CLERK_WEBHOOK_SECRET in environment variables');
    }

    const svix_id = headers['svix-id'];
    const svix_timestamp = headers['svix-timestamp'];
    const svix_signature = headers['svix-signature'];

    if (!svix_id || !svix_timestamp || !svix_signature) {
      throw new BadRequestException('Missing Svix headers');
    }

    if (!req.rawBody) {
      throw new BadRequestException('Raw body is required for verification');
    }

    const payload = req.rawBody.toString('utf8');
    const wh = new Webhook(WEBHOOK_SECRET);

    let evt: WebhookEvent;

    try {
      evt = wh.verify(payload, {
        'svix-id': svix_id,
        'svix-timestamp': svix_timestamp,
        'svix-signature': svix_signature,
      }) as WebhookEvent;
    } catch (err) {
      console.error('Webhook verification failed:', (err as Error).message);
      throw new BadRequestException('Invalid signature');
    }

    const { type, data } = evt;

    switch (type) {
      case 'user.created':
      case 'user.updated': {
        const email = (data as any).email_addresses?.[0]?.email_address;
        if (!email) {
          throw new BadRequestException('User event missing primary email');
        }

        const userDto: CreateUserDto = {
          userId: data.id,
          firstName: (data as any).first_name ?? '',
          lastName: (data as any).last_name ?? '',
          email: email,
          avatarUrl: (data as any).image_url,
          emailVerified:
            (data as any).email_addresses?.[0]?.verification?.status ===
            'verified'
              ? true
              : false,
        };

        await this.authService.upsertUser(userDto);
        break;
      }
      default:
        console.log(`Unhandled webhook event type: ${type}`);
    }

    return { success: true };
  }
}
