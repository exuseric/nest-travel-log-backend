BEGIN;

-- ====================================================================================================
-- Step 0: Clean up existing setup (Idempotent - safe to run multiple times)
-- This section now focuses on cleaning up policies and functions,
-- as dropping roles is problematic in this environment.
-- ====================================================================================================

-- Drop RLS policies first as they depend on roles
DROP POLICY IF EXISTS "view_users" ON public."user";
DROP POLICY IF EXISTS "manage_own_user" ON public."user";
DROP POLICY IF EXISTS "view_trips" ON public.trip;
DROP POLICY IF EXISTS "insert_own_trips" ON public.trip;
DROP POLICY IF EXISTS "update_own_trips" ON public.trip;
DROP POLICY IF EXISTS "delete_own_trips" ON public.trip;
DROP POLICY IF EXISTS "view_destinations" ON public.destination;
DROP POLICY IF EXISTS "insert_own_destinations" ON public.destination;
DROP POLICY IF EXISTS "update_own_destinations" ON public.destination;
DROP POLICY IF EXISTS "delete_own_destinations" ON public.destination;
DROP POLICY IF EXISTS "view_travel_details" ON public.travel_detail;
DROP POLICY IF EXISTS "insert_own_travel_details" ON public.travel_detail;
DROP POLICY IF EXISTS "update_own_travel_details" ON public.travel_detail;
DROP POLICY IF EXISTS "delete_own_travel_details" ON public.travel_detail;
DROP POLICY IF EXISTS "select_own_bookmarks" ON public.bookmark;
DROP POLICY IF EXISTS "insert_own_bookmarks" ON public.bookmark;
DROP POLICY IF EXISTS "delete_own_bookmarks" ON public.bookmark;



-- Drop function (use CASCADE to drop dependent objects like policies)
DROP FUNCTION IF EXISTS public.user_id() CASCADE;

-- Note: Dropping roles is problematic in this environment.
-- We will rely on 'CREATE ROLE IF NOT EXISTS' for idempotency of roles.

-- ====================================================================================================
-- Step 1: Create Core Roles (if they don't already exist)
-- ====================================================================================================

-- Create anon role for unauthenticated users
DO
$do$
BEGIN
   IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = 'anon') THEN
      CREATE ROLE anon NOLOGIN;
   END IF;
END
$do$;

-- Create the original 'authenticated' role (if it doesn't exist)
-- This role is referenced by RLS policies, but the app will use app_authenticated_role
DO
$do$
BEGIN
   IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = 'authenticated') THEN
      CREATE ROLE authenticated NOLOGIN;
   END IF;
END
$do$;

-- Create app_authenticated_role for the application's authenticated context
DO
$do$
BEGIN
   IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = 'app_authenticated_role') THEN
      CREATE ROLE app_authenticated_role NOLOGIN;
   END IF;
END
$do$;

-- Create app_user, the role the application connects with
DO
$do$
BEGIN
   IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = 'app_user') THEN
      CREATE ROLE app_user WITH
        LOGIN
        PASSWORD 'CelN!uuzWMkIh4FChMX&ofE3sA'
        NOSUPERUSER
        INHERIT
        NOCREATEDB
        NOCREATEROLE
        NOREPLICATION
        NOBYPASSRLS;
   END IF;
END
$do$;

-- ====================================================================================================
-- Step 2: Grant Role Memberships
-- ====================================================================================================

-- Grant app_user membership in anon and app_authenticated_role
-- These grants are idempotent if run multiple times.
GRANT anon TO app_user;
GRANT app_authenticated_role TO app_user;

-- Grant neondb_owner membership in anon and authenticated roles for SET ROLE (if applicable and allowed)
-- Note: This was problematic before. We include it for the anon role if neondb_owner also needs to SET ROLE anon.
-- We assume neondb_owner won't need to SET ROLE to 'authenticated' as app will use 'app_authenticated_role'.
-- If neondb_owner needs to SET ROLE anon for some reason, this is the place.
-- GRANT anon TO neondb_owner;

-- ====================================================================================================
-- Step 3: Set up Schema and Table Privileges
-- Note: RLS policies will further restrict access based on user context.
-- ====================================================================================================

-- Grant schema access
GRANT USAGE ON SCHEMA public TO anon, app_authenticated_role;

-- Grant table permissions to anon (SELECT only)
GRANT SELECT ON ALL TABLES IN SCHEMA public TO anon;

-- Grant table permissions to app_authenticated_role (ALL privileges)
GRANT ALL ON ALL TABLES IN SCHEMA public TO app_authenticated_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO app_authenticated_role;

-- Ensure future tables inherit grants for anon and app_authenticated_role
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT ON TABLES TO anon;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO app_authenticated_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO app_authenticated_role;

-- ====================================================================================================
-- Step 4: Create public.user_id() Function
-- ====================================================================================================

-- Create the public.user_id() function
-- It now directly reads a session variable set by the application.
CREATE OR REPLACE FUNCTION public.user_id() RETURNS text AS $$
SELECT nullif(current_setting('public.current_user_id', true), '')::text;
$$ LANGUAGE sql STABLE;

-- Grant execute on the function to the app_user role
GRANT EXECUTE ON FUNCTION public.user_id() TO app_user;

-- ====================================================================================================
-- Step 5: Enforce Row-Level Security on tables
-- ====================================================================================================

ALTER TABLE public.trip FORCE ROW LEVEL SECURITY;
ALTER TABLE public.destination FORCE ROW LEVEL SECURITY;
ALTER TABLE public.travel_detail FORCE ROW LEVEL SECURITY;
ALTER TABLE public."user" FORCE ROW LEVEL SECURITY;
ALTER TABLE public.bookmark FORCE ROW LEVEL SECURITY;


-- ====================================================================================================
-- Step 6: Create RLS Policies (referencing app_authenticated_role)
-- ====================================================================================================

-- Policies for public."user" table
DROP POLICY IF EXISTS "view_users" ON public."user";
CREATE POLICY "view_users" ON public."user" FOR SELECT TO public USING (true);

DROP POLICY IF EXISTS "manage_own_user" ON public."user";
CREATE POLICY "manage_own_user" ON public."user" FOR ALL TO app_user USING (id = public.user_id()) WITH CHECK (id = public.user_id());

-- Policies for public.trip table
DROP POLICY IF EXISTS "view_trips" ON public.trip;
CREATE POLICY "view_trips" ON public.trip FOR SELECT TO app_user USING ((is_public = true AND public.user_id() IS NULL) OR (user_id = public.user_id()));

DROP POLICY IF EXISTS "insert_own_trips" ON public.trip;
CREATE POLICY "insert_own_trips" ON public.trip FOR INSERT TO app_user WITH CHECK (user_id = public.user_id());

DROP POLICY IF EXISTS "update_own_trips" ON public.trip;
CREATE POLICY "update_own_trips" ON public.trip FOR UPDATE TO app_user USING (user_id = public.user_id()) WITH CHECK (user_id = public.user_id());

DROP POLICY IF EXISTS "delete_own_trips" ON public.trip;
CREATE POLICY "delete_own_trips" ON public.trip FOR DELETE TO app_user USING (user_id = public.user_id());

-- Policies for public.destination table
DROP POLICY IF EXISTS "view_destinations" ON public.destination;
CREATE POLICY "view_destinations" ON public.destination FOR SELECT TO app_user USING ((user_id = public.user_id()) OR (public.user_id() IS NULL AND EXISTS ( SELECT 1 FROM trip WHERE trip.id = destination.trip_id AND trip.is_public = true )));

DROP POLICY IF EXISTS "insert_own_destinations" ON public.destination;
CREATE POLICY "insert_own_destinations" ON public.destination FOR INSERT TO app_user WITH CHECK ( user_id = public.user_id() AND EXISTS ( SELECT 1 FROM trip WHERE trip.id = destination.trip_id AND trip.user_id = public.user_id() ) );

DROP POLICY IF EXISTS "update_own_destinations" ON public.destination;
CREATE POLICY "update_own_destinations" ON public.destination FOR UPDATE TO app_user USING (user_id = public.user_id()) WITH CHECK (user_id = public.user_id());

DROP POLICY IF EXISTS "delete_own_destinations" ON public.destination;
CREATE POLICY "delete_own_destinations" ON public.destination FOR DELETE TO app_user USING (user_id = public.user_id());

-- Policies for public.travel_detail table
DROP POLICY IF EXISTS "view_travel_details" ON public.travel_detail;
CREATE POLICY "view_travel_details" ON public.travel_detail FOR SELECT TO app_user USING ((user_id = public.user_id()) OR (public.user_id() IS NULL AND EXISTS ( SELECT 1 FROM trip WHERE trip.id = travel_detail.trip_id AND trip.is_public = true )));

DROP POLICY IF EXISTS "insert_own_travel_details" ON public.travel_detail;
CREATE POLICY "insert_own_travel_details" ON public.travel_detail FOR INSERT TO app_user WITH CHECK ( user_id = public.user_id() AND EXISTS ( SELECT 1 FROM trip WHERE trip.id = travel_detail.trip_id AND trip.user_id = public.user_id() ) );

DROP POLICY IF EXISTS "update_own_travel_details" ON public.travel_detail;
CREATE POLICY "update_own_travel_details" ON public.travel_detail FOR UPDATE TO app_user USING (user_id = public.user_id()) WITH CHECK (user_id = public.user_id());

DROP POLICY IF EXISTS "delete_own_travel_details" ON public.travel_detail;
CREATE POLICY "delete_own_travel_details" ON public.travel_detail FOR DELETE TO app_user USING (user_id = public.user_id());

-- Policies for public.bookmark table
DROP POLICY IF EXISTS "select_own_bookmarks" ON public.bookmark;
CREATE POLICY "select_own_bookmarks" ON public.bookmark FOR SELECT TO app_user USING (user_id = public.user_id());

DROP POLICY IF EXISTS "insert_own_bookmarks" ON public.bookmark;
CREATE POLICY "insert_own_bookmarks" ON public.bookmark FOR INSERT TO app_user WITH CHECK ( (user_id = public.user_id()) AND ( (target_trip_id IS NOT NULL AND EXISTS ( SELECT 1 FROM trip WHERE trip.id = target_trip_id AND (trip.is_public = true OR trip.user_id = public.user_id()) )) OR (target_destination_id IS NOT NULL AND EXISTS ( SELECT 1 FROM destination JOIN trip ON trip.id = destination.trip_id WHERE destination.id = target_destination_id AND (trip.is_public = true OR destination.user_id = public.user_id()) )) ) );

DROP POLICY IF EXISTS "delete_own_bookmarks" ON public.bookmark;
CREATE POLICY "delete_own_bookmarks" ON public.bookmark FOR DELETE TO app_user USING (user_id = public.user_id());

COMMIT;