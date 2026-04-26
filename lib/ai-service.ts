import Replicate from 'replicate'
import { getPrompt } from './prompts'

export interface GenerateImageRequest {
  imageUrl: string
  prompt: string
  negativePrompt?: string
  category: 'universe' | 'prank' | 'outfit'
  templateId: string
}

export interface GenerateImageResponse {
  success: boolean
  imageUrl?: string
  error?: string
}

// Using Flux Schnell for fast generation
const FLUX_MODEL = "black-forest-labs/flux-schnell"

// Lazy initialize Replicate client
function getReplicateClient() {
  if (!process.env.REPLICATE_API_TOKEN) {
    return null
  }
  return new Replicate({
    auth: process.env.REPLICATE_API_TOKEN,
  })
}

export async function generateImage(request: GenerateImageRequest): Promise<GenerateImageResponse> {
  try {
    const replicate = getReplicateClient()
    if (!replicate) {
      return {
        success: false,
        error: 'AI service not configured. Please set REPLICATE_API_TOKEN.'
      }
    }

    const promptData = getPrompt(request.category, request.templateId)

    if (!promptData) {
      return {
        success: false,
        error: 'Invalid template'
      }
    }

    // Combine user image with prompt for image-to-image generation
    const fullPrompt = `${promptData.prompt}, maintaining the person's facial features and identity`

    const output = await replicate.run(
      FLUX_MODEL,
      {
        input: {
          prompt: fullPrompt,
          image: request.imageUrl,
          num_outputs: 1,
          guidance_scale: 7.5,
          num_inference_steps: 4, // Schnell is optimized for 4 steps
          output_format: "png",
          output_quality: 90,
        }
      }
    ) as string[]

    if (!output || output.length === 0) {
      return {
        success: false,
        error: 'No output generated'
      }
    }

    return {
      success: true,
      imageUrl: output[0]
    }
  } catch (error) {
    console.error('AI generation error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

// Alternative: Using Stable Diffusion for more control
export async function generateImageWithSD(request: GenerateImageRequest): Promise<GenerateImageResponse> {
  try {
    const replicate = getReplicateClient()
    if (!replicate) {
      return {
        success: false,
        error: 'AI service not configured. Please set REPLICATE_API_TOKEN.'
      }
    }

    const promptData = getPrompt(request.category, request.templateId)

    if (!promptData) {
      return {
        success: false,
        error: 'Invalid template'
      }
    }

    const output = await replicate.run(
      "stability-ai/sdxl:39ed52f2a78e934b3ba6e2a89f5b1c712de7dfea535525255b1aa35c5565e08b",
      {
        input: {
          prompt: promptData.prompt,
          negative_prompt: promptData.negativePrompt,
          image: request.imageUrl,
          num_outputs: 1,
          guidance_scale: 7.5,
          num_inference_steps: 25,
          output_format: "png",
          output_quality: 90,
        }
      }
    ) as string[]

    return {
      success: true,
      imageUrl: output[0]
    }
  } catch (error) {
    console.error('SD generation error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

