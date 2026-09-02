const { google } = require('googleapis');
require('dotenv').config();

async function test() {
  try {
    const clientId = process.env.GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
    const refreshToken = process.env.GOOGLE_REFRESH_TOKEN;
    const folderId = process.env.GOOGLE_DRIVE_FOLDER_ID;

    if (!clientId || !clientSecret || !refreshToken) {
      throw new Error("Missing Google OAuth credentials");
    }

    const oauth2Client = new google.auth.OAuth2(
      clientId,
      clientSecret,
      "https://developers.google.com/oauthplayground"
    );

    oauth2Client.setCredentials({ refresh_token: refreshToken });

    console.log("Getting access token...");
    const tokenInfo = await oauth2Client.getAccessToken();
    console.log("Got access token");

    const body = JSON.stringify({
      name: 'test_refresh.txt',
      parents: [folderId],
    });

    console.log('Sending POST to generate uploadUrl...');
    const res = await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=resumable', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${tokenInfo.token}`,
        'Content-Type': 'application/json',
        'X-Upload-Content-Type': 'text/plain',
        'Origin': 'http://localhost:3000'
      },
      body
    });

    if (!res.ok) {
      console.log(res.status, await res.text());
      return;
    }

    const uploadUrl = res.headers.get('location');
    console.log('Got upload URL:', uploadUrl);

    console.log('Uploading file content via PUT...');
    const putRes = await fetch(uploadUrl, {
      method: 'PUT',
      headers: {
        'Content-Type': 'text/plain',
      },
      body: 'Hello World via Refresh Token!'
    });

    if (putRes.ok) {
       console.log('Success!', await putRes.json());
    } else {
       console.error('Failed to upload file content:', putRes.status, await putRes.text());
    }

  } catch (error) {
    console.error('Error during test:', error);
  }
}

test();
