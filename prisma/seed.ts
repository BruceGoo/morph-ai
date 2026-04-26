import 'dotenv/config'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 开始填充数据库...')

  // 创建管理员用户
  const adminPassword = await bcrypt.hash('admin123', 10)
  const admin = await prisma.user.create({
    data: {
      email: 'admin@morph.ai',
      name: 'Admin User',
      password: adminPassword,
      role: 'ADMIN',
      subscriptionTier: 'ENTERPRISE',
      subscriptionStatus: 'active',
    },
  })
  console.log('✅ 创建管理员用户:', admin.email)

  // 创建测试用户
  const testPassword = await bcrypt.hash('test123', 10)
  const testUser = await prisma.user.create({
    data: {
      email: 'test@example.com',
      name: 'Test User',
      password: testPassword,
      role: 'USER',
      subscriptionTier: 'FREE',
      dailyGenerations: 3,
      totalGenerations: 15,
    },
  })
  console.log('✅ 创建测试用户:', testUser.email)

  // 创建 Pro 用户
  const proPassword = await bcrypt.hash('pro123', 10)
  const proUser = await prisma.user.create({
    data: {
      email: 'pro@example.com',
      name: 'Pro User',
      password: proPassword,
      role: 'USER',
      subscriptionTier: 'PRO',
      subscriptionStatus: 'active',
      stripeCustomerId: 'cus_test_123',
      totalGenerations: 150,
    },
  })
  console.log('✅ 创建 Pro 用户:', proUser.email)

  // 创建系统配置
  await prisma.systemConfig.createMany({
    data: [
      {
        key: 'default_payment_provider',
        value: 'stripe',
      },
      {
        key: 'stripe_price_pro_monthly',
        value: 'price_1234567890',
      },
      {
        key: 'stripe_price_pro_yearly',
        value: 'price_0987654321',
      },
      {
        key: 'paypal_plan_pro_monthly',
        value: 'P-1234567890',
      },
      {
        key: 'paypal_plan_pro_yearly',
        value: 'P-0987654321',
      },
    ],
  })
  console.log('✅ 创建系统配置')

  // 创建示例生成记录
  const generation1 = await prisma.generation.create({
    data: {
      userId: testUser.id,
      originalImageUrl: 'https://example.com/original1.jpg',
      generatedImageUrl: 'https://example.com/generated1.jpg',
      category: 'universe',
      templateId: 'astronaut',
      prompt: 'Transform into an astronaut in space',
      status: 'COMPLETED',
      isPublic: true,
      views: 125,
    },
  })
  console.log('✅ 创建示例生成记录 1')

  const generation2 = await prisma.generation.create({
    data: {
      userId: proUser.id,
      originalImageUrl: 'https://example.com/original2.jpg',
      generatedImageUrl: 'https://example.com/generated2.jpg',
      category: 'prank',
      templateId: 'maldives',
      prompt: 'Place in Maldives beach paradise',
      status: 'COMPLETED',
      isPublic: true,
      views: 89,
    },
  })
  console.log('✅ 创建示例生成记录 2')

  // 创建点赞
  await prisma.like.create({
    data: {
      userId: testUser.id,
      generationId: generation2.id,
    },
  })

  await prisma.like.create({
    data: {
      userId: proUser.id,
      generationId: generation1.id,
    },
  })
  console.log('✅ 创建点赞记录')

  // 创建评论
  await prisma.comment.createMany({
    data: [
      {
        userId: testUser.id,
        generationId: generation2.id,
        content: 'Amazing transformation! Looks so real!',
      },
      {
        userId: proUser.id,
        generationId: generation1.id,
        content: 'Love the space theme! 🚀',
      },
    ],
  })
  console.log('✅ 创建评论')

  // 创建支付记录
  await prisma.payment.create({
    data: {
      userId: proUser.id,
      amount: 19.99,
      currency: 'USD',
      provider: 'STRIPE',
      status: 'COMPLETED',
      stripePaymentId: 'pi_test_123456',
      subscriptionTier: 'PRO',
      billingPeriod: 'monthly',
    },
  })
  console.log('✅ 创建支付记录')

  console.log('🎉 数据库填充完成！')
  console.log('\n📊 测试账号:')
  console.log('管理员: admin@morph.ai / admin123')
  console.log('测试用户: test@example.com / test123')
  console.log('Pro 用户: pro@example.com / pro123')
}

main()
  .catch((e) => {
    console.error('❌ 错误:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
