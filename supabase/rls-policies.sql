-- =====================================================
-- RLS Policies — Integral Finanzas 2026
-- Ejecutar en: Supabase Dashboard > SQL Editor
-- Fix: auth.uid()::text porque los IDs son TEXT en Prisma
-- =====================================================

-- ─────────────────────────
-- TABLA: User
-- ─────────────────────────
ALTER TABLE "User" ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "user_own_select" ON "User";
DROP POLICY IF EXISTS "user_own_insert" ON "User";
DROP POLICY IF EXISTS "user_own_update" ON "User";

CREATE POLICY "user_own_select" ON "User"
  FOR SELECT USING (auth.uid()::text = id);

CREATE POLICY "user_own_insert" ON "User"
  FOR INSERT WITH CHECK (auth.uid()::text = id);

CREATE POLICY "user_own_update" ON "User"
  FOR UPDATE USING (auth.uid()::text = id);

-- ─────────────────────────
-- TABLA: Household
-- ─────────────────────────
ALTER TABLE "Household" ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "household_owner_select" ON "Household";
DROP POLICY IF EXISTS "household_owner_insert" ON "Household";
DROP POLICY IF EXISTS "household_owner_update" ON "Household";

CREATE POLICY "household_owner_select" ON "Household"
  FOR SELECT USING (
    auth.uid()::text = "ownerUserId" OR
    EXISTS (
      SELECT 1 FROM "HouseholdMember"
      WHERE "householdId" = "Household".id
        AND "userId" = auth.uid()::text
        AND status = 'ACTIVE'
    )
  );

CREATE POLICY "household_owner_insert" ON "Household"
  FOR INSERT WITH CHECK (auth.uid()::text = "ownerUserId");

CREATE POLICY "household_owner_update" ON "Household"
  FOR UPDATE USING (auth.uid()::text = "ownerUserId");

-- ─────────────────────────
-- TABLA: HouseholdMember
-- ─────────────────────────
ALTER TABLE "HouseholdMember" ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "member_own_select" ON "HouseholdMember";
DROP POLICY IF EXISTS "member_own_insert" ON "HouseholdMember";
DROP POLICY IF EXISTS "member_household_insert" ON "HouseholdMember";

CREATE POLICY "member_own_select" ON "HouseholdMember"
  FOR SELECT USING ("userId" = auth.uid()::text);

CREATE POLICY "member_own_insert" ON "HouseholdMember"
  FOR INSERT WITH CHECK ("userId" = auth.uid()::text);

-- ─────────────────────────
-- TABLA: Account
-- ─────────────────────────
ALTER TABLE "Account" ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "account_member_select" ON "Account";
DROP POLICY IF EXISTS "account_member_insert" ON "Account";
DROP POLICY IF EXISTS "account_member_update" ON "Account";

CREATE POLICY "account_member_select" ON "Account"
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM "HouseholdMember"
      WHERE "householdId" = "Account"."householdId"
        AND "userId" = auth.uid()::text
        AND status = 'ACTIVE'
    )
  );

CREATE POLICY "account_member_insert" ON "Account"
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM "HouseholdMember"
      WHERE "householdId" = "Account"."householdId"
        AND "userId" = auth.uid()::text
        AND status = 'ACTIVE'
    )
  );

CREATE POLICY "account_member_update" ON "Account"
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM "HouseholdMember"
      WHERE "householdId" = "Account"."householdId"
        AND "userId" = auth.uid()::text
        AND status = 'ACTIVE'
    )
  );

-- ─────────────────────────
-- TABLA: Transaction
-- ─────────────────────────
ALTER TABLE "Transaction" ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "txn_member_select" ON "Transaction";
DROP POLICY IF EXISTS "txn_member_insert" ON "Transaction";
DROP POLICY IF EXISTS "txn_member_update" ON "Transaction";

CREATE POLICY "txn_member_select" ON "Transaction"
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM "HouseholdMember"
      WHERE "householdId" = "Transaction"."householdId"
        AND "userId" = auth.uid()::text
        AND status = 'ACTIVE'
    )
  );

CREATE POLICY "txn_member_insert" ON "Transaction"
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM "HouseholdMember"
      WHERE "householdId" = "Transaction"."householdId"
        AND "userId" = auth.uid()::text
        AND status = 'ACTIVE'
    )
  );

CREATE POLICY "txn_member_update" ON "Transaction"
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM "HouseholdMember"
      WHERE "householdId" = "Transaction"."householdId"
        AND "userId" = auth.uid()::text
        AND status = 'ACTIVE'
    )
  );

-- ─────────────────────────
-- TABLA: Category
-- ─────────────────────────
ALTER TABLE "Category" ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "category_member_select" ON "Category";
DROP POLICY IF EXISTS "category_member_insert" ON "Category";

CREATE POLICY "category_member_select" ON "Category"
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM "HouseholdMember"
      WHERE "householdId" = "Category"."householdId"
        AND "userId" = auth.uid()::text
        AND status = 'ACTIVE'
    )
  );

CREATE POLICY "category_member_insert" ON "Category"
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM "HouseholdMember"
      WHERE "householdId" = "Category"."householdId"
        AND "userId" = auth.uid()::text
        AND status = 'ACTIVE'
    )
  );
