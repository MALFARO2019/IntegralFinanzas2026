-- =====================================================
-- Tablas nuevas para Fase 2 — Integral Finanzas 2026
-- Ejecutar en: Supabase Dashboard > SQL Editor
-- =====================================================

-- ─────────────────────────
-- TABLA: Budget
-- ─────────────────────────
CREATE TABLE IF NOT EXISTS "Budget" (
  "id"          TEXT PRIMARY KEY,
  "householdId" TEXT NOT NULL REFERENCES "Household"("id") ON DELETE CASCADE,
  "categoryId"  TEXT NOT NULL REFERENCES "Category"("id") ON DELETE CASCADE,
  "amount"      DECIMAL(18,2) NOT NULL,
  "period"      TEXT NOT NULL,   -- 'YYYY-MM'
  "createdAt"   TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE ("householdId", "categoryId", "period")
);

ALTER TABLE "Budget" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "budget_member_select" ON "Budget"
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM "HouseholdMember"
      WHERE "householdId" = "Budget"."householdId" AND "userId" = auth.uid()::text AND status = 'ACTIVE')
  );

CREATE POLICY "budget_member_insert" ON "Budget"
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM "HouseholdMember"
      WHERE "householdId" = "Budget"."householdId" AND "userId" = auth.uid()::text AND status = 'ACTIVE')
  );

CREATE POLICY "budget_member_update" ON "Budget"
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM "HouseholdMember"
      WHERE "householdId" = "Budget"."householdId" AND "userId" = auth.uid()::text AND status = 'ACTIVE')
  );

CREATE POLICY "budget_member_delete" ON "Budget"
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM "HouseholdMember"
      WHERE "householdId" = "Budget"."householdId" AND "userId" = auth.uid()::text AND status = 'ACTIVE')
  );

-- ─────────────────────────
-- TABLA: Goal
-- ─────────────────────────
CREATE TABLE IF NOT EXISTS "Goal" (
  "id"            TEXT PRIMARY KEY,
  "householdId"   TEXT NOT NULL REFERENCES "Household"("id") ON DELETE CASCADE,
  "accountId"     TEXT REFERENCES "Account"("id"),
  "name"          TEXT NOT NULL,
  "emoji"         TEXT DEFAULT '🎯',
  "targetAmount"  DECIMAL(18,2) NOT NULL,
  "currentAmount" DECIMAL(18,2) NOT NULL DEFAULT 0,
  "deadline"      DATE,
  "status"        TEXT NOT NULL DEFAULT 'ACTIVE',  -- ACTIVE, COMPLETED, CANCELLED
  "createdAt"     TIMESTAMPTZ DEFAULT NOW(),
  "updatedAt"     TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE "Goal" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "goal_member_select" ON "Goal"
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM "HouseholdMember"
      WHERE "householdId" = "Goal"."householdId" AND "userId" = auth.uid()::text AND status = 'ACTIVE')
  );

CREATE POLICY "goal_member_insert" ON "Goal"
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM "HouseholdMember"
      WHERE "householdId" = "Goal"."householdId" AND "userId" = auth.uid()::text AND status = 'ACTIVE')
  );

CREATE POLICY "goal_member_update" ON "Goal"
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM "HouseholdMember"
      WHERE "householdId" = "Goal"."householdId" AND "userId" = auth.uid()::text AND status = 'ACTIVE')
  );

-- ─────────────────────────
-- TABLA: Category (asegura campos emoji/color/isSystem)
-- Ejecutar si la tabla ya existe pero le faltan columnas:
-- ─────────────────────────
ALTER TABLE "Category" ADD COLUMN IF NOT EXISTS "emoji"    TEXT DEFAULT '📦';
ALTER TABLE "Category" ADD COLUMN IF NOT EXISTS "color"    TEXT DEFAULT '#8B5CF6';
ALTER TABLE "Category" ADD COLUMN IF NOT EXISTS "isSystem" BOOLEAN DEFAULT false;
ALTER TABLE "Category" ADD COLUMN IF NOT EXISTS "type"     TEXT DEFAULT 'EXPENSE';
ALTER TABLE "Category" ADD COLUMN IF NOT EXISTS "createdAt" TIMESTAMPTZ DEFAULT NOW();
