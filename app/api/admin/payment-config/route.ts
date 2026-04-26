import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const session = await auth()
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Fetch config from database
    const configs = await prisma.systemConfig.findMany({
      where: {
        key: {
          in: [
            'stripe_enabled',
            'paypal_enabled',
            'default_provider',
            'stripe_price_pro_monthly',
            'stripe_price_pro_yearly',
            'paypal_plan_pro_monthly',
            'paypal_plan_pro_yearly'
          ]
        }
      }
    })

    const configMap = configs.reduce((acc, config) => {
      acc[config.key] = config.value
      return acc
    }, {} as Record<string, string>)

    return NextResponse.json({
      config: {
        stripeEnabled: configMap.stripe_enabled === 'true',
        paypalEnabled: configMap.paypal_enabled === 'true',
        defaultProvider: configMap.default_provider || 'stripe',
        stripePriceProMonthly: configMap.stripe_price_pro_monthly || '',
        stripePriceProYearly: configMap.stripe_price_pro_yearly || '',
        paypalPlanProMonthly: configMap.paypal_plan_pro_monthly || '',
        paypalPlanProYearly: configMap.paypal_plan_pro_yearly || ''
      }
    })
  } catch (error) {
    console.error('Get payment config error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth()
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()

    // Update configs in database
    const updates = [
      { key: 'stripe_enabled', value: String(body.stripeEnabled) },
      { key: 'paypal_enabled', value: String(body.paypalEnabled) },
      { key: 'default_provider', value: body.defaultProvider },
      { key: 'stripe_price_pro_monthly', value: body.stripePriceProMonthly },
      { key: 'stripe_price_pro_yearly', value: body.stripePriceProYearly },
      { key: 'paypal_plan_pro_monthly', value: body.paypalPlanProMonthly },
      { key: 'paypal_plan_pro_yearly', value: body.paypalPlanProYearly }
    ]

    for (const update of updates) {
      await prisma.systemConfig.upsert({
        where: { key: update.key },
        update: { value: update.value },
        create: update
      })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Update payment config error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
