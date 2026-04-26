import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { generateImage } from '@/lib/ai-service'
import { uploadImage, base64ToBuffer, getContentTypeFromBase64 } from '@/lib/storage'
import { getPrompt } from '@/lib/prompts'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { imageData, category, templateId, userId } = body

    if (!imageData || !category || !templateId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Check user limits (if userId provided)
    if (userId) {
      const user = await prisma.user.findUnique({
        where: { id: userId }
      })

      if (!user) {
        return NextResponse.json(
          { error: 'User not found' },
          { status: 404 }
        )
      }

      // Check daily limit for free users
      if (user.subscriptionTier === 'FREE') {
        const today = new Date()
        today.setHours(0, 0, 0, 0)

        if (user.lastGenerationReset < today) {
          // Reset daily count
          await prisma.user.update({
            where: { id: userId },
            data: {
              dailyGenerations: 0,
              lastGenerationReset: new Date()
            }
          })
        }

        if (user.dailyGenerations >= 5) {
          return NextResponse.json(
            { error: 'Daily limit reached. Upgrade to Pro for unlimited generations.' },
            { status: 429 }
          )
        }
      }
    }

    // Upload original image
    const buffer = base64ToBuffer(imageData)
    const contentType = getContentTypeFromBase64(imageData)

    const uploadResult = await uploadImage({
      buffer,
      filename: `original-${Date.now()}.jpg`,
      contentType,
      folder: 'originals',
      optimize: true
    })

    if (!uploadResult.success || !uploadResult.url) {
      return NextResponse.json(
        { error: 'Failed to upload image' },
        { status: 500 }
      )
    }

    // Get prompt
    const promptData = getPrompt(category, templateId)
    if (!promptData) {
      return NextResponse.json(
        { error: 'Invalid template' },
        { status: 400 }
      )
    }

    // Create generation record
    const generation = await prisma.generation.create({
      data: {
        userId: userId || 'anonymous',
        originalImageUrl: uploadResult.url,
        category,
        templateId,
        prompt: promptData.prompt,
        negativePrompt: promptData.negativePrompt,
        status: 'PROCESSING'
      }
    })

    // Generate image with AI
    const aiResult = await generateImage({
      imageUrl: uploadResult.url,
      prompt: promptData.prompt,
      negativePrompt: promptData.negativePrompt,
      category,
      templateId
    })

    if (!aiResult.success || !aiResult.imageUrl) {
      await prisma.generation.update({
        where: { id: generation.id },
        data: {
          status: 'FAILED',
          error: aiResult.error
        }
      })

      return NextResponse.json(
        { error: aiResult.error || 'Generation failed' },
        { status: 500 }
      )
    }

    // Update generation with result
    const updatedGeneration = await prisma.generation.update({
      where: { id: generation.id },
      data: {
        generatedImageUrl: aiResult.imageUrl,
        status: 'COMPLETED'
      }
    })

    // Update user stats
    if (userId) {
      await prisma.user.update({
        where: { id: userId },
        data: {
          dailyGenerations: { increment: 1 },
          totalGenerations: { increment: 1 }
        }
      })
    }

    return NextResponse.json({
      success: true,
      generation: updatedGeneration
    })

  } catch (error) {
    console.error('Generation API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const limit = parseInt(searchParams.get('limit') || '20')
    const offset = parseInt(searchParams.get('offset') || '0')

    const where = userId ? { userId } : {}

    const generations = await prisma.generation.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: offset,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true
          }
        },
        _count: {
          select: {
            likes: true,
            comments: true
          }
        }
      }
    })

    return NextResponse.json({ generations })

  } catch (error) {
    console.error('Get generations error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
