import {
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
  Scope,
} from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Pool, PoolClient } from 'pg';
import { PG_POOL } from '@db/index';
import { drizzle } from 'drizzle-orm/node-postgres';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import type { Request } from 'express';
import * as schema from 'src/data/models';

@Injectable({ scope: Scope.REQUEST })
export class DBService {
  private readonly logger = new Logger(DBService.name);
  private client: PoolClient | undefined;
  private _db: NodePgDatabase<typeof schema> | undefined;

  constructor(
    @Inject(PG_POOL) private pool: Pool,
    @Inject(REQUEST) private request: Request,
  ) {}

  async getDb(): Promise<NodePgDatabase<typeof schema>> {
    if (this._db) return this._db;

    try {
      this.client = await this.pool.connect();
      await this.client.query('BEGIN');

      const userId = this.request.auth?.userId ?? null;

      await this.client.query(
        `SELECT set_config('request.jwt.claims', $1, true)`,
        [JSON.stringify({ sub: userId })],
      );

      this._db = drizzle(this.client, { schema });
      return this._db;
    } catch (error) {
      this.logger.error('Failed to initialize DB transaction', error as Error);
      if (this.client) {
        try {
          await this.client.query('ROLLBACK');
        } catch (rollbackError) {
          this.logger.error('Rollback failed after initialization error', rollbackError as Error);
        }
        this.client.release();
        this.client = undefined;
      }
      throw new InternalServerErrorException('Database connection failed');
    }
  }
  async release(): Promise<void> {
    if (!this.client) return;
    try {
      await this.client.query('COMMIT');
    } catch (error) {
      await this.client.query('ROLLBACK');
      throw error;
    } finally {
      this.client.release();
      this.client = undefined;
      this._db = undefined;
    }
  }
}
