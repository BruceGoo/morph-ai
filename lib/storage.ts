import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import sharp from 'sharp'

// Cloudflare R2 configuration (S3-compatible)
const s3Client = new S3Client({
  region: 'auto',
  endpoint: `https://${process.env.CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.CLOUDFLARE_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.CLOUDFLARE_SECRET_ACCESS_KEY || '',
  },
})

const BUCKET_NAME = process.env.CLOUDFLARE_BUCKET_NAME || 'morph-ai-images'
const PUBLIC_URL = process.env.CLOUDFLARE_PUBLIC_URL || ''

export interface UploadImageOptions {
  buffer: Buffer
  filename: string
  contentType: string
  folder?: string
  optimize?: boolean
}

export interface UploadImageResult {
  success: boolean
  url?: string
  key?: string
  error?: string
}

/**
 * Upload image to Cloudflare R2
 */
export async function uploadImage(options: UploadImageOptions): Promise<UploadImageResult> {
  try {
    let buffer = options.buffer

    // Optimize image if requested
    if (options.optimize) {
      buffer = await sharp(buffer)
        .resize(2048, 2048, { fit: 'inside', withoutEnlargement: true })
        .jpeg({ quality: 85 })
        .toBuffer()
    }

    const key = options.folder
      ? `${options.folder}/${Date.now()}-${options.filename}`
      : `${Date.now()}-${options.filename}`

    const command = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
      Body: buffer,
      ContentType: options.contentType,
    })

    await s3Client.send(command)

    const url = `${PUBLIC_URL}/${key}`

    return {
      success: true,
      url,
      key,
    }
  } catch (error) {
    console.error('Upload error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Upload failed',
    }
  }
}

/**
 * Delete image from Cloudflare R2
 */
export async function deleteImage(key: string): Promise<boolean> {
  try {
    const command = new DeleteObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
    })

    await s3Client.send(command)
    return true
  } catch (error) {
    console.error('Delete error:', error)
    return false
  }
}

/**
 * Generate presigned URL for direct upload
 */
export async function getUploadUrl(filename: string, contentType: string): Promise<string> {
  const key = `uploads/${Date.now()}-${filename}`

  const command = new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
    ContentType: contentType,
  })

  const url = await getSignedUrl(s3Client, command, { expiresIn: 3600 })
  return url
}

/**
 * Convert base64 to buffer
 */
export function base64ToBuffer(base64: string): Buffer {
  const base64Data = base64.replace(/^data:image\/\w+;base64,/, '')
  return Buffer.from(base64Data, 'base64')
}

/**
 * Get content type from base64
 */
export function getContentTypeFromBase64(base64: string): string {
  const match = base64.match(/^data:(image\/\w+);base64,/)
  return match ? match[1] : 'image/jpeg'
}
