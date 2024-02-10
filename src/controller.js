const fs = require("fs");
const { google } = require("googleapis");

const creds = require("../creds.json");

const SCOPE = ["https://www.googleapis.com/auth/drive"];

async function authorize() {
  const jwtClient = new google.auth.JWT(
    creds.client_email,
    null,
    creds.private_key,
    SCOPE
  );

  await jwtClient.authorize();
  return jwtClient;
}

const sourceFileId = "196ps94jH31P7zj8Ukhs-TGkYR_9HmmUN";
const destinationFolderId = "1yiepbVlpVzx1X5tAD1iK7gjDGUSlJk-F";
const CHUNK_SIZE = 5 * 1024 * 1024; // 5MB chunks(it is optional)

//for downloaded files from google drive folder
async function downloadVideo(authClient) {
  //authenticated the Google Drive API
  const drive = google.drive({
    version: "v3",
    auth: authClient,
  });
  const dest = fs.createWriteStream("MyVideo.mp4"); //Creating Destination Stream to local folder with name MyVideo.mp4

  //Initiating File Download
  const res = await drive.files.get(
    { fileId: sourceFileId, alt: "media" },
    { responseType: "stream" }
  );

  //handling response
  return new Promise((resolve, reject) => {
    res.data
      .on("end", () => {
        console.log("Download completed.");
        resolve();
      })
      .on("error", (err) => {
        console.error("Error downloading file:", err);
        reject(err);
      })
      .pipe(dest);
  });
}

//for upload file to google drive folder
async function uploadVideo(authClient) {
  //authenticated the Google Drive API
  const drive = google.drive({
    version: "v3",
    auth: authClient,
  });
  const fileSize = fs.statSync("MyVideo.mp4").size; //getting gile size using fs.statSync in bytes
  // console.log("fileSize: ", fileSize);

  let progress = 0;  //take iniitial progress is 0

  //Metadata for the uploaded file is defined
  const fileMetadata = {
    name: "uploaded_video.mp4",
    parents: [destinationFolderId],
  };

  //Preparing Media Objec
  const media = {
    mimeType: "video/mp4",
    body: fs.createReadStream("MyVideo.mp4"),
  };

  // The file upload process is handled in chunks to avoid memory issues with large files. 
  // The function iterates over the file in chunks of size CHUNK_SIZE, uploading each chunk until 
  // the entire file has been uploaded.
  let start = 0;
  while (start < fileSize) {
    const end = Math.min(start + CHUNK_SIZE, fileSize);
    media.body = fs.createReadStream("MyVideo.mp4", {
      start,
      end: end - 1,
    });
    await drive.files.create({
      resource: fileMetadata,
      media: media,
      fields: "id",
    });
    start = end;
    progress = Math.round((end / fileSize) * 100);
    console.log(`Uploaded ${progress}%`);
  }
  console.log("Upload completed.");
}


async function initiateProcess(req, res) {
  try {
    const authClient = await authorize();
    await downloadVideo(authClient);
    await uploadVideo(authClient);
    res.status(200).json({ message: "Process completed successfully." });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal server error." });
  }
}

module.exports = { initiateProcess };
