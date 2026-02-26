import { getUserHousehold } from '@/lib/data'
import { createClient } from '@/lib/supabase/server'
import ReportsClient from './reports-client'

export const dynamic = 'force-dynamic'

async function getReportsData(householdId: string) {
    const supabase = createClient()
    const now = new Date()

    // Últimos 6 meses
    const months: { yearMonth: string; label: string }[] = []
    for (let i = 5; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
        months.push({
            yearMonth: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`,
            label: d.toLocaleDateString('es-CR', { month: 'short' }),
        })
    }

    const startDate = `${months[0].yearMonth}-01`
    const endDate = `${months[5].yearMonth}-31`

    // Transacciones del período
    const { data: txns } = await supabase
        .from('Transaction')
        .select('amount, direction, txnDate, payeeText, category:Category(name, color, emoji)')
        .eq('householdId', householdId)
        .gte('txnDate', startDate)
        .lte('txnDate', endDate)

    // Gastos por categoría (mes actual)
    const currentMonth = months[5].yearMonth
    const byCategory: Record<string, { name: string; color: string; emoji: string; amount: number }> = {}
    txns?.filter(t => t.txnDate.startsWith(currentMonth) && t.direction === 'OUTFLOW').forEach((t: any) => {
        const catName = t.category?.name ?? 'Sin categoría'
        if (!byCategory[catName]) byCategory[catName] = { name: catName, color: t.category?.color ?? '#8B5CF6', emoji: t.category?.emoji ?? '📦', amount: 0 }
        byCategory[catName].amount += t.amount
    })

    // Ingresos vs Gastos por mes
    const byMonth = months.map(m => {
        const monthTxns = txns?.filter(t => t.txnDate.startsWith(m.yearMonth)) ?? []
        return {
            label: m.label,
            ingresos: monthTxns.filter(t => t.direction === 'INFLOW').reduce((s, t) => s + t.amount, 0),
            gastos: monthTxns.filter(t => t.direction === 'OUTFLOW').reduce((s, t) => s + t.amount, 0),
        }
    })

    // Top 10 gastos del mes
    const topGastos = (txns
        ?.filter(t => t.txnDate.startsWith(currentMonth) && t.direction === 'OUTFLOW')
        .sort((a, b) => b.amount - a.amount)
        .slice(0, 10) ?? []).map((t: any) => ({
            payeeText: t.payeeText as string,
            amount: t.amount as number,
            category: t.category ? { name: String(t.category.name ?? ''), emoji: String(t.category.emoji ?? '📦') } : null,
        }))

    return {
        byCategory: Object.values(byCategory).sort((a, b) => b.amount - a.amount),
        byMonth,
        topGastos,
        currentMonthLabel: new Date(now.getFullYear(), now.getMonth(), 1).toLocaleDateString('es-CR', { month: 'long', year: 'numeric' }),
    }
}

export default async function ReportsPage() {
    const household = await getUserHousehold()
    const data = household?.householdId
        ? await getReportsData(household.householdId)
        : { byCategory: [], byMonth: [], topGastos: [], currentMonthLabel: '' }

    return <ReportsClient {...data} />
}
