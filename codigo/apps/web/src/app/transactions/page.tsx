import { getUserHousehold, getTransactions } from '@/lib/data'
import TransactionsClient from './transactions-client'

export const dynamic = 'force-dynamic'

export default async function TransactionsPage() {
    const household = await getUserHousehold()
    const transactions = household?.householdId
        ? await getTransactions(household.householdId, { limit: 100 })
        : []

    return <TransactionsClient transactions={transactions} />
}
