-- Create a new non-superuser, non-BYPASSRLS role for the application
CREATE ROLE app_user WITH
  LOGIN
  PASSWORD 'CelN!uuzWMkIh4FChMX&ofE3sA' -- Use the provided strong password
  NOSUPERUSER
  INHERIT
  NOCREATEDB
  NOCREATEROLE
  NOREPLICATION
  NOBYPASSRLS; -- Explicitly set NOBYPASSRLS

-- Grant membership in anon and authenticated roles to app_user
-- This allows app_user to SET ROLE to anon or authenticated
GRANT anon TO app_user;
GRANT authenticated TO app_user;

-- The app_user will inherit privileges from 'anon' and 'authenticated' roles.
-- For example, SELECT on public tables from 'anon'.
-- You might need to grant specific DML privileges (INSERT, UPDATE, DELETE)
-- to app_user directly if it needs to perform those operations *before* setting role,
-- or ensure that the 'authenticated' role has sufficient privileges and app_user
-- always sets role to 'authenticated' for DML operations.
-- Based on the existing rls_setup_and_policies.sql, the 'authenticated' role
-- has ALL privileges on tables, so app_user will inherit these after SET ROLE authenticated.