import { getUserHousehold } from '@/lib/data'
import { getCategories } from '@/lib/category-actions'
import CategoriesClient from './categories-client'

export const dynamic = 'force-dynamic'

export default async function CategoriesPage() {
    const household = await getUserHousehold()
    const categories = household?.householdId
        ? await getCategories(household.householdId)
        : []

    return <CategoriesClient categories={categories} />
}
