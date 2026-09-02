import { google } from "googleapis"

// Setup Google Drive Auth with OAuth2 (Refresh Token)
const getDriveAuth = () => {
  const clientId = process.env.GOOGLE_CLIENT_ID
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET
  const refreshToken = process.env.GOOGLE_REFRESH_TOKEN

  if (!clientId || !clientSecret || !refreshToken) {
    throw new Error("Google Drive OAuth credentials are not properly configured in environment variables")
  }

  const oauth2Client = new google.auth.OAuth2(
    clientId,
    clientSecret,
    "https://developers.google.com/oauthplayground"
  )

  oauth2Client.setCredentials({
    refresh_token: refreshToken
  })

  return {
    drive: google.drive({ version: "v3", auth: oauth2Client }),
    oauth2Client
  }
}

export async function createResumableUpload(
  fileName: string,
  contentType: string,
  size: number,
  origin: string | null
): Promise<{ uploadUrl: string }> {
  const { oauth2Client } = getDriveAuth()
  const folderId = process.env.GOOGLE_DRIVE_FOLDER_ID

  if (!folderId) {
    throw new Error("GOOGLE_DRIVE_FOLDER_ID is not configured")
  }

  const body = JSON.stringify({
    name: fileName,
    parents: [folderId],
  })

  const tokenInfo = await oauth2Client.getAccessToken()
  const token = tokenInfo.token

  if (!token) {
     throw new Error("Failed to get Google OAuth Access Token")
  }

  const headers: Record<string, string> = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
    "X-Upload-Content-Type": contentType,
  }

  // Include Origin if present for CORS
  if (origin) {
    headers["Origin"] = origin
  }

  const res = await fetch("https://www.googleapis.com/upload/drive/v3/files?uploadType=resumable", {
    method: "POST",
    headers,
    body,
  })

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
