'use server'

import { createClient } from '@/lib/supabase/server'
import { getUserHousehold } from '@/lib/data'
import { revalidatePath } from 'next/cache'

export interface Goal {
    id: string
    name: string
    emoji: string
    targetAmount: number
    currentAmount: number
    deadline: string | null
    accountId: string | null
    status: string
    createdAt: string
}

export async function getGoals(householdId: string): Promise<Goal[]> {
    const supabase = createClient()
    const { data } = await supabase
        .from('Goal')
        .select('*')
        .eq('householdId', householdId)
        .eq('status', 'ACTIVE')
        .order('createdAt', { ascending: false })
    return (data ?? []) as Goal[]
}

export async function createGoal(formData: FormData) {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('No autenticado')

    const household = await getUserHousehold()
    if (!household?.householdId) throw new Error('Sin Household activo')

    const name = (formData.get('name') as string)?.trim()
    const emoji = (formData.get('emoji') as string)?.trim() || '🎯'
    const targetAmount = parseFloat(formData.get('targetAmount') as string)
    const currentAmount = parseFloat(formData.get('currentAmount') as string || '0')
    const deadline = (formData.get('deadline') as string) || null

    if (!name || !targetAmount) throw new Error('Nombre y monto objetivo son requeridos')

    const { error } = await supabase.from('Goal').insert({
        id: crypto.randomUUID(),
        householdId: household.householdId,
        name,
        emoji,
        targetAmount,
        currentAmount,
        deadline,
        status: 'ACTIVE',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    })

    if (error) throw new Error(error.message)
    revalidatePath('/goals')
}

export async function contributeToGoal(goalId: string, amount: number) {
    const supabase = createClient()
    const { data: goal } = await supabase.from('Goal').select('currentAmount').eq('id', goalId).single()
    if (!goal) throw new Error('Meta no encontrada')

    const newAmount = (goal.currentAmount ?? 0) + amount
    const { error } = await supabase
        .from('Goal')
        .update({ currentAmount: newAmount, updatedAt: new Date().toISOString() })
        .eq('id', goalId)

    if (error) throw new Error(error.message)
    revalidatePath('/goals')
}

export async function deleteGoal(goalId: string) {
    const supabase = createClient()
    const { error } = await supabase
        .from('Goal')
        .update({ status: 'CANCELLED', updatedAt: new Date().toISOString() })
        .eq('id', goalId)

    if (error) throw new Error(error.message)
    revalidatePath('/goals')
}
