import { prisma } from 'database'
import TransactionsClient from './transactions-client'

export const dynamic = 'force-dynamic'

export default async function TransactionsPage() {
    const transactions = await prisma.transaction.findMany({
        take: 50,
        orderBy: { txnDate: 'desc' },
        include: { category: true },
    })

    const data = transactions.map(t => ({
        id: t.id,
        payeeText: t.payeeText ?? 'Sin descripción',
        amount: t.amount,
        direction: t.direction as 'INFLOW' | 'OUTFLOW' | 'TRANSFER',
        txnDate: t.txnDate.toISOString(),
        categoryName: t.category?.name,
        status: t.status,
        needsReview: t.needsReview,
    }))

    return <TransactionsClient transactions={data} />
}
