BEGIN;

-- Drop existing objects to ensure a clean slate.
-- The order is important to avoid dependency errors.
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

DROP TABLE IF EXISTS public.bookmark CASCADE;
DROP TABLE IF EXISTS public.travel_detail CASCADE;
DROP TABLE IF EXISTS public.destination CASCADE;
DROP TABLE IF EXISTS public.trip CASCADE;
DROP TABLE IF EXISTS public."user" CASCADE;

DROP FUNCTION IF EXISTS public.user_id();

-- 1. Create the helper function to get the current user's ID from the JWT
-- This function is central to the RLS policies.
CREATE OR REPLACE FUNCTION public.user_id()
RETURNS text AS $$
  SELECT CASE
    WHEN current_setting('request.jwt.claims', true) = '' THEN NULL
    ELSE nullif(current_setting('request.jwt.claims', true)::json->>'sub', '')::text
  END;
$$ LANGUAGE sql STABLE;

-- Grant usage of the function to the role that will be making API requests.
GRANT EXECUTE ON FUNCTION public.user_id() TO authenticator;


-- 2. Create Tables and Foreign Keys
CREATE TABLE public."user" (
    id text PRIMARY KEY NOT NULL,
    name text,
    email text NOT NULL,
    avatar_url text,
    email_verified boolean DEFAULT false,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

CREATE TABLE public.trip (
    id serial PRIMARY KEY NOT NULL,
    name text NOT NULL,
    description text,
    latitude double precision,
    longitude double precision,
    country text,
    start_date timestamp with time zone,
    end_date timestamp with time zone,
    cover_image text,
    gallery jsonb DEFAULT '[]'::jsonb,
    is_favorite boolean DEFAULT false,
    is_public boolean DEFAULT false,
    user_id text DEFAULT public.user_id() NOT NULL,
    parent_trip_id integer,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    is_visited boolean DEFAULT false
);

ALTER TABLE public.trip ADD CONSTRAINT trip_user_id_fkey FOREIGN KEY (user_id) REFERENCES public."user"(id) ON DELETE CASCADE;
ALTER TABLE public.trip ADD CONSTRAINT trip_parent_trip_id_fkey FOREIGN KEY (parent_trip_id) REFERENCES public.trip(id) ON DELETE CASCADE;

CREATE TABLE public.destination (
    id serial PRIMARY KEY NOT NULL,
    name text NOT NULL,
    description text,
    latitude double precision,
    longitude double precision,
    country text,
    cover_image text,
    gallery jsonb DEFAULT '[]'::jsonb,
    is_favorite boolean DEFAULT false,
    trip_id integer NOT NULL,
    user_id text DEFAULT public.user_id() NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    is_verified boolean DEFAULT false,
    is_visited boolean DEFAULT false
);

ALTER TABLE public.destination ADD CONSTRAINT destination_trip_id_fkey FOREIGN KEY (trip_id) REFERENCES public.trip(id) ON DELETE CASCADE;
ALTER TABLE public.destination ADD CONSTRAINT destination_user_id_fkey FOREIGN KEY (user_id) REFERENCES public."user"(id) ON DELETE CASCADE;

CREATE TABLE public.travel_detail (
    id serial PRIMARY KEY NOT NULL,
    trip_id integer NOT NULL,
    user_id text DEFAULT public.user_id() NOT NULL,
    detail_type text NOT NULL,
    name text NOT NULL,
    description text,
    latitude double precision,
    longitude double precision,
    arrival_time timestamp with time zone,
    departure_time timestamp with time zone,
    is_verified boolean DEFAULT false,
    gallery jsonb DEFAULT '[]'::jsonb,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

ALTER TABLE public.travel_detail ADD CONSTRAINT travel_detail_trip_id_fkey FOREIGN KEY (trip_id) REFERENCES public.trip(id) ON DELETE CASCADE;
ALTER TABLE public.travel_detail ADD CONSTRAINT travel_detail_user_id_fkey FOREIGN KEY (user_id) REFERENCES public."user"(id) ON DELETE CASCADE;

CREATE TABLE public.bookmark (
    id serial PRIMARY KEY NOT NULL,
    user_id text DEFAULT public.user_id() NOT NULL,
    target_trip_id integer,
    target_destination_id integer,
    created_at timestamp with time zone DEFAULT now()
);

ALTER TABLE public.bookmark ADD CONSTRAINT bookmark_user_id_fkey FOREIGN KEY (user_id) REFERENCES public."user"(id) ON DELETE CASCADE;
ALTER TABLE public.bookmark ADD CONSTRAINT bookmark_target_trip_id_fkey FOREIGN KEY (target_trip_id) REFERENCES public.trip(id) ON DELETE CASCADE;
ALTER TABLE public.bookmark ADD CONSTRAINT bookmark_target_destination_id_fkey FOREIGN KEY (target_destination_id) REFERENCES public.destination(id) ON DELETE CASCADE;


-- 3. Grant schema access and table permissions for the anonymous and authenticated roles
GRANT USAGE ON SCHEMA public TO anonymous, authenticated;

-- Anonymous users can only read data
GRANT SELECT ON ALL TABLES IN SCHEMA public TO anonymous;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT ON TABLES TO anonymous;

-- Authenticated users have full access
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO authenticated;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO authenticated;


-- 4. Enforce Row-Level Security on all tables
ALTER TABLE public."user" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trip ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.destination ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.travel_detail ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookmark ENABLE ROW LEVEL SECURITY;


-- 5. Create RLS Policies

-- Policies for "user" table
CREATE POLICY "view_users" ON public."user" FOR SELECT TO public USING (true);
CREATE POLICY "manage_own_user" ON public."user" FOR ALL TO authenticated USING (id = public.user_id()) WITH CHECK (id = public.user_id());

-- Policies for "trip" table
CREATE POLICY "view_trips" ON public.trip FOR SELECT TO public USING ((is_public = true) OR (user_id = public.user_id()));
CREATE POLICY "insert_own_trips" ON public.trip FOR INSERT TO authenticated WITH CHECK (user_id = public.user_id());
CREATE POLICY "update_own_trips" ON public.trip FOR UPDATE TO authenticated USING (user_id = public.user_id()) WITH CHECK (user_id = public.user_id());
CREATE POLICY "delete_own_trips" ON public.trip FOR DELETE TO authenticated USING (user_id = public.user_id());

-- Policies for "destination" table
CREATE POLICY "view_destinations" ON public.destination FOR SELECT TO public USING ((user_id = public.user_id()) OR (EXISTS ( SELECT 1 FROM trip WHERE trip.id = destination.trip_id AND trip.is_public = true )));
CREATE POLICY "insert_own_destinations" ON public.destination FOR INSERT TO authenticated WITH CHECK ( user_id = public.user_id() AND EXISTS ( SELECT 1 FROM trip WHERE trip.id = destination.trip_id AND trip.user_id = public.user_id() ) );
CREATE POLICY "update_own_destinations" ON public.destination FOR UPDATE TO authenticated USING (user_id = public.user_id()) WITH CHECK (user_id = public.user_id());
CREATE POLICY "delete_own_destinations" ON public.destination FOR DELETE TO authenticated USING (user_id = public.user_id());

-- Policies for "travel_detail" table
CREATE POLICY "view_travel_details" ON public.travel_detail FOR SELECT TO public USING ((user_id = public.user_id()) OR (EXISTS ( SELECT 1 FROM trip WHERE trip.id = travel_detail.trip_id AND trip.is_public = true )));
CREATE POLICY "insert_own_travel_details" ON public.travel_detail FOR INSERT TO authenticated WITH CHECK ( user_id = public.user_id() AND EXISTS ( SELECT 1 FROM trip WHERE trip.id = travel_detail.trip_id AND trip.user_id = public.user_id() ) );
CREATE POLICY "update_own_travel_details" ON public.travel_detail FOR UPDATE TO authenticated USING (user_id = public.user_id()) WITH CHECK (user_id = public.user_id());
CREATE POLICY "delete_own_travel_details" ON public.travel_detail FOR DELETE TO authenticated USING (user_id = public.user_id());

-- Policies for "bookmark" table
CREATE POLICY "select_own_bookmarks" ON public.bookmark FOR SELECT TO authenticated USING (user_id = public.user_id());
CREATE POLICY "insert_own_bookmarks" ON public.bookmark FOR INSERT TO authenticated WITH CHECK ( (user_id = public.user_id()) AND ( (target_trip_id IS NOT NULL AND EXISTS ( SELECT 1 FROM trip WHERE trip.id = target_trip_id AND (trip.is_public = true OR trip.user_id = public.user_id()) )) OR (target_destination_id IS NOT NULL AND EXISTS ( SELECT 1 FROM destination JOIN trip ON trip.id = destination.trip_id WHERE destination.id = target_destination_id AND (trip.is_public = true OR destination.user_id = public.user_id()) )) ) );
CREATE POLICY "delete_own_bookmarks" ON public.bookmark FOR DELETE TO authenticated USING (user_id = public.user_id());

COMMIT;