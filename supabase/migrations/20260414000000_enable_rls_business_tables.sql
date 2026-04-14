-- Migration: Enable Row Level Security on all sensitive business tables
-- Date: 2026-04-14
-- Issue: [P0] Activar RLS en tablas de negocio mediante migraciones
--
-- This migration enables RLS on every sensitive business table.
-- By default, once RLS is ON and no policy exists, ALL access is denied
-- for non-superuser roles (including authenticated users).
-- Explicit policies must be added in subsequent migrations to grant access.

ALTER TABLE public.negocios    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profesionales ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.servicios   ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clientes    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.turnos      ENABLE ROW LEVEL SECURITY;

-- Verification query (run manually to confirm RLS status per table):
--
-- SELECT
--   schemaname,
--   tablename,
--   rowsecurity AS rls_enabled
-- FROM pg_tables
-- WHERE schemaname = 'public'
--   AND tablename IN ('negocios', 'profesionales', 'servicios', 'clientes', 'turnos')
-- ORDER BY tablename;
