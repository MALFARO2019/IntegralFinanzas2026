'use server'

import { createClient } from '@/lib/supabase/server'
import { getUserHousehold } from '@/lib/data'
import { revalidatePath } from 'next/cache'

export async function addCategory(formData: FormData) {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('No autenticado')

    const household = await getUserHousehold()
    if (!household?.householdId) throw new Error('Sin Household activo')

    const name = (formData.get('name') as string)?.trim()
    const emoji = (formData.get('emoji') as string)?.trim() || '📦'
    const type = (formData.get('type') as string) || 'EXPENSE'
    const color = (formData.get('color') as string) || '#8B5CF6'

    if (!name) throw new Error('El nombre es requerido')

    const { error } = await supabase.from('Category').insert({
        id: crypto.randomUUID(),
        householdId: household.householdId,
        name,
        emoji,
        type,
        color,
        isSystem: false,
        createdAt: new Date().toISOString(),
    })

    if (error) throw new Error(error.message)
    revalidatePath('/categories')
}

export async function deleteCategory(id: string) {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('No autenticado')

    const { error } = await supabase.from('Category').delete().eq('id', id).eq('isSystem', false)
    if (error) throw new Error(error.message)

    revalidatePath('/categories')
}

export async function getCategories(householdId: string) {
    const supabase = createClient()
    const { data } = await supabase
        .from('Category')
        .select('id, name, emoji, type, color, isSystem')
        .eq('householdId', householdId)
        .order('name')
    return data ?? []
}
