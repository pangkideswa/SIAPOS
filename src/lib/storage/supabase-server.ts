import 'server-only'
import { createClient } from '@supabase/supabase-js'
import path from 'path'

export const BUCKETS = {
  SCHOOL: 'school',
  AVATARS: 'avatars',
  MATERIALS: 'materials',
  ASSIGNMENTS: 'assignments',
  SUBMISSIONS: 'submissions',
} as const

type BucketName = typeof BUCKETS[keyof typeof BUCKETS]

// Bucket configurations
const BUCKET_CONFIG: Record<BucketName, { public: boolean }> = {
  [BUCKETS.SCHOOL]: { public: true },
  [BUCKETS.AVATARS]: { public: true },
  [BUCKETS.MATERIALS]: { public: false },
  [BUCKETS.ASSIGNMENTS]: { public: false },
  [BUCKETS.SUBMISSIONS]: { public: false },
}

// Allowed MIME types
const ALLOWED_MIME_TYPES = [
  // Images
  'image/jpeg', 'image/png', 'image/webp', 'image/svg+xml',
  // Documents
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/vnd.ms-powerpoint',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  'text/plain'
]

// Max file sizes (in bytes)
const MAX_FILE_SIZE_IMAGES = 2 * 1024 * 1024 // 2MB
const MAX_FILE_SIZE_DOCS = 10 * 1024 * 1024  // 10MB

export function getSupabaseAdmin() {
  let supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl) {
    throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL environment variable')
  }
  
  if (supabaseUrl.endsWith('/rest/v1/')) {
    supabaseUrl = supabaseUrl.replace('/rest/v1/', '')
  } else if (supabaseUrl.endsWith('/')) {
    supabaseUrl = supabaseUrl.slice(0, -1)
  }

  if (!supabaseServiceKey) {
    throw new Error('Missing SUPABASE_SERVICE_ROLE_KEY environment variable. Do NOT expose this to the client.')
  }

  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
}

/**
 * Validates a file before uploading. Throws an error if invalid.
 */
export function validateFile(file: File, bucket: BucketName) {
  // 1. MIME Type Validation
  if (!ALLOWED_MIME_TYPES.includes(file.type)) {
    throw new Error(`File type ${file.type} is not allowed.`)
  }

  // 2. Extension Validation (prevent .exe, .sh, etc.)
  const ext = path.extname(file.name).toLowerCase()
  const blockedExtensions = ['.exe', '.bat', '.cmd', '.ps1', '.sh', '.js', '.ts', '.php']
  if (blockedExtensions.includes(ext) || !ext) {
    throw new Error(`File extension ${ext} is not allowed.`)
  }

  // 3. File Size Validation
  const isImageBucket = bucket === BUCKETS.SCHOOL || bucket === BUCKETS.AVATARS
  const maxSize = isImageBucket ? MAX_FILE_SIZE_IMAGES : MAX_FILE_SIZE_DOCS
  
  if (file.size > maxSize) {
    const maxSizeMB = maxSize / (1024 * 1024)
    throw new Error(`File size exceeds the limit of ${maxSizeMB}MB.`)
  }

  // 4. Filename Sanitization
  const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_')
  
  return sanitizedName
}

/**
 * Uploads a file to Supabase Storage with server-side validation.
 */
export async function uploadFile(
  bucket: BucketName,
  filePath: string,
  file: File,
  upsert: boolean = true
): Promise<{ path: string; fullPath: string; id: string }> {
  // Validate file
  validateFile(file, bucket)

  const supabase = getSupabaseAdmin()
  
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert,
      contentType: file.type
    })

  if (error) {
    throw new Error(`Failed to upload file to bucket ${bucket}: ${error.message}`)
  }

  return {
    path: data.path,
    fullPath: data.fullPath,
    id: data.id
  }
}

/**
 * Deletes a file from Supabase Storage.
 */
export async function deleteFile(bucket: BucketName, filePath: string): Promise<void> {
  const supabase = getSupabaseAdmin()
  const { error } = await supabase.storage.from(bucket).remove([filePath])
  
  if (error) {
    throw new Error(`Failed to delete file from bucket ${bucket}: ${error.message}`)
  }
}

/**
 * Creates a signed URL for private bucket access (Download).
 */
export async function createSignedUrl(bucket: BucketName, filePath: string, expiresInSeconds: number = 3600): Promise<string> {
  const supabase = getSupabaseAdmin()
  const { data, error } = await supabase.storage.from(bucket).createSignedUrl(filePath, expiresInSeconds)
  
  if (error) {
    throw new Error(`Failed to create signed URL: ${error.message}`)
  }
  
  return data.signedUrl
}

/**
 * Creates a signed URL for direct file upload to a private bucket.
 */
export async function createSignedUploadUrl(bucket: BucketName, filePath: string): Promise<{ signedUrl: string, path: string, token: string }> {
  const supabase = getSupabaseAdmin()
  const { data, error } = await supabase.storage.from(bucket).createSignedUploadUrl(filePath)
  
  if (error) {
    throw new Error(`Failed to create signed upload URL: ${error.message}`)
  }
  
  return data
}

/**
 * Gets a public URL for public buckets.
 */
export function getPublicUrl(bucket: BucketName, filePath: string): string {
  if (!BUCKET_CONFIG[bucket].public) {
    throw new Error(`Cannot get public URL for private bucket ${bucket}`)
  }

  const supabase = getSupabaseAdmin()
  const { data } = supabase.storage.from(bucket).getPublicUrl(filePath)
  return data.publicUrl
}

/**
 * Idempotently ensures all required buckets exist and have correct public settings.
 */
export async function ensureBucketsExist(): Promise<void> {
  const supabase = getSupabaseAdmin()
  
  const { data: existingBuckets, error: listError } = await supabase.storage.listBuckets()
  if (listError) {
    throw new Error(`Failed to list buckets: ${listError.message}`)
  }

  const existingBucketNames = existingBuckets.map(b => b.name)

  for (const bucket of Object.values(BUCKETS)) {
    const isPublic = BUCKET_CONFIG[bucket].public
    
    if (!existingBucketNames.includes(bucket)) {
      const { error: createError } = await supabase.storage.createBucket(bucket, {
        public: isPublic,
        fileSizeLimit: isPublic ? MAX_FILE_SIZE_IMAGES : MAX_FILE_SIZE_DOCS,
      })

      if (createError) {
        console.error(`Failed to create bucket ${bucket}: ${createError.message}`)
      } else {
        console.log(`Successfully created bucket: ${bucket} (public: ${isPublic})`)
      }
    } else {
       // Bucket exists, ensure its public status is correct
       const currentBucket = existingBuckets.find(b => b.name === bucket);
       if (currentBucket && currentBucket.public !== isPublic) {
          const { error: updateError } = await supabase.storage.updateBucket(bucket, {
              public: isPublic
          });
          if (updateError) {
              console.error(`Failed to update bucket public status for ${bucket}: ${updateError.message}`);
          }
       }
    }
  }
}
