declare namespace Express {
  interface Request {
    auth?: {
      userId: string;
      accessToken: string;
    };
  }
}