import {
  Global,
  Inject,
  InternalServerErrorException,
  Logger,
  Module,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
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
export class DBModule implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(DBModule.name);

  constructor(@Inject(PG_POOL) private pool: Pool) {}

  async onModuleInit() {
    this.pool.on('error', (error) => {
      this.logger.error('Unexpected PostgreSQL pool error', error);
    });

    try {
      const client = await this.pool.connect();
      try {
        await client.query('SELECT 1');
      } finally {
        client.release();
      }
    } catch (error) {
      this.logger.error(
        'Failed to connect to PostgreSQL on startup. Check DATABASE_URL credentials.',
        error as Error,
      );
      throw new InternalServerErrorException(
        'Database connection failed during startup',
      );
    }
  }

  async onModuleDestroy() {
    await this.pool.end();
  }
}
