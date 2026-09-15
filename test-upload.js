require('dotenv').config();
const { google } = require('googleapis');
const { Readable } = require('stream');

async function testUpload() {
  try {
    const clientEmail = process.env.GOOGLE_CLIENT_EMAIL;
    const privateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n');
    const folderId = process.env.GOOGLE_DRIVE_FOLDER_ID;

    console.log("Client Email:", clientEmail);
    console.log("Private Key starts with:", privateKey ? privateKey.substring(0, 30) : "MISSING");
    console.log("Folder ID:", folderId);

    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: clientEmail,
        private_key: privateKey,
      },
      scopes: ["https://www.googleapis.com/auth/drive"],
    });

    const drive = google.drive({ version: "v3", auth });

    const fileBuffer = Buffer.from('Hello world from test script!');
    const stream = Readable.from(fileBuffer);

    console.log("Attempting upload...");
    const res = await drive.files.create({
      requestBody: {
        name: 'test_upload.txt',
        parents: [folderId],
      },
      media: {
        mimeType: 'text/plain',
        body: stream,
      },
      fields: "id",
    });

    console.log("Upload SUCCESS! File ID:", res.data.id);
  } catch (error) {
    console.error("UPLOAD FAILED!");
    console.error(error.message);
    if (error.response && error.response.data) {
      console.error("Details:", error.response.data);
    }
  }
}

testUpload();
