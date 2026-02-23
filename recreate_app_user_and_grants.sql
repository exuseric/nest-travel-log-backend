-- Ensure you are connected as neondb_owner or a superuser with grant privileges before running this script.

-- Handle potential ownership issues before dropping app_user
-- Drop all objects owned by app_user. This is an aggressive approach
-- and should be used with caution if app_user might own important data.
DROP OWNED BY app_user;

-- Step 1: Create a new non-superuser, non-BYPASSRLS role for the application
DROP ROLE IF EXISTS app_user; -- Drop if exists to ensure a clean creation
CREATE ROLE app_user WITH
  LOGIN
  PASSWORD 'CelN!uuzWMkIh4FChMX&ofE3sA' -- Use the provided strong password
  NOSUPERUSER
  INHERIT
  NOCREATEDB
  NOCREATEROLE
  NOREPLICATION
  NOBYPASSRLS; -- Explicitly set NOBYPASSRLS

-- Step 2: Create a new role to be used as the 'authenticated' context for the app
-- This new role will be granted privileges similar to the existing 'authenticated' role
DROP ROLE IF EXISTS app_authenticated_role;
CREATE ROLE app_authenticated_role NOLOGIN;

-- Grant ALL privileges to app_authenticated_role on all existing tables in public schema
-- This mirrors the 'authenticated' role's privileges from rls_setup_and_policies.sql
GRANT ALL ON ALL TABLES IN SCHEMA public TO app_authenticated_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO app_authenticated_role;

-- Ensure future tables inherit grants for app_authenticated_role
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO app_authenticated_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO app_authenticated_role;


-- Step 3: Grant membership in anon and app_authenticated_role to app_user
-- This allows app_user to SET ROLE to anon or app_authenticated_role
GRANT anon TO app_user;
GRANT app_authenticated_role TO app_user;


-- Verify memberships (optional, for debugging)
SELECT
  r.rolname AS member,
  g.rolname AS granted_role
FROM
  pg_auth_members am
JOIN
  pg_roles r ON am.member = r.oid
JOIN
  pg_roles g ON am.roleid = g.oid
WHERE
  r.rolname = 'app_user';

-- Reminder:
-- 1. Update your NestJS application's DATABASE_URL to use 'app_user'
--    Example: DATABASE_URL="postgresql://app_user:CelN!uuzWMkIh4FChMX&ofE3sA@your_db_host:5432/your_db_name"
-- 2. Modify src/modules/db/db.service.ts to set 'app_authenticated_role'
--    instead of 'authenticated' when the user is authenticated.
--    Change: await this.client.query(`SELECT set_config('role', 'authenticated', true)`);
--    To:     await this.client.query(`SELECT set_config('role', 'app_authenticated_role', true)`);
