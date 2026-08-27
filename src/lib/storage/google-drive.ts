import { google, drive_v3 } from "googleapis"

export const getDriveClient = () => {
  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_CLIENT_EMAIL,
      private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    },
    scopes: ["https://www.googleapis.com/auth/drive"],
  })

  return google.drive({ version: "v3", auth })
}

export const GDRIVE_FOLDER_ID = process.env.GOOGLE_DRIVE_FOLDER_ID

export async function createResumableUpload(
  filename: string,
  contentType: string,
  size?: number,
  origin?: string | null
): Promise<{ uploadUrl: string }> {
  const drive = getDriveClient()
  
  // Start resumable upload session
  
  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_CLIENT_EMAIL,
      private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    },
    scopes: ["https://www.googleapis.com/auth/drive"],
  })

  const authClient = await auth.getClient()
  if (!authClient) throw new Error("Gagal inisialisasi autentikasi Google Drive")
  const token = await authClient.getAccessToken()
  if (!token.token) throw new Error("Gagal mendapatkan token Google Drive")

  const metadata = {
    name: filename,
    parents: [GDRIVE_FOLDER_ID],
  }

  const headers: Record<string, string> = {
    "Authorization": `Bearer ${token.token}`,
    "X-Upload-Content-Type": contentType,
    "Content-Type": "application/json",
  }
  
  if (size) headers["X-Upload-Content-Length"] = size.toString()
  if (origin) headers["Origin"] = origin

  const res = await fetch("https://www.googleapis.com/upload/drive/v3/files?uploadType=resumable", {
    method: "POST",
    headers,
    body: JSON.stringify(metadata)
  })

  if (!res.ok) {
    const text = await res.text()
    console.error("Gagal membuat sesi unggahan di Google Drive:", text)
    throw new Error("Gagal membuat sesi unggahan di Google Drive")
  }

  const uploadUrl = res.headers.get("Location")
  if (!uploadUrl) {
    throw new Error("Google Drive tidak mengembalikan URL unggahan")
  }

  return { uploadUrl }
}

export async function getWebViewLink(fileId: string): Promise<string> {
  const drive = getDriveClient()
  
  try {
    const res = await drive.files.get({
      fileId: fileId,
      fields: "webViewLink, webContentLink",
    })
    
    if (res.data.webViewLink) {
      return res.data.webViewLink
    } else if (res.data.webContentLink) {
      return res.data.webContentLink
    }
    
    throw new Error("Link tidak tersedia")
  } catch (error) {
    console.error("Error getting Drive link:", error)
    throw new Error("Gagal mendapatkan link dari Google Drive")
  }
}

export async function deleteDriveFile(fileId: string): Promise<void> {
  const drive = getDriveClient()
  try {
    await drive.files.delete({ fileId })
  } catch (error) {
    console.error(`Gagal menghapus file di Google Drive: ${fileId}`, error)
    // We intentionally don't throw to avoid breaking cascading deletions in our DB
  }
}
