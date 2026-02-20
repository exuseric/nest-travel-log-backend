import { InternalServerErrorException } from '@nestjs/common';
import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';

if (!process.env.DATABASE_URL) {
  throw new InternalServerErrorException(
    'DATABASE_URL environment variable is not set',
  );
}

export default defineConfig({
  out: './drizzle',
  schema: './src/data/models/index.ts',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL,
  },
});