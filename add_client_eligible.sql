-- Add isEligible field to Client table
ALTER TABLE "Client" ADD COLUMN "isEligible" BOOLEAN NOT NULL DEFAULT true;

-- Add index for performance
CREATE INDEX "Client_isEligible_idx" ON "Client"("isEligible");
