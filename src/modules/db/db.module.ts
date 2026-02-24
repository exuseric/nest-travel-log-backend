import { Global, Inject, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
// import { Pool } from 'pg';
import { Pool } from '@neondatabase/serverless';
import { PG_POOL } from '@db/index';
import { DBService } from './db.service';
import { DBInterceptor } from '@db/db.interceptor';

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
    DBService,
    DBInterceptor,
  ],
  exports: [PG_POOL, DBService, DBInterceptor],
})
export class DBModule {
  constructor(@Inject(PG_POOL) private pool: Pool) {}

  async onModuleDestroy() {
    await this.pool.end();
  }
}
