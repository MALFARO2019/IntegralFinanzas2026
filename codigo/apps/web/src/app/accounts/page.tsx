import { getUserHousehold, getAccounts, getNetWorthSummary } from '@/lib/data'
import AccountsPageClient from './accounts-client'

export const dynamic = 'force-dynamic'

export default async function AccountsPage() {
    const household = await getUserHousehold()
    let accounts: Awaited<ReturnType<typeof getAccounts>> = []
    let summary = { netWorth: 0, assets: 0, debt: 0, accountCount: 0 }

    if (household?.householdId) {
        ;[accounts, summary] = await Promise.all([
            getAccounts(household.householdId),
            getNetWorthSummary(household.householdId),
        ])
    }

    return (
        <AccountsPageClient
            accounts={accounts}
            netWorth={summary.netWorth}
            assets={summary.assets}
            debt={summary.debt}
        />
    )
}
