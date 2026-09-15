import { google } from "googleapis"

/**
 * Setup Google Drive Auth menggunakan Service Account.
 * Lebih stabil dari OAuth2+RefreshToken karena tidak punya expiry manual
 * dan token di-refresh otomatis oleh library googleapis.
 */
const getDriveAuth = () => {
  const clientEmail = process.env.GOOGLE_CLIENT_EMAIL
  const privateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n")

  if (!clientEmail || !privateKey) {
    throw new Error(
      "Google Drive Service Account credentials (GOOGLE_CLIENT_EMAIL, GOOGLE_PRIVATE_KEY) are not configured"
    )
  }

  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: clientEmail,
      private_key: privateKey,
    },
    scopes: ["https://www.googleapis.com/auth/drive"],
  })

  return {
    drive: google.drive({ version: "v3", auth }),
    auth,
  }
}

export async function createResumableUpload(
  fileName: string,
  contentType: string,
  size: number,
  origin: string | null
): Promise<{ uploadUrl: string }> {
  const { auth } = getDriveAuth()
  const folderId = process.env.GOOGLE_DRIVE_FOLDER_ID

  if (!folderId) {
    throw new Error("GOOGLE_DRIVE_FOLDER_ID is not configured")
  }

  const body = JSON.stringify({
    name: fileName,
    parents: [folderId],
  })

  // Dapatkan access token dari Service Account (auto-refresh, tidak perlu refresh token manual)
  // GoogleAuth.getAccessToken() mengembalikan string | null langsung
  const token = await auth.getAccessToken()

  if (!token) {
    throw new Error("Failed to get Google Service Account Access Token")
  }

  const headers: Record<string, string> = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
    "X-Upload-Content-Type": contentType,
    "X-Upload-Content-Length": String(size),
  }

  // Include Origin if present for CORS
  if (origin) {
    headers["Origin"] = origin
  }

  const res = await fetch(
    "https://www.googleapis.com/upload/drive/v3/files?uploadType=resumable",
    {
      method: "POST",
      headers,
      body,
    }
  )

  if (!res.ok) {
    const text = await res.text()
    console.error("GDrive POST error:", res.status, text)
    throw new Error(`Failed to generate upload URL: ${res.statusText}`)
  }

  const uploadUrl = res.headers.get("location")
  if (!uploadUrl) {
    throw new Error("No upload URL returned from Google Drive")
  }

  return { uploadUrl }
}

export async function getWebViewLink(fileId: string): Promise<string> {
  const { drive } = getDriveAuth()

  try {
    const file = await drive.files.get({
      fileId,
      fields: "webViewLink",
    })
    return file.data.webViewLink || ""
  } catch (error) {
    console.error("Error getting file link from Google Drive:", error)
    throw new Error("Failed to get file link")
  }
}

