/**
 * Capa de datos para Supabase — Web (Next.js)
 * Funciones que obtienen datos reales de la BD Integral Finanzas
 */

import { createClient } from '@/lib/supabase/server'

// ─────────────────────────────────────────
// HOUSEHOLD
// ─────────────────────────────────────────

export async function getUserHousehold() {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return null

    const { data } = await supabase
        .from('HouseholdMember')
        .select('householdId, role, Household(id, name, baseCurrency)')
        .eq('userId', user.id)
        .eq('status', 'ACTIVE')
        .single()

    return data
}

// ─────────────────────────────────────────
// ACCOUNTS
// ─────────────────────────────────────────

export async function getAccounts(householdId: string) {
    const supabase = createClient()
    const { data } = await supabase
        .from('Account')
        .select('id, name, type, institution, currencyCode, openingBalance, status, includeInNetWorth')
        .eq('householdId', householdId)
        .eq('status', 'ACTIVE')
        .order('type')

    return data ?? []
}

export type Account = Awaited<ReturnType<typeof getAccounts>>[number]

// ─────────────────────────────────────────
// TRANSACTIONS
// ─────────────────────────────────────────

export async function getTransactions(householdId: string, opts?: {
    limit?: number
    accountId?: string
    startDate?: string
    endDate?: string
}) {
    const supabase = createClient()
    let q = supabase
        .from('Transaction')
        .select('id, txnDate, amount, direction, payeeText, notes, status, needsReview, categoryId, accountId, Category(id, name, type)')
        .eq('householdId', householdId)
        .order('txnDate', { ascending: false })

    if (opts?.accountId) q = q.eq('accountId', opts.accountId)
    if (opts?.startDate) q = q.gte('txnDate', opts.startDate)
    if (opts?.endDate) q = q.lte('txnDate', opts.endDate)
    if (opts?.limit) q = q.limit(opts.limit)

    const { data } = await q
    return data ?? []
}

export type Transaction = Awaited<ReturnType<typeof getTransactions>>[number]

// ─────────────────────────────────────────
// NET WORTH
// ─────────────────────────────────────────

export async function getNetWorthSummary(householdId: string) {
    const accounts = await getAccounts(householdId)
    const included = accounts.filter(a => a.includeInNetWorth)

    // Para el MVP usamos openingBalance como balance actual
    // En futuras fases se calculará como openingBalance + sum(transactions)
    const netWorth = included.reduce((s, a) => s + (a.openingBalance ?? 0), 0)
    const assets = included.filter(a => (a.openingBalance ?? 0) > 0).reduce((s, a) => s + (a.openingBalance ?? 0), 0)
    const debt = included.filter(a => (a.openingBalance ?? 0) < 0).reduce((s, a) => s + (a.openingBalance ?? 0), 0)

    return { netWorth, assets, debt, accountCount: accounts.length }
}

// ─────────────────────────────────────────
// CATEGORIES
// ─────────────────────────────────────────

export async function getCategories(householdId: string) {
    const supabase = createClient()
    const { data } = await supabase
        .from('Category')
        .select('id, name, type, parentId')
        .eq('householdId', householdId)
        .eq('status', 'ACTIVE')
        .order('name')
    return data ?? []
}
