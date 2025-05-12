-- Enable Row Level Security for all tables
ALTER TABLE businesses ENABLE ROW LEVEL SECURITY;
ALTER TABLE staff ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;

-- Business policies
CREATE POLICY "Business owners can view their own business"
ON businesses FOR SELECT
TO authenticated
USING (auth.uid() = id);

CREATE POLICY "Business owners can update their own business"
ON businesses FOR UPDATE
TO authenticated
USING (auth.uid() = id);

-- Staff policies
CREATE POLICY "Staff can view their own business"
ON staff FOR SELECT
TO authenticated
USING (
  business_id IN (
    SELECT id FROM businesses 
    WHERE id = auth.uid()
    OR id IN (
      SELECT business_id FROM staff 
      WHERE id = auth.uid()
    )
  )
);

CREATE POLICY "Business owners can manage staff"
ON staff FOR ALL
TO authenticated
USING (
  business_id IN (
    SELECT id FROM businesses 
    WHERE id = auth.uid()
  )
);

-- Services policies
CREATE POLICY "Anyone can view services"
ON services FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Business owners can manage services"
ON services FOR ALL
TO authenticated
USING (
  business_id IN (
    SELECT id FROM businesses 
    WHERE id = auth.uid()
  )
);

-- Appointments policies
CREATE POLICY "Business and staff can view appointments"
ON appointments FOR SELECT
TO authenticated
USING (
  business_id IN (
    SELECT id FROM businesses 
    WHERE id = auth.uid()
    OR id IN (
      SELECT business_id FROM staff 
      WHERE id = auth.uid()
    )
  )
);

CREATE POLICY "Business and staff can manage appointments"
ON appointments FOR ALL
TO authenticated
USING (
  business_id IN (
    SELECT id FROM businesses 
    WHERE id = auth.uid()
    OR id IN (
      SELECT business_id FROM staff 
      WHERE id = auth.uid()
    )
  )
); 