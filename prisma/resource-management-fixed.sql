-- 🎛️ RESOURCE MANAGEMENT - CORRECTED VERSION
-- Business tiers and resource allocation

-- 1. CREATE BUSINESS TIERS TABLE
CREATE TABLE IF NOT EXISTS business_tiers (
    "businessId" text PRIMARY KEY,
    tier varchar(20) NOT NULL DEFAULT 'starter',
    "appointmentsCount" bigint DEFAULT 0,
    "monthlyBookings" bigint DEFAULT 0,
    "lastEvaluated" timestamp DEFAULT NOW(),
    "createdAt" timestamp DEFAULT NOW(),
    "updatedAt" timestamp DEFAULT NOW(),
    
    -- Resource limits per tier
    "maxConcurrentQueries" integer DEFAULT 5,
    "maxQueryDurationMs" integer DEFAULT 10000,
    "maxResultSetSize" integer DEFAULT 1000,
    "connectionPoolSize" integer DEFAULT 5,
    "maxMemoryMB" integer DEFAULT 200,
    
    -- Features per tier
    "analyticsEnabled" boolean DEFAULT true,
    "prioritySupport" boolean DEFAULT false,
    "customBranding" boolean DEFAULT false
);

-- 2. CREATE RESOURCE USAGE TRACKING (simplified)
CREATE TABLE IF NOT EXISTS resource_usage_logs (
    id text PRIMARY KEY DEFAULT gen_random_uuid()::text,
    "businessId" text NOT NULL,
    "queryType" varchar(50) NOT NULL,
    "executionTimeMs" integer NOT NULL,
    "memoryUsedMB" float NOT NULL,
    "resultSetSize" integer DEFAULT 0,
    "timestamp" timestamp DEFAULT NOW(),
    "status" varchar(20) DEFAULT 'SUCCESS'
);

-- 3. CREATE RESOURCE QUOTAS TABLE  
CREATE TABLE IF NOT EXISTS resource_quotas (
    "businessId" text PRIMARY KEY,
    "dailyQueryLimit" integer DEFAULT 10000,
    "dailyQueryCount" integer DEFAULT 0,
    "monthlyDataTransferGB" float DEFAULT 10.0,
    "monthlyDataTransferUsed" float DEFAULT 0.0,
    "lastResetDate" date DEFAULT CURRENT_DATE,
    "quotaExceeded" boolean DEFAULT false
);

-- 4. INDEXES FOR PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_business_tiers_tier 
ON business_tiers (tier, "lastEvaluated");

CREATE INDEX IF NOT EXISTS idx_resource_usage_business_time
ON resource_usage_logs ("businessId", "timestamp");

CREATE INDEX IF NOT EXISTS idx_resource_quotas_exceeded
ON resource_quotas ("quotaExceeded", "lastResetDate");

-- 5. TIER CLASSIFICATION FUNCTION
CREATE OR REPLACE FUNCTION classify_business_tier(target_business_id text)
RETURNS void AS $$
DECLARE
    appointment_count bigint;
    monthly_bookings bigint;
    new_tier varchar(20);
BEGIN
    -- Get current metrics
    SELECT COUNT(*) INTO appointment_count
    FROM appointments 
    WHERE "businessId" = target_business_id;
    
    SELECT COUNT(*) INTO monthly_bookings
    FROM appointments 
    WHERE "businessId" = target_business_id
    AND "scheduledFor" >= CURRENT_DATE - INTERVAL '30 days';
    
    -- Determine tier based on usage
    IF appointment_count > 50000 OR monthly_bookings > 2000 THEN
        new_tier := 'enterprise';
    ELSIF appointment_count > 10000 OR monthly_bookings > 500 THEN
        new_tier := 'professional';
    ELSIF appointment_count > 1000 OR monthly_bookings > 100 THEN
        new_tier := 'starter';
    ELSE
        new_tier := 'free';
    END IF;
    
    -- Update or insert tier
    INSERT INTO business_tiers ("businessId", tier, "appointmentsCount", "monthlyBookings", "lastEvaluated")
    VALUES (target_business_id, new_tier, appointment_count, monthly_bookings, NOW())
    ON CONFLICT ("businessId") 
    DO UPDATE SET 
        tier = new_tier,
        "appointmentsCount" = appointment_count,
        "monthlyBookings" = monthly_bookings,
        "lastEvaluated" = NOW(),
        "maxConcurrentQueries" = CASE new_tier
            WHEN 'free' THEN 2
            WHEN 'starter' THEN 5
            WHEN 'professional' THEN 15
            WHEN 'enterprise' THEN 50
        END,
        "maxQueryDurationMs" = CASE new_tier
            WHEN 'free' THEN 5000
            WHEN 'starter' THEN 10000
            WHEN 'professional' THEN 30000
            WHEN 'enterprise' THEN 120000
        END,
        "maxResultSetSize" = CASE new_tier
            WHEN 'free' THEN 100
            WHEN 'starter' THEN 1000
            WHEN 'professional' THEN 5000
            WHEN 'enterprise' THEN 50000
        END,
        "connectionPoolSize" = CASE new_tier
            WHEN 'free' THEN 2
            WHEN 'starter' THEN 5
            WHEN 'professional' THEN 15
            WHEN 'enterprise' THEN 30
        END;
END;
$$ LANGUAGE plpgsql;

-- 6. RESOURCE MONITORING FUNCTION
CREATE OR REPLACE FUNCTION log_resource_usage(
    business_id text,
    query_type text,
    execution_time_ms integer,
    memory_used_mb float,
    result_set_size integer DEFAULT 0,
    status text DEFAULT 'SUCCESS'
)
RETURNS void AS $$
BEGIN
    INSERT INTO resource_usage_logs (
        "businessId", "queryType", "executionTimeMs", 
        "memoryUsedMB", "resultSetSize", "status"
    ) VALUES (
        business_id, query_type, execution_time_ms,
        memory_used_mb, result_set_size, status
    );
END;
$$ LANGUAGE plpgsql;

-- 7. POPULATE EXISTING BUSINESSES WITH TIERS
INSERT INTO business_tiers ("businessId", tier)
SELECT id, 'starter' 
FROM "Business" 
WHERE id NOT IN (SELECT "businessId" FROM business_tiers WHERE "businessId" IS NOT NULL)
ON CONFLICT ("businessId") DO NOTHING;

-- 8. INITIALIZE QUOTAS FOR EXISTING BUSINESSES
INSERT INTO resource_quotas ("businessId")
SELECT id 
FROM "Business" 
WHERE id NOT IN (SELECT "businessId" FROM resource_quotas WHERE "businessId" IS NOT NULL)
ON CONFLICT ("businessId") DO NOTHING;

-- 9. CREATE MONITORING VIEW (simplified)
CREATE OR REPLACE VIEW business_resource_status AS
SELECT 
    b.id as "businessId",
    b.name as "businessName",
    COALESCE(bt.tier, 'starter') as tier,
    COALESCE(bt."appointmentsCount", 0) as "appointmentsCount",
    COALESCE(bt."monthlyBookings", 0) as "monthlyBookings",
    COALESCE(bt."maxConcurrentQueries", 5) as "maxConcurrentQueries",
    COALESCE(bt."maxQueryDurationMs", 10000) as "maxQueryDurationMs",
    COALESCE(rq."dailyQueryCount", 0) as "dailyQueryCount",
    COALESCE(rq."dailyQueryLimit", 10000) as "dailyQueryLimit",
    COALESCE(rq."quotaExceeded", false) as "quotaExceeded",
    bt."lastEvaluated"
FROM "Business" b
LEFT JOIN business_tiers bt ON b.id = bt."businessId"
LEFT JOIN resource_quotas rq ON b.id = rq."businessId"
ORDER BY bt.tier DESC NULLS LAST, bt."appointmentsCount" DESC NULLS LAST;

SELECT 'RESOURCE MANAGEMENT SETUP COMPLETE' as status,
       'Business tiers, quotas, and monitoring ready' as description; 