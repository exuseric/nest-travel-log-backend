import { Global, Inject, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Pool } from 'pg';
import { PG_POOL } from '@db/index';
import { DbService } from './db.service';
import { DbInterceptor } from '@db/db.interceptor';

@Global()
@Module({
  providers: [
    {
      provide: PG_POOL,
      useFactory: (configService: ConfigService) => {
        return new Pool({
          connectionString: configService.getOrThrow<string>('DATABASE_URL'),
          ssl: { rejectUnauthorized: true },
        });
      },
      inject: [ConfigService],
    },
    DbService,
    DbInterceptor,
  ],
  exports: [PG_POOL, DbService, DbInterceptor],
})
export class DBModule {
  constructor(@Inject(PG_POOL) private pool: Pool) {}

  async onModuleDestroy() {
    await this.pool.end();
  }
}