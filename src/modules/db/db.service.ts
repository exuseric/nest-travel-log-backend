// src/modules/db/db.service.ts
import { Inject, Injectable, Scope } from '@nestjs/common';
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

  async getDb(): Promise<NodePgDatabase<typeof schema>> {
    if (this._db) return this._db;

    this.client = await this.pool.connect();
    const auth = this.request.auth;

    // Begin transaction so set_config local values persist for the request
    await this.client.query('BEGIN');

    if (auth?.accessToken) {
      const [, payloadB64] = auth.accessToken.split('.');
      const claims = JSON.parse(
        Buffer.from(payloadB64, 'base64url').toString(),
      );
      await this.client.query(
        `SELECT set_config('request.jwt.claims', $1, true)`,
        [JSON.stringify(claims)],
      );
      await this.client.query(`SELECT set_config('request.jwt', $1, true)`, [
        auth.accessToken,
      ]);
    } else {
      await this.client.query(
        `SELECT set_config('request.jwt.claims', '', true)`,
      );
      await this.client.query(`SELECT set_config('request.jwt', '', true)`);
    }

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
        this.client.release();
        this.client = undefined;
        this._db = undefined;
      }
    }
  }
}