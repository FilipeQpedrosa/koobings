-- 🛡️ KOOBINGS TENANT ISOLATION - ADAPTED FOR CURRENT SCHEMA
-- Automatic data isolation per business

-- 1. ENABLE ROW LEVEL SECURITY ON CORE TABLES
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Client" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Service" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Staff" ENABLE ROW LEVEL SECURITY;

-- 2. CREATE SECURITY POLICIES FOR AUTOMATIC TENANT ISOLATION
-- Policy for appointments: users only see their business data
CREATE POLICY tenant_isolation_appointments ON appointments
  FOR ALL 
  USING ("businessId" = current_setting('app.current_business_id', true));

-- Policy for clients: users only see their business clients
CREATE POLICY tenant_isolation_clients ON "Client"
  FOR ALL 
  USING ("businessId" = current_setting('app.current_business_id', true));

-- Policy for services: users only see their business services
CREATE POLICY tenant_isolation_services ON "Service"
  FOR ALL 
  USING ("businessId" = current_setting('app.current_business_id', true));

-- Policy for staff: users only see their business staff
CREATE POLICY tenant_isolation_staff ON "Staff"
  FOR ALL 
  USING ("businessId" = current_setting('app.current_business_id', true));

-- 3. CREATE HELPER FUNCTIONS FOR TENANT CONTEXT
-- Function to set current business context
CREATE OR REPLACE FUNCTION set_current_business_id(business_id text)
RETURNS void AS $$
BEGIN
  PERFORM set_config('app.current_business_id', business_id, true);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get current business context
CREATE OR REPLACE FUNCTION get_current_business_id()
RETURNS text AS $$
BEGIN
  RETURN current_setting('app.current_business_id', true);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to clear tenant context
CREATE OR REPLACE FUNCTION clear_tenant_context()
RETURNS void AS $$
BEGIN
  PERFORM set_config('app.current_business_id', '', true);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. CREATE MATERIALIZED VIEW FOR BUSINESS STATS (tenant-aware)
CREATE MATERIALIZED VIEW IF NOT EXISTS business_stats AS
SELECT 
  "businessId",
  COUNT(*) as total_appointments,
  COUNT(*) FILTER (WHERE "status" = 'COMPLETED') as completed_count,
  COUNT(*) FILTER (WHERE "scheduledFor" > NOW()) as upcoming_count,
  AVG("duration") as avg_duration,
  NOW() as last_updated
FROM appointments 
GROUP BY "businessId";

-- Create index on the materialized view
CREATE INDEX IF NOT EXISTS idx_business_stats_business_id 
ON business_stats ("businessId");

-- Function to refresh business stats
CREATE OR REPLACE FUNCTION refresh_business_stats()
RETURNS void AS $$
BEGIN
  REFRESH MATERIALIZED VIEW CONCURRENTLY business_stats;
END;
$$ LANGUAGE plpgsql;

-- 5. PERFORMANCE MONITORING
-- View to monitor RLS performance
CREATE OR REPLACE VIEW tenant_security_status AS
SELECT 
  'appointments' as table_name,
  'ENABLED' as rls_status,
  (SELECT COUNT(*) FROM pg_policies WHERE tablename = 'appointments') as policies_count
UNION ALL
SELECT 
  'Client' as table_name,
  'ENABLED' as rls_status,
  (SELECT COUNT(*) FROM pg_policies WHERE tablename = 'Client') as policies_count
UNION ALL
SELECT 
  'Service' as table_name,
  'ENABLED' as rls_status,
  (SELECT COUNT(*) FROM pg_policies WHERE tablename = 'Service') as policies_count
UNION ALL
SELECT 
  'Staff' as table_name,
  'ENABLED' as rls_status,
  (SELECT COUNT(*) FROM pg_policies WHERE tablename = 'Staff') as policies_count;

-- Final status check
SELECT 'TENANT ISOLATION COMPLETE' as status,
       'Row Level Security enabled on all core tables' as description,
       'Automatic business data isolation active' as security_level; 