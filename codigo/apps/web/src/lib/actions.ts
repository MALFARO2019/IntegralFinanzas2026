'use server'

import { createClient } from '@/lib/supabase/server'

/**
 * Crea el Hogar Financiero inicial para el usuario autenticado.
 * Se llama desde el formulario de Onboarding como Server Action.
 */
export async function createHousehold(formData: FormData) {

    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('No autenticado')

    const name = (formData.get('name') as string)?.trim() || 'Mi Hogar Financiero'
    const baseCurrency = (formData.get('currency') as string) || 'CRC'

    // Crear el Household
    const { data: household, error: hhError } = await supabase
        .from('Household')
        .insert({
            id: crypto.randomUUID(),
            name,
            ownerUserId: user.id,
            baseCurrency,
            planTier: 'FREE',
            status: 'ACTIVE',
            createdAt: new Date().toISOString(),
        })
        .select('id')
        .single()

    if (hhError || !household) throw new Error(hhError?.message ?? 'Error al crear Household')

    // Crear la membresía del usuario
    await supabase.from('HouseholdMember').insert({
        id: crypto.randomUUID(),
        householdId: household.id,
        userId: user.id,
        role: 'OWNER',
        status: 'ACTIVE',
        joinedAt: new Date().toISOString(),
    })

    // Crear el perfil de usuario si no existe
    await supabase.from('User').upsert({
        id: user.id,
        email: user.email,
        name: user.user_metadata?.full_name ?? user.email?.split('@')[0],
        locale: 'es-CR',
        timezone: 'America/Costa_Rica',
        status: 'ACTIVE',
        createdAt: new Date().toISOString(),
        lastLoginAt: new Date().toISOString(),
    }, { onConflict: 'id' })

    return { householdId: household.id }
}

/**
 * Agrega la primera cuenta al Household recién creado.
 */
export async function createFirstAccount(formData: FormData) {

    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('No autenticado')

    // Buscar el Household activo del usuario
    const { data: member } = await supabase
        .from('HouseholdMember')
        .select('householdId')
        .eq('userId', user.id)
        .eq('status', 'ACTIVE')
        .single()

    if (!member?.householdId) throw new Error('Sin Household activo')

    const { error } = await supabase.from('Account').insert({
        id: crypto.randomUUID(),
        householdId: member.householdId,
        name: (formData.get('name') as string)?.trim(),
        type: (formData.get('type') as string) || 'CHECKING',
        institution: (formData.get('institution') as string)?.trim() || '',
        currencyCode: (formData.get('currency') as string) || 'CRC',
        openingBalance: parseFloat((formData.get('balance') as string) || '0'),
        status: 'ACTIVE',
        includeInBudget: true,
        includeInNetWorth: true,
    })

    if (error) throw new Error(error.message)
}
