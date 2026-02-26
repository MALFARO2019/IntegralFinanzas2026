'use server'

import { createClient } from '@/lib/supabase/server'
import { getUserHousehold } from '@/lib/data'
import { revalidatePath } from 'next/cache'

/**
 * Agrega una nueva cuenta al Household activo del usuario.
 */
export async function addAccount(formData: FormData) {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('No autenticado')

    const household = await getUserHousehold()
    if (!household?.householdId) throw new Error('Sin Household activo')

    const name = (formData.get('name') as string)?.trim()
    const type = (formData.get('type') as string) || 'CHECKING'
    const institution = (formData.get('institution') as string)?.trim() || ''
    const currencyCode = (formData.get('currency') as string) || 'CRC'
    const openingBalance = parseFloat((formData.get('balance') as string) || '0')
    const includeInNetWorth = formData.get('includeInNetWorth') !== 'false'

    if (!name) throw new Error('El nombre de la cuenta es requerido')

    const { error } = await supabase.from('Account').insert({
        id: crypto.randomUUID(),
        householdId: household.householdId,
        name,
        type,
        institution,
        currencyCode,
        openingBalance,
        status: 'ACTIVE',
        includeInBudget: true,
        includeInNetWorth,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    })

    if (error) throw new Error(error.message)

    revalidatePath('/accounts')
    revalidatePath('/')
}

/**
 * Elimina (desactiva) una cuenta del Household.
 */
export async function deleteAccount(accountId: string) {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('No autenticado')

    const { error } = await supabase
        .from('Account')
        .update({ status: 'INACTIVE', updatedAt: new Date().toISOString() })
        .eq('id', accountId)

    if (error) throw new Error(error.message)

    revalidatePath('/accounts')
    revalidatePath('/')
}
