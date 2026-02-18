import { Inject, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import { DB_CONN, PG_POOL } from 'src/db/db';
import * as schema from 'src/db/schema';

@Module({
  providers: [
    {
      provide: PG_POOL,
      useFactory: (configService: ConfigService) => {
        const pool = new Pool({
          connectionString: configService.getOrThrow<string>('DATABASE_URL'),
          ssl: {
            rejectUnauthorized: true,
          },
        });
        return pool;
      },
      inject: [ConfigService],
    },
    {
      provide: DB_CONN,
      useFactory: (pool: Pool) => drizzle(pool, { schema }),
      inject: [PG_POOL],
    },
  ],
  exports: [DB_CONN, PG_POOL],
})
export class DBModule {
  constructor(@Inject(PG_POOL) private pool: Pool) {}

  async onModuleDestroy() {
    console.log('Destroying pool...');
    await this.pool.end();
  }
}
