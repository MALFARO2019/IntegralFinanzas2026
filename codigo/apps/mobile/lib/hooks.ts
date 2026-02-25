import { useEffect, useState, useCallback } from 'react'
import { getUserHousehold, getAccounts, getNetWorthSummary, getTransactions } from '@/lib/data'
import type { Account, Transaction } from '@/lib/data'

interface DashboardData {
    accounts: Account[]
    netWorth: number
    assets: number
    debt: number
    recentTxns: Transaction[]
    loading: boolean
    error: string | null
    householdId: string | null
}

export function useDashboardData(): DashboardData {
    const [data, setData] = useState<DashboardData>({
        accounts: [],
        netWorth: 0,
        assets: 0,
        debt: 0,
        recentTxns: [],
        loading: true,
        error: null,
        householdId: null,
    })

    const fetch = useCallback(async () => {
        try {
            const household = await getUserHousehold()
            if (!household?.householdId) {
                setData(d => ({ ...d, loading: false }))
                return
            }
            const hid = household.householdId
            const [accounts, summary, recentTxns] = await Promise.all([
                getAccounts(hid),
                getNetWorthSummary(hid),
                getTransactions(hid, { limit: 10 }),
            ])
            setData({
                accounts,
                netWorth: summary.netWorth,
                assets: summary.assets,
                debt: summary.debt,
                recentTxns,
                loading: false,
                error: null,
                householdId: hid,
            })
        } catch (e) {
            setData(d => ({ ...d, loading: false, error: 'Error al cargar datos' }))
        }
    }, [])

    useEffect(() => { fetch() }, [fetch])

    return data
}

export function useAccountsData() {
    const [data, setData] = useState<{
        accounts: Account[]
        netWorth: number
        assets: number
        debt: number
        loading: boolean
    }>({ accounts: [], netWorth: 0, assets: 0, debt: 0, loading: true })

    useEffect(() => {
        getUserHousehold().then(async household => {
            if (!household?.householdId) { setData(d => ({ ...d, loading: false })); return }
            const hid = household.householdId
            const [accounts, summary] = await Promise.all([getAccounts(hid), getNetWorthSummary(hid)])
            setData({ accounts, ...summary, loading: false })
        })
    }, [])

    return data
}

export function useTransactionsData(limit = 100) {
    const [data, setData] = useState<{ transactions: Transaction[]; loading: boolean }>({ transactions: [], loading: true })

    useEffect(() => {
        getUserHousehold().then(async household => {
            if (!household?.householdId) { setData(d => ({ ...d, loading: false })); return }
            const txns = await getTransactions(household.householdId, { limit })
            setData({ transactions: txns, loading: false })
        })
    }, [limit])

    return data
}
