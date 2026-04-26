import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const session = await auth()

    if (!session || session.user?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const [
      totalUsers,
      activeUsers,
      totalGenerations,
      totalRevenue,
      freeUsers,
      proUsers,
      enterpriseUsers
    ] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({
        where: {
          totalGenerations: { gt: 0 }
        }
      }),
      prisma.generation.count(),
      prisma.payment.aggregate({
        where: { status: 'COMPLETED' },
        _sum: { amount: true }
      }),
      prisma.user.count({ where: { subscriptionTier: 'FREE' } }),
      prisma.user.count({ where: { subscriptionTier: 'PRO' } }),
      prisma.user.count({ where: { subscriptionTier: 'ENTERPRISE' } })
    ])

    return NextResponse.json({
      totalUsers,
      activeUsers,
      totalGenerations,
      totalRevenue: totalRevenue._sum.amount || 0,
      freeUsers,
      proUsers,
      enterpriseUsers
    })
  } catch (error) {
    console.error('Admin stats error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
