'use server'

import { createClient } from '@/lib/supabase/server'
import { getUserHousehold } from '@/lib/data'
import { revalidatePath } from 'next/cache'

/**
 * Guarda una nueva transacción en Supabase.
 * Llamada desde AddTxnModal como Server Action.
 */
export async function addTransaction(formData: FormData) {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('No autenticado')

    const household = await getUserHousehold()
    if (!household?.householdId) throw new Error('Sin Household activo')

    const direction = (formData.get('direction') as string) || 'OUTFLOW'
    const amount = parseFloat(formData.get('amount') as string)
    const payeeText = (formData.get('payee') as string)?.trim()
    const categoryId = (formData.get('categoryId') as string) || null
    const txnDate = (formData.get('date') as string) || new Date().toISOString().split('T')[0]
    const notes = (formData.get('notes') as string)?.trim() || null
    const currencyCode = (formData.get('currency') as string) || 'CRC'
    const isRecurring = formData.get('isRecurring') === 'true'

    if (!amount || !payeeText) throw new Error('Monto y descripción son requeridos')

    const { error } = await supabase.from('Transaction').insert({
        id: crypto.randomUUID(),
        householdId: household.householdId,
        accountId: formData.get('accountId') as string || null,
        categoryId,
        txnDate,
        amount,
        currencyCode,
        direction,
        payeeText,
        notes,
        status: 'CLEARED',
        needsReview: false,
        isRecurringMatch: isRecurring,
        source: 'MANUAL',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    })

    if (error) throw new Error(error.message)

    // Revalidar las páginas que muestran transacciones
    revalidatePath('/')
    revalidatePath('/transactions')
    revalidatePath('/calendar')
}

/**
 * Actualiza una transacción existente.
 */
export async function updateTransaction(id: string, formData: FormData) {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('No autenticado')

    const direction = (formData.get('direction') as string) || 'OUTFLOW'
    const amount = parseFloat(formData.get('amount') as string)
    const payeeText = (formData.get('payee') as string)?.trim()
    const categoryId = (formData.get('categoryId') as string) || null
    const txnDate = (formData.get('date') as string) || new Date().toISOString().split('T')[0]
    const notes = (formData.get('notes') as string)?.trim() || null
    const currencyCode = (formData.get('currency') as string) || 'CRC'

    if (!amount || !payeeText) throw new Error('Monto y descripción son requeridos')

    const { error } = await supabase
        .from('Transaction')
        .update({ direction, amount, payeeText, categoryId, txnDate, notes, currencyCode, updatedAt: new Date().toISOString() })
        .eq('id', id)

    if (error) throw new Error(error.message)

    revalidatePath('/')
    revalidatePath('/transactions')
    revalidatePath('/calendar')
}

/**
 * Elimina una transacción permanentemente.
 */
export async function deleteTransaction(id: string) {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('No autenticado')

    const { error } = await supabase.from('Transaction').delete().eq('id', id)
    if (error) throw new Error(error.message)

    revalidatePath('/')
    revalidatePath('/transactions')
    revalidatePath('/calendar')
}
