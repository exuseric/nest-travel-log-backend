import { createClerkClient } from '@clerk/backend';

let _clerkClient: ReturnType<typeof createClerkClient>;

export function getClerkClient() {
  if (!_clerkClient) {
    const secretKey = process.env.CLERK_SECRET_KEY;
    if (!secretKey) {
      throw new Error(
        'CLERK_SECRET_KEY is not defined in environment variables',
      );
    }
    _clerkClient = createClerkClient({ secretKey });
  }
  return _clerkClient;
}
