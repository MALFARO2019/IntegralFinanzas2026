import OnboardingClient from './onboarding-client'
import { getUserHousehold } from '@/lib/data'
import { redirect } from 'next/navigation'

export const dynamic = 'force-dynamic'

export default async function OnboardingPage() {
    // Si ya tiene Household, redirigir al dashboard directamente
    const household = await getUserHousehold()
    if (household?.householdId) redirect('/')

    return <OnboardingClient />
}
