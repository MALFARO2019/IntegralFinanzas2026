import { Suspense } from 'react'
import DashboardClient from './dashboard-client'
import { getUserHousehold, getAccounts, getNetWorthSummary, getTransactions } from '@/lib/data'

export const dynamic = 'force-dynamic'

export default async function Home() {
  const household = await getUserHousehold()

  let accounts: Awaited<ReturnType<typeof getAccounts>> = []
  let netWorthData = { netWorth: 0, assets: 0, debt: 0, accountCount: 0 }
  let recentTxns: Awaited<ReturnType<typeof getTransactions>> = []

  if (household?.householdId) {
    const hid = household.householdId
      ;[accounts, netWorthData, recentTxns] = await Promise.all([
        getAccounts(hid),
        getNetWorthSummary(hid),
        getTransactions(hid, { limit: 10 }),
      ])
  }

  return (
    <DashboardClient
      accounts={accounts}
      netWorth={netWorthData.netWorth}
      assets={netWorthData.assets}
      debt={netWorthData.debt}
      recentTxns={recentTxns}
      hasHousehold={!!household?.householdId}
    />
  )
}
