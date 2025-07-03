-- Fix Supabase RLS Issues
-- This script disables Row Level Security on all tables to allow Prisma/NextAuth to work

-- Disable RLS on all main tables
ALTER TABLE IF EXISTS public.base_model DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.system_admins DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.business_verifications DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.businesses DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.business DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.security_settings DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.system_settings DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.clients DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.client DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.service_categories DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.relationship_notes DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.visit_history DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.staff DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.services DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.appointments DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.business_hours DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.staff_availability DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.staff_unavailability DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.notifications DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.admin_activities DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.backup_status DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.client_relationships DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.patient DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.patients DISABLE ROW LEVEL SECURITY;

-- Grant full access to authenticated users on all tables
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO authenticated;

-- Grant access to anon users for NextAuth to work
GRANT SELECT, INSERT, UPDATE ON public.system_admins TO anon;
GRANT SELECT ON public.businesses TO anon;
GRANT SELECT ON public.business TO anon;

-- Create policies for future RLS if needed (commented out for now)
-- CREATE POLICY "Allow all for authenticated users" ON public.system_admins FOR ALL USING (true);
-- CREATE POLICY "Allow all for authenticated users" ON public.businesses FOR ALL USING (true);

-- Show which tables now have RLS disabled
SELECT 
    schemaname,
    tablename,
    rowsecurity
FROM pg_tables 
WHERE schemaname = 'public' 
ORDER BY tablename; 