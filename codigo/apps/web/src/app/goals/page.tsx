import { getUserHousehold } from '@/lib/data'
import { getGoals } from '@/lib/goal-actions'
import GoalsClient from './goals-client'

export const dynamic = 'force-dynamic'

export default async function GoalsPage() {
    const household = await getUserHousehold()
    const goals = household?.householdId
        ? await getGoals(household.householdId)
        : []

    return <GoalsClient goals={goals} />
}
