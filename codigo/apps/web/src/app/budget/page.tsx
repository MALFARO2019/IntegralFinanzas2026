import { getUserHousehold } from '@/lib/data'
import { getBudgets } from '@/lib/budget-actions'
import BudgetClient from './budget-client'

export const dynamic = 'force-dynamic'

export default async function BudgetPage() {
    const household = await getUserHousehold()
    const now = new Date()
    const yearMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`

    const budgets = household?.householdId
        ? await getBudgets(household.householdId, yearMonth)
        : []

    return <BudgetClient budgets={budgets} yearMonth={yearMonth} />
}
