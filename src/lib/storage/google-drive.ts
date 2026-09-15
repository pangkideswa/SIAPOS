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

/**
 * Upload file ke Google Drive server-side menggunakan Service Account.
 * Mengembalikan file ID Google Drive.
 * 
 * Tidak menggunakan resumable upload URL karena browser tidak bisa
 * langsung upload ke GDrive dengan Service Account (CORS diblokir).
 */
export async function uploadFileToDrive(
  fileName: string,
  contentType: string,
  fileBuffer: Buffer
): Promise<{ fileId: string }> {
  const { drive } = getDriveAuth()
  const folderId = process.env.GOOGLE_DRIVE_FOLDER_ID

  if (!folderId) {
    throw new Error("GOOGLE_DRIVE_FOLDER_ID is not configured")
  }

  const { Readable } = await import("stream")
  const stream = Readable.from(fileBuffer)

  const res = await drive.files.create({
    requestBody: {
      name: fileName,
      parents: [folderId],
    },
    media: {
      mimeType: contentType,
      body: stream,
    },
    fields: "id",
  })

  const fileId = res.data.id
  if (!fileId) {
    throw new Error("Google Drive did not return a file ID after upload")
  }

  return { fileId }
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
