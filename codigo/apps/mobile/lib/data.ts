/**
 * Capa de datos para Supabase — App Móvil (React Native)
 * Misma lógica que el web pero usa el cliente browser (AsyncStorage session)
 */

import { supabase } from './supabase'

// ─────────────────────────────────────────
// HOUSEHOLD
// ─────────────────────────────────────────

export async function getUserHousehold() {
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
    let q = supabase
        .from('Transaction')
        .select('id, txnDate, amount, direction, payeeText, status, needsReview, categoryId, accountId, Category(id, name, type)')
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
// NET WORTH SUMMARY
// ─────────────────────────────────────────

export async function getNetWorthSummary(householdId: string) {
    const accounts = await getAccounts(householdId)
    const included = accounts.filter(a => a.includeInNetWorth)
    const netWorth = included.reduce((s, a) => s + (a.openingBalance ?? 0), 0)
    const assets = included.filter(a => (a.openingBalance ?? 0) > 0).reduce((s, a) => s + (a.openingBalance ?? 0), 0)
    const debt = included.filter(a => (a.openingBalance ?? 0) < 0).reduce((s, a) => s + (a.openingBalance ?? 0), 0)
    return { netWorth, assets, debt, accountCount: accounts.length }
}
