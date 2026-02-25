import DashboardClient from './dashboard-client'
import { getUserHousehold, getAccounts, getNetWorthSummary, getTransactions } from '@/lib/data'
import { redirect } from 'next/navigation'

export const dynamic = 'force-dynamic'

export default async function Home() {
  const household = await getUserHousehold()

  // Si el usuario no tiene Household → flujo de Onboarding
  if (!household?.householdId) redirect('/onboarding')

  const hid = household.householdId
  const [accounts, netWorthData, recentTxns] = await Promise.all([
    getAccounts(hid),
    getNetWorthSummary(hid),
    getTransactions(hid, { limit: 10 }),
  ])

  return (
    <DashboardClient
      accounts={accounts}
      netWorth={netWorthData.netWorth}
      assets={netWorthData.assets}
      debt={netWorthData.debt}
      recentTxns={recentTxns}
      hasHousehold
    />
  )
}
