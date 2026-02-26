'use server'

import { createClient } from '@/lib/supabase/server'
import { getUserHousehold } from '@/lib/data'
import { revalidatePath } from 'next/cache'

/** Obtiene los presupuestos del Household para un mes dado */
export async function getBudgets(householdId: string, yearMonth: string) {
    const supabase = createClient()

    // Presupuestos configurados
    const { data: budgets } = await supabase
        .from('Budget')
        .select('id, categoryId, amount, period, category:Category(name, emoji, color)')
        .eq('householdId', householdId)
        .eq('period', yearMonth)

    // Gastos reales del mes por categoría
    const startDate = `${yearMonth}-01`
    const endDate = new Date(parseInt(yearMonth.split('-')[0]), parseInt(yearMonth.split('-')[1]), 0)
        .toISOString().split('T')[0]

    const { data: txns } = await supabase
        .from('Transaction')
        .select('categoryId, amount')
        .eq('householdId', householdId)
        .eq('direction', 'OUTFLOW')
        .gte('txnDate', startDate)
        .lte('txnDate', endDate)

    // Agrupar gastos por categoría
    const spent: Record<string, number> = {}
    txns?.forEach(t => {
        if (t.categoryId) spent[t.categoryId] = (spent[t.categoryId] ?? 0) + t.amount
    })

    return (budgets ?? []).map((b: any) => ({
        ...b,
        spent: spent[b.categoryId] ?? 0,
        pct: b.amount > 0 ? Math.min(100, Math.round(((spent[b.categoryId] ?? 0) / b.amount) * 100)) : 0,
    }))
}

/** Crea o actualiza un presupuesto para una categoría en un mes */
export async function setBudget(formData: FormData) {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('No autenticado')

    const household = await getUserHousehold()
    if (!household?.householdId) throw new Error('Sin Household activo')

    const categoryId = formData.get('categoryId') as string
    const amount = parseFloat(formData.get('amount') as string)
    const period = formData.get('period') as string  // 'YYYY-MM'

    if (!categoryId || !amount || !period) throw new Error('Datos incompletos')

    // Upsert: si ya existe para ese mes/categoría, actualiza
    const { error } = await supabase.from('Budget').upsert({
        id: crypto.randomUUID(),
        householdId: household.householdId,
        categoryId,
        amount,
        period,
        createdAt: new Date().toISOString(),
    }, { onConflict: 'householdId,categoryId,period' })

    if (error) throw new Error(error.message)
    revalidatePath('/budget')
}

/** Elimina un presupuesto */
export async function deleteBudget(id: string) {
    const supabase = createClient()
    const { error } = await supabase.from('Budget').delete().eq('id', id)
    if (error) throw new Error(error.message)
    revalidatePath('/budget')
}
