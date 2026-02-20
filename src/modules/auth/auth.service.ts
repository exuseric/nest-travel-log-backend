import { Injectable } from '@nestjs/common';
import { getClerkClient } from 'src/guards/lib/clerk-client';

@Injectable()
export class AuthService {
  async getUser(userId: string) {
    const clerkClient = getClerkClient();
    const user = await clerkClient.users.getUser(userId);

    return {
      id: user.id,
      email: user.emailAddresses[0].emailAddress,
      firstName: user.firstName,
      lastName: user.lastName,
      imageUrl: user.imageUrl,
    };
  }
}
