import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import { DB_CONN } from 'src/db/db';
import * as schema from 'src/db/schema';

@Module({
  providers: [
    {
      provide: DB_CONN,
      useFactory: (configService: ConfigService) => {
        const pool = new Pool({
          connectionString: configService.getOrThrow<string>('DATABASE_URL'),
        });
        return drizzle(pool, {
          schema: {
            ...schema,
          },
        });
      },
      inject: [ConfigService],
    },
  ],
  exports: [DB_CONN],
})
export class DBModule {}
