import { prisma } from 'database'
import CalendarClient from './calendar-client'

export const dynamic = 'force-dynamic'

interface RecurringTxn {
    id: string
    payeeText: string
    amount: number
    txnDate: string
    direction: string
    categoryName?: string
}

export default async function CalendarPage() {
    // Próximas transacciones recurrentes marcadas
    const upcoming: RecurringTxn[] = await prisma.transaction.findMany({
        where: {
            isRecurringMatch: true,
            txnDate: { gte: new Date() },
        },
        take: 20,
        orderBy: { txnDate: 'asc' },
        include: { category: true },
    }).then(txns => txns.map(t => ({
        id: t.id,
        payeeText: t.payeeText ?? 'Sin descripción',
        amount: t.amount,
        txnDate: t.txnDate.toISOString(),
        direction: t.direction,
        categoryName: t.category?.name,
    })))

    return <CalendarClient upcomingTxns={upcoming} />
}
