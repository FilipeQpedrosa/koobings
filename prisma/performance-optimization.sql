-- 🚀 MULTI-TENANT PERFORMANCE OPTIMIZATION
-- Tempo estimado: 2-3 semanas implementação

-- 1. ROW LEVEL SECURITY (RLS)
-- Força isolamento automático por tenant
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE staff ENABLE ROW LEVEL SECURITY;

-- Policy: Users só veem dados do seu business
CREATE POLICY tenant_isolation_appointments ON appointments
  FOR ALL USING (business_id = current_setting('app.current_business_id')::uuid);

CREATE POLICY tenant_isolation_clients ON clients  
  FOR ALL USING (business_id = current_setting('app.current_business_id')::uuid);

-- 2. COMPOSITE INDEXES - Performance crítica
CREATE INDEX CONCURRENTLY idx_appointments_business_date_status 
  ON appointments (business_id, scheduled_for, status);

CREATE INDEX CONCURRENTLY idx_appointments_business_staff_date
  ON appointments (business_id, staff_id, scheduled_for);

CREATE INDEX CONCURRENTLY idx_clients_business_email
  ON clients (business_id, email);

CREATE INDEX CONCURRENTLY idx_services_business_active
  ON services (business_id) WHERE deleted_at IS NULL;

-- 3. PARTIAL INDEXES - Só dados ativos
CREATE INDEX CONCURRENTLY idx_appointments_active_upcoming
  ON appointments (business_id, scheduled_for) 
  WHERE status IN ('PENDING', 'CONFIRMED') 
  AND scheduled_for > NOW();

-- 4. QUERY OPTIMIZATION VIEWS
CREATE MATERIALIZED VIEW business_stats AS
SELECT 
  business_id,
  COUNT(*) as total_appointments,
  COUNT(*) FILTER (WHERE status = 'COMPLETED') as completed_count,
  COUNT(*) FILTER (WHERE scheduled_for > NOW()) as upcoming_count,
  AVG(duration) as avg_duration,
  SUM(CASE WHEN status = 'COMPLETED' THEN 1 ELSE 0 END * services.price) as total_revenue
FROM appointments 
JOIN services ON appointments.service_id = services.id
GROUP BY business_id;

-- Refresh automático
CREATE OR REPLACE FUNCTION refresh_business_stats()
RETURNS void AS $$
BEGIN
  REFRESH MATERIALIZED VIEW CONCURRENTLY business_stats;
END;
$$ LANGUAGE plpgsql;

-- 5. CONNECTION POOLING OPTIMIZATION
-- Configurar Prisma connection limits
-- connectionLimit: 10 (per business)
-- poolTimeout: 60 seconds 