import { prisma } from 'database'
import DashboardClient from './dashboard-client'

export const dynamic = 'force-dynamic'

export default async function Home() {
  // Query a Base de Datos (Supabase) via Prisma ORM
  const testUsers = await prisma.user.count();

  return <DashboardClient testUsers={testUsers} />
}
