import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const session = await auth()

    if (!session || session.user?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const payments = await prisma.payment.findMany({
      take: 50,
      orderBy: { createdAt: 'desc' }
    })

    // Fetch user data separately
    const paymentsWithUsers = await Promise.all(
      payments.map(async (payment) => {
        const user = await prisma.user.findUnique({
          where: { id: payment.userId },
          select: { email: true, name: true }
        })
        return {
          ...payment,
          user: user || { email: 'Unknown', name: null }
        }
      })
    )

    return NextResponse.json(paymentsWithUsers)
  } catch (error) {
    console.error('Failed to fetch payments:', error)
    return NextResponse.json({ error: 'Failed to fetch payments' }, { status: 500 })
  }
}
