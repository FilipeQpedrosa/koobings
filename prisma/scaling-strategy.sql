-- 🚀 DATABASE SCALING STRATEGY
-- Solução sem quebrar sistema existente

-- FASE 1: PARTITIONING (2 semanas) - Zero downtime
-- Particionar por business_id ranges

-- 1. Create partitioned table (new)
CREATE TABLE appointments_partitioned (
    id uuid PRIMARY KEY,
    business_id uuid NOT NULL,
    client_id uuid NOT NULL,
    service_id uuid NOT NULL,
    staff_id uuid NOT NULL,
    scheduled_for timestamp NOT NULL,
    status appointment_status DEFAULT 'PENDING',
    duration integer NOT NULL,
    notes text,
    created_at timestamp DEFAULT NOW(),
    updated_at timestamp DEFAULT NOW()
) PARTITION BY HASH (business_id);

-- Create 16 partitions (start small, grow as needed)
CREATE TABLE appointments_p0 PARTITION OF appointments_partitioned
    FOR VALUES WITH (modulus 16, remainder 0);
CREATE TABLE appointments_p1 PARTITION OF appointments_partitioned  
    FOR VALUES WITH (modulus 16, remainder 1);
-- ... repeat for p2-p15

-- 2. Create indexes on each partition (parallel creation)
CREATE INDEX CONCURRENTLY ON appointments_p0 (business_id, scheduled_for);
CREATE INDEX CONCURRENTLY ON appointments_p1 (business_id, scheduled_for);
-- ... repeat for all partitions

-- FASE 2: GRADUAL MIGRATION (2 semanas)
-- Background migration sem downtime

-- Migration function
CREATE OR REPLACE FUNCTION migrate_appointments_batch()
RETURNS void AS $$
DECLARE
    batch_size INTEGER := 1000;
    max_id uuid;
BEGIN
    -- Get oldest unmigrated record
    SELECT id INTO max_id 
    FROM appointments 
    WHERE migrated_to_partitioned = false 
    ORDER BY created_at 
    LIMIT 1;
    
    IF max_id IS NULL THEN
        RETURN; -- Migration complete
    END IF;
    
    -- Migrate batch
    WITH batch AS (
        SELECT * FROM appointments 
        WHERE migrated_to_partitioned = false
        ORDER BY created_at
        LIMIT batch_size
    )
    INSERT INTO appointments_partitioned 
    SELECT * FROM batch;
    
    -- Mark as migrated
    UPDATE appointments 
    SET migrated_to_partitioned = true
    WHERE id IN (
        SELECT id FROM appointments 
        WHERE migrated_to_partitioned = false
        ORDER BY created_at
        LIMIT batch_size
    );
END;
$$ LANGUAGE plpgsql;

-- FASE 3: READ/WRITE ROUTING (1 semana)
-- Gradual switch to partitioned table

-- Function to determine which table to use
CREATE OR REPLACE FUNCTION should_use_partitioned_table(business_created_at timestamp)
RETURNS boolean AS $$
BEGIN
    -- New businesses use partitioned table
    -- Old businesses migrate gradually
    RETURN business_created_at > '2024-01-01'::timestamp;
END;
$$ LANGUAGE plpgsql;

-- FASE 4: BUSINESS SIZE BASED SHARDING (1-2 semanas)
-- Large businesses get dedicated databases

-- Business classification
CREATE TABLE business_tiers (
    business_id uuid PRIMARY KEY,
    tier varchar(20) NOT NULL, -- 'small', 'medium', 'large', 'enterprise'
    appointments_count bigint,
    monthly_bookings bigint,
    shard_assignment varchar(50), -- 'main', 'shard_1', 'shard_2'
    last_evaluated timestamp DEFAULT NOW()
);

-- Auto-classification based on metrics
CREATE OR REPLACE FUNCTION classify_business_tier()
RETURNS void AS $$
BEGIN
    -- Update business tiers based on usage
    UPDATE business_tiers bt
    SET 
        tier = CASE 
            WHEN bs.total_appointments > 50000 THEN 'enterprise'
            WHEN bs.total_appointments > 10000 THEN 'large'  
            WHEN bs.total_appointments > 1000 THEN 'medium'
            ELSE 'small'
        END,
        appointments_count = bs.total_appointments,
        last_evaluated = NOW()
    FROM business_stats bs 
    WHERE bt.business_id = bs.business_id;
    
    -- Recommend shard moves for large businesses
    INSERT INTO shard_migration_queue (business_id, current_shard, target_shard, reason)
    SELECT 
        business_id, 
        'main', 
        'dedicated_' || business_id, 
        'High volume business needs dedicated resources'
    FROM business_tiers 
    WHERE tier IN ('large', 'enterprise') 
    AND shard_assignment = 'main';
END;
$$ LANGUAGE plpgsql;

-- CONFIGURATION FOR PRISMA
-- Multiple database connections
-- prisma/schema.prisma updates needed:

/*
generator client {
  provider = "prisma-client-js"
  previewFeatures = ["multiSchema"]
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
  schemas  = ["main", "shard_1", "shard_2"]
}

datasource shard1 {
  provider = "postgresql"  
  url      = env("SHARD_1_DATABASE_URL")
  schemas  = ["shard_1"]
}
*/ 