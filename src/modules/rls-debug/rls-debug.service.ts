import { Inject, Injectable, Logger } from '@nestjs/common';
import { Pool, PoolClient } from '@neondatabase/serverless';
import { PG_POOL } from '@db/index';

export interface RlsCheckResult {
  check: string;
  passed: boolean;
  detail: unknown;
  recommendation?: string;
}

/**
 * RlsDebugService
 *
 * Runs raw SQL against the Neon pool to verify RLS is correctly configured.
 * Uses SET LOCAL so each impersonation is scoped to a single transaction
 * and never bleeds into other connections in the pool.
 */
@Injectable()
export class RlsDebugService {
  private readonly logger = new Logger(RlsDebugService.name);

  constructor(@Inject(PG_POOL) private readonly pool: Pool) {}

  // ── Helpers ────────────────────────────────────────────────────────────────

  /**
   * Run a callback inside a transaction with a specific JWT claims context.
   * The transaction is always rolled back — we never mutate data here.
   */
  private async withClaims<T>(
    claims: Record<string, unknown>,
    fn: (client: PoolClient) => Promise<T>,
  ): Promise<T> {
    const client = await this.pool.connect();
    try {
      await client.query('BEGIN');
      await client.query(`SELECT set_config('request.jwt.claims', $1, true)`, [
        JSON.stringify(claims),
      ]);
      const result = await fn(client);
      return result;
    } finally {
      // Always rollback — debug reads only, never commit
      await client.query('ROLLBACK');
      client.release();
    }
  }

  // ── Check 1: Policy exists ─────────────────────────────────────────────────

  async checkPolicyExists(): Promise<RlsCheckResult> {
    const result = await this.pool.query<{
      policyname: string;
      permissive: string;
      cmd: string;
      qual: string;
    }>(`
      SELECT policyname, permissive, roles, cmd, qual
      FROM pg_policies
      WHERE tablename = 'trip'
        AND policyname = 'trips_select'
    `);

    const found = result.rows.length > 0;

    return {
      check: 'policy_exists',
      passed: found,
      detail: result.rows[0] ?? null,
      recommendation: found
        ? undefined
        : 'Policy "trips_select" is missing from pg_policies. Run your CREATE POLICY statement.',
    };
  }

  // ── Check 2: RLS enabled and forced ───────────────────────────────────────

  async checkRlsEnabled(): Promise<RlsCheckResult> {
    const result = await this.pool.query<{
      relname: string;
      relrowsecurity: boolean;
      relforcerowsecurity: boolean;
    }>(`
      SELECT relname, relrowsecurity, relforcerowsecurity
      FROM pg_class
      WHERE relname = 'trip'
    `);

    const row = result.rows[0];
    const rlsOn = row?.relrowsecurity === true;
    const forced = row?.relforcerowsecurity === true;
    const passed = rlsOn && forced;

    const fixes: string[] = [];
    if (!rlsOn) fixes.push('ALTER TABLE trip ENABLE ROW LEVEL SECURITY;');
    if (!forced) fixes.push('ALTER TABLE trip FORCE ROW LEVEL SECURITY;');

    return {
      check: 'rls_enabled_and_forced',
      passed,
      detail: row ?? null,
      recommendation: fixes.length ? fixes.join(' | ') : undefined,
    };
  }

  // ── Check 3: Unauthenticated access ───────────────────────────────────────

  async testUnauthenticatedAccess(): Promise<RlsCheckResult> {
    // Empty claims → auth.user_id() returns NULL inside Postgres
    const rows = await this.withClaims({}, async (client) => {
      const res = await client.query(`
        SELECT id, name, is_public
        FROM trip
        WHERE is_public = false
        LIMIT 5
      `);
      return res.rows;
    });

    const passed = rows.length === 0;

    return {
      check: 'unauthenticated_cannot_see_private_trips',
      passed,
      detail: {
        privateTripsExposed: rows.length,
        exposedRows: passed ? [] : rows,
      },
      recommendation: passed
        ? undefined
        : `CRITICAL: ${rows.length} private trip(s) visible with no auth. ` +
          `Verify auth.user_id() is mapped to request.jwt.claims->>'sub' in your Postgres function.`,
    };
  }

  // ── Check 4: Stranger cannot see another user's private trips ─────────────

  async testStrangerAccess(ownerId: string): Promise<RlsCheckResult> {
    const strangerId = `debug_stranger_${Date.now()}`;

    const rows = await this.withClaims({ sub: strangerId }, async (client) => {
      const res = await client.query(
        `
        SELECT id, name, is_public, user_id
        FROM trip
        WHERE user_id = $1
          AND is_public = false
        LIMIT 5
      `,
        [ownerId],
      );
      return res.rows;
    });

    const passed = rows.length === 0;

    return {
      check: 'stranger_cannot_see_private_trips',
      passed,
      detail: {
        simulatedOwnerId: ownerId,
        simulatedStrangerId: strangerId,
        privateTripsExposed: rows.length,
        exposedRows: passed ? [] : rows,
      },
      recommendation: passed
        ? undefined
        : `CRITICAL: A stranger can read ${rows.length} private trip(s) owned by ${ownerId}. ` +
          `The USING clause on trips_select is not filtering correctly.`,
    };
  }

  // ── Check 5: Owner can see their own private trips ─────────────────────────

  async testOwnerAccess(ownerId: string): Promise<RlsCheckResult> {
    const rows = await this.withClaims({ sub: ownerId }, async (client) => {
      const res = await client.query(
        `
        SELECT id, name, is_public
        FROM trip
        WHERE user_id = $1
        LIMIT 10
      `,
        [ownerId],
      );
      return res.rows;
    });

    return {
      check: 'owner_can_see_own_trips',
      passed: true,
      detail: {
        ownerId,
        tripsVisible: rows.length,
        sample: rows.slice(0, 3),
      },
      recommendation:
        rows.length === 0
          ? `User ${ownerId} has no trips yet — seed a trip for this user to make this check meaningful.`
          : undefined,
    };
  }

  // ── Check 6: Full report ───────────────────────────────────────────────────

  async runAllChecks(ownerId?: string): Promise<{
    allPassed: boolean;
    summary: string;
    checks: RlsCheckResult[];
  }> {
    const checks = await Promise.all([
      this.checkPolicyExists(),
      this.checkRlsEnabled(),
      this.testUnauthenticatedAccess(),
      ownerId
        ? this.testStrangerAccess(ownerId)
        : Promise.resolve<RlsCheckResult>({
            check: 'stranger_cannot_see_private_trips',
            passed: false,
            detail: 'Skipped — pass ?ownerId=<clerk_user_id> to enable',
          }),
      ownerId
        ? this.testOwnerAccess(ownerId)
        : Promise.resolve<RlsCheckResult>({
            check: 'owner_can_see_own_trips',
            passed: false,
            detail: 'Skipped — pass ?ownerId=<clerk_user_id> to enable',
          }),
    ]);

    const failed = checks.filter((c) => !c.passed);
    const allPassed = failed.length === 0;

    if (!allPassed) {
      this.logger.warn(
        `RLS check failures: ${failed.map((c) => c.check).join(', ')}`,
      );
    }

    return {
      allPassed,
      summary: allPassed
        ? '✅ All RLS checks passed.'
        : `❌ ${failed.length} check(s) failed: ${failed.map((c) => c.check).join(', ')}`,
      checks,
    };
  }
}
