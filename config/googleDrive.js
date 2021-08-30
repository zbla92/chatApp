const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');

const CLIENT_ID =
  '179608347920-quqncvkjqpn310q2mf5rourkbfp0a9su.apps.googleusercontent.com';
const CLIENT_SECRET = 'HtB1POJoOwasXPYUSzgCO_HF';
const REDIRECT_URI = 'http://localhost:3000/';

const REFRESH_TOKEN =
  '1//04sS0LlOGBkzdCgYIARAAGAQSNwF-L9Irt3FaO0VI31ju7gh13guFLIn51TiInY1Y7FpQUhYqn9QchJCefjiC9obwJwsthd-2_CY';

const oauth2client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI
);

const drive = google.drive({ version: 'v3', auth: oauth2client });

const removeFile = (filePath) =>
  fs.unlink(filePath, (err) => {
    if (err) console.error(err);
    return;
  });

const getFilePath = (image) =>
  path.join(__dirname, `../public/data/uploads/${image}`);

oauth2client.setCredentials({ refresh_token: REFRESH_TOKEN });

exports.generatePublicUrl = async (file) => {
  try {
    const response = await drive.permissions.create({
      fileId: file.id,
      requestBody: {
        role: 'reader',
        type: 'anyone',
      },
    });

    const result = await drive.files.get({
      fileId: file.id,
      fields: 'webViewLink',
    });

    // Update user profile picture
    return result.data.webViewLink;
  } catch (err) {
    console.log(err.message);
  }
};

exports.uploadFile = async (image) => {
  try {
    const response = await drive.files.create({
      requestBody: {
        name: `${image}.jpg`,
        mimeType: 'image/jpg',
        parents: ['17z7MvBcBwbYQEMPEmhQApD5U5qN_Yrc0'],
      },
      media: {
        mimeType: 'image/jpg',
        body: fs.createReadStream(getFilePath(image)),
      },
    });
    removeFile(getFilePath(image));
    this.generatePublicUrl(response.data);
    return response.data.id;
  } catch (err) {
    removeFile(getFilePath(image));
    console.log(err);
  }
};
