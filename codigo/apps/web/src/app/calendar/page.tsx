import { getUserHousehold, getTransactions } from '@/lib/data'
import CalendarClient from './calendar-client'
import { redirect } from 'next/navigation'

export const dynamic = 'force-dynamic'

export default async function CalendarPage() {
    const household = await getUserHousehold()
    if (!household?.householdId) redirect('/onboarding')

    // Todas las transacciones del mes actual y próximo para el calendario
    const now = new Date()
    const start = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0]
    const end = new Date(now.getFullYear(), now.getMonth() + 2, 0).toISOString().split('T')[0]

    const transactions = await getTransactions(household.householdId, {
        startDate: start,
        endDate: end,
        limit: 100,
    })

    // Transacciones recurrentes como "próximos pagos"
    const upcoming = transactions
        .filter(t => t.isRecurringMatch && t.txnDate >= now.toISOString().split('T')[0])
        .slice(0, 20)
        .map(t => ({
            id: t.id,
            payeeText: t.payeeText ?? 'Sin descripción',
            amount: t.amount ?? 0,
            txnDate: t.txnDate as string,
            direction: t.direction,
            categoryName: (t.Category as any)?.name,
        }))

    return <CalendarClient upcomingTxns={upcoming} allTxns={transactions.map(t => ({
        id: t.id,
        txnDate: t.txnDate as string,
        direction: t.direction,
        amount: t.amount ?? 0,
    }))} />
}
