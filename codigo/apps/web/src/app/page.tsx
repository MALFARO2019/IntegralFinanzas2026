import { prisma } from 'database'
import DashboardClient from './dashboard-client'

export const dynamic = 'force-dynamic'

export default async function Home() {
  const dbUserCount = await prisma.user.count()
  return <DashboardClient dbUserCount={dbUserCount} />
}
