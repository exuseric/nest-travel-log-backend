BEGIN;

-- 1. Database Roles and Grants (if not already done)
-- Create roles if they don't exist
DO
$do$
BEGIN
   IF
NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = 'anon') THEN
CREATE ROLE anon NOLOGIN;
END IF;
   IF
NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = 'authenticated') THEN
CREATE ROLE authenticated NOLOGIN;
END IF;
END
$do$;

-- Grant neondb_owner membership in anon and authenticated roles for SET ROLE
GRANT anon TO neondb_owner;


-- Grant schema access
GRANT
USAGE
ON
SCHEMA
public TO anon, authenticated;

-- Grant table permissions
GRANT
SELECT
ON ALL TABLES IN SCHEMA public TO anon;
GRANT
ALL
ON ALL TABLES IN SCHEMA public TO app_authenticated_role;
GRANT ALL
ON ALL SEQUENCES IN SCHEMA public TO app_authenticated_role;

-- Ensure future tables inherit grants
ALTER
DEFAULT PRIVILEGES IN SCHEMA public GRANT
SELECT
ON TABLES TO anon;
ALTER
DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO app_authenticated_role;
ALTER
DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO app_authenticated_role;

-- Create the public.user_id() function
-- It now directly reads a session variable set by the application.
CREATE
OR REPLACE FUNCTION public.user_id() RETURNS text AS $$
SELECT nullif(current_setting('public.current_user_id', true), '') ::text;
$$
LANGUAGE sql STABLE;

-- Grant execute on the function to the app_user role
GRANT EXECUTE ON FUNCTION public.user_id
() TO app_user; -- Ensure 'app_user' exists and is the role your application connects with

-- 2. Enforce Row-Level Security on tables (if not already done)
ALTER TABLE public.trip FORCE ROW LEVEL SECURITY;
ALTER TABLE public.destination FORCE ROW LEVEL SECURITY;
ALTER TABLE public.travel_detail FORCE ROW LEVEL SECURITY;
ALTER TABLE public.bookmark FORCE ROW LEVEL SECURITY;
ALTER TABLE public."user" FORCE ROW LEVEL SECURITY;


-- 3. Update RLS Policies

-- Policies for public."user" table
DROP
POLICY IF EXISTS "view_users" ON public."user";
CREATE
POLICY "view_users" ON public."user" FOR
SELECT TO public USING (true);

DROP
POLICY IF EXISTS "manage_own_user" ON public."user";
CREATE
POLICY "manage_own_user" ON public."user" FOR ALL TO app_authenticated_role USING (id = public.user_id()) WITH CHECK (id = public.user_id());

-- Policies for public.trip table
DROP
POLICY IF EXISTS "view_trips" ON public.trip;
CREATE
POLICY "view_trips" ON public.trip FOR
SELECT TO public USING ((is_public = true) OR (user_id = public.user_id()));

DROP
POLICY IF EXISTS "insert_own_trips" ON public.trip;
CREATE
POLICY "insert_own_trips" ON public.trip FOR INSERT TO app_authenticated_role WITH CHECK (user_id = public.user_id());

DROP
POLICY IF EXISTS "update_own_trips" ON public.trip;
CREATE
POLICY "update_own_trips" ON public.trip FOR
UPDATE TO app_authenticated_role USING (user_id = public.user_id())
WITH CHECK (user_id = public.user_id());

DROP
POLICY IF EXISTS "delete_own_trips" ON public.trip;
CREATE
POLICY "delete_own_trips" ON public.trip FOR DELETE
TO app_authenticated_role USING (user_id = public.user_id());

-- Policies for public.destination table
DROP
POLICY IF EXISTS "view_destinations" ON public.destination;
CREATE
POLICY "view_destinations" ON public.destination FOR
SELECT TO public USING ((user_id = public.user_id()) OR (EXISTS ( SELECT 1 FROM trip WHERE trip.id = destination.trip_id AND trip.is_public = true )));

DROP
POLICY IF EXISTS "insert_own_destinations" ON public.destination;
CREATE
POLICY "insert_own_destinations" ON public.destination FOR INSERT TO app_authenticated_role WITH CHECK ( user_id = public.user_id() AND EXISTS ( SELECT 1 FROM trip WHERE trip.id = destination.trip_id AND trip.user_id = public.user_id() ) );

DROP
POLICY IF EXISTS "update_own_destinations" ON public.destination;
CREATE
POLICY "update_own_destinations" ON public.destination FOR
UPDATE TO app_authenticated_role USING (user_id = public.user_id())
WITH CHECK (user_id = public.user_id());

DROP
POLICY IF EXISTS "delete_own_destinations" ON public.destination;
CREATE
POLICY "delete_own_destinations" ON public.destination FOR DELETE
TO app_authenticated_role USING (user_id = public.user_id());

-- Policies for public.travel_detail table
DROP
POLICY IF EXISTS "view_travel_details" ON public.travel_detail;
CREATE
POLICY "view_travel_details" ON public.travel_detail FOR
SELECT TO public USING ((user_id = public.user_id()) OR (EXISTS ( SELECT 1 FROM trip WHERE trip.id = travel_detail.trip_id AND trip.is_public = true )));

DROP
POLICY IF EXISTS "insert_own_travel_details" ON public.travel_detail;
CREATE
POLICY "insert_own_travel_details" ON public.travel_detail FOR INSERT TO app_authenticated_role WITH CHECK ( user_id = public.user_id() AND EXISTS ( SELECT 1 FROM trip WHERE trip.id = travel_detail.trip_id AND trip.user_id = public.user_id() ) );

DROP
POLICY IF EXISTS "update_own_travel_details" ON public.travel_detail;
CREATE
POLICY "update_own_travel_details" ON public.travel_detail FOR
UPDATE TO app_authenticated_role USING (user_id = public.user_id())
WITH CHECK (user_id = public.user_id());

DROP
POLICY IF EXISTS "delete_own_travel_details" ON public.travel_detail;
CREATE
POLICY "delete_own_travel_details" ON public.travel_detail FOR DELETE
TO app_authenticated_role USING (user_id = public.user_id());

-- Policies for public.bookmark table
DROP
POLICY IF EXISTS "select_own_bookmarks" ON public.bookmark;
CREATE
POLICY "select_own_bookmarks" ON public.bookmark FOR
SELECT TO app_authenticated_role USING (user_id = public.user_id());

DROP
POLICY IF EXISTS "insert_own_bookmarks" ON public.bookmark;
CREATE
POLICY "insert_own_bookmarks" ON public.bookmark FOR INSERT TO app_authenticated_role WITH CHECK ( (user_id = public.user_id()) AND ( (target_trip_id IS NOT NULL AND EXISTS ( SELECT 1 FROM trip WHERE trip.id = target_trip_id AND (trip.is_public = true OR trip.user_id = public.user_id()) )) OR (target_destination_id IS NOT NULL AND EXISTS ( SELECT 1 FROM destination JOIN trip ON trip.id = destination.trip_id WHERE destination.id = target_destination_id AND (trip.is_public = true OR destination.user_id = public.user_id()) )) ) );

DROP
POLICY IF EXISTS "delete_own_bookmarks" ON public.bookmark;
CREATE
POLICY "delete_own_bookmarks" ON public.bookmark FOR DELETE
TO app_authenticated_role USING (user_id = public.user_id());

COMMIT;