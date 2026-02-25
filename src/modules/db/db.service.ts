import { Inject, Injectable, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
// import { Pool, PoolClient } from 'pg';
import { PG_POOL } from '@db/index';
import { Pool, PoolClient } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import type { Request } from 'express';
import * as schema from 'src/data/models';

// @Injectable({ scope: Scope.REQUEST })
// export class DBService {
//   private client: PoolClient | undefined;
//   private _db: NodePgDatabase<typeof schema> | undefined;

//   constructor(
//     @Inject(PG_POOL) private pool: Pool,
//     @Inject(REQUEST) private request: Request,
//   ) {}

//   async getDb(): Promise<NodePgDatabase<typeof schema>> {
//     if (this._db) return this._db;

//     this.client = await this.pool.connect();

//     try {
//       await this.client.query('BEGIN');

//       const userId = this.request.auth?.userId ?? null;
//       const accessToken = this.request.auth?.accessToken ?? null;

//       await this.client.query(`SELECT set_config('request.jwt', $1, true)`, [
//         accessToken,
//       ]);

//       // const userId = this.request.auth?.userId ?? null;
//       // await this.client.query(`SELECT set_config('app.user_id', $1, true)`, [
//       //   userId,
//       // ]);

//       this._db = drizzle(this.client, { schema });
//       return this._db;
//     } catch (error) {
//       await this.client.query('ROLLBACK');
//       this.client.release();
//       this.client = undefined;
//       throw error;
//     }
//   }

//   async release(): Promise<void> {
//     if (!this.client) return;

//     try {
//       await this.client.query('COMMIT');
//     } catch (error) {
//       await this.client.query('ROLLBACK');
//       throw error;
//     } finally {
//       this.client.release();
//       this.client = undefined;
//       this._db = undefined;
//     }
//   }
// }

@Injectable({ scope: Scope.REQUEST })
export class DBService {
  private client: PoolClient | undefined;
  private _db: NodePgDatabase<typeof schema> | undefined;

  constructor(
    @Inject(PG_POOL) private pool: Pool,
    @Inject(REQUEST) private request: Request,
  ) {}

  async getDb(): Promise<NodePgDatabase<typeof schema>> {
    if (this._db) return this._db;

    this.client = await this.pool.connect();
    await this.client.query('BEGIN');

    const userId = this.request.auth?.userId ?? null;

    await this.client.query(
      `SELECT set_config('request.jwt.claims', $1, true)`,
      [JSON.stringify({ sub: userId })],
    );

    this._db = drizzle(this.client, { schema });
    return this._db;
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
