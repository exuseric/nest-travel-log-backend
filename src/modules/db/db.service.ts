import {
  Inject,
  Injectable,
  InternalServerErrorException,
  Scope,
} from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Pool, PoolClient } from 'pg';
import { drizzle, NodePgDatabase } from 'drizzle-orm/node-postgres';
import { PG_POOL } from '@db/index';
import * as schema from 'src/data/models';
import type { Request } from 'express';

@Injectable({ scope: Scope.REQUEST })
export class DbService {
  private client: PoolClient | undefined;
  private _db: NodePgDatabase<typeof schema> | undefined;

  constructor(
    @Inject(PG_POOL) private pool: Pool,
    @Inject(REQUEST) private request: Request,
  ) {}

  async getDb(currentUserId?: string): Promise<NodePgDatabase<typeof schema>> {
    if (this._db) return this._db;

    this.client = await this.pool.connect();
    const auth = this.request.auth;

    const effectiveUserId = currentUserId || auth?.userId; // Use passed userId or from auth

    if (effectiveUserId) {
      // Set public.current_user_id directly
      await this.client.query(
        `SELECT set_config('public.current_user_id', $1, true)`,
        [effectiveUserId],
      );
    } else {
      // Ensure public.current_user_id is unset or null for anonymous users
      await this.client.query(
        `SELECT set_config('public.current_user_id', '', true)`,
      );
    }

    await this.client.query('BEGIN');
    const { rows: userIdAfterBegin } = await this.client.query(
      `SELECT public.user_id() as user_id_after_begin`,
    );
    const { rows: currentUser } = await this.client.query(
      `SELECT current_user as current_db_user;`,
    );
    const { rows: currentRole } = await this.client.query(
      `SELECT current_role as current_db_role;`,
    );

    console.log(
      'DbService: user_id() after BEGIN:',
      userIdAfterBegin[0].user_id_after_begin,
    );
    console.log(
      'DbService: current_user after BEGIN:',
      currentUser[0].current_db_user,
    );
    console.log(
      'DbService: current_role after BEGIN:',
      currentRole[0].current_db_role,
    );
    this._db = drizzle(this.client, { schema });
    return this._db;
  }

  async release(): Promise<void> {
    if (this.client) {
      try {
        await this.client.query('COMMIT');
      } catch {
        await this.client.query('ROLLBACK');
      } finally {
        await this.client.query(`RESET ROLE`); // Reset role on connection release
        this.client.release();
        this.client = undefined;
        this._db = undefined;
      }
    }
  }
}