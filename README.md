# Google Drive API Integration

## : This project demonstrates integration with the Google Drive API to download a video file and upload it to a specified folder.

### Setup

1. Credentials: Obtain the credentials for your Google Drive API service account and save them in a file named creds.json in the project root directory.

2. Dependencies Installation: Install the required dependencies using npm:

```yaml
npm install

"dependencies": {
    "express": "^4.18.2",
    "googleapis": "^132.0.0",
    "nodemon": "^3.0.3"
  }

```

3. Environment Variables: Ensure that the necessary environment variables are set up. This might include the Google Drive source file ID (sourceFileId) and the destination folder ID (destinationFolderId). Make sure these are correctly configured in the controller.js file.

### Project Structure

- app.js: Entry point of the application. Sets up the Express server and defines routes.
- src/routes.js: Defines the application routes and maps them to controller functions.
- src/controller.js: Contains functions to interact with the Google Drive API, including authorization, downloading a video file, uploading a video file, and status monitoring.
- creds.json: Service account credentials for authenticating with the Google Drive API.
- MyVideo.mp4: Downloaded video file saved locally during the process.

### Running the Application

Start the server using the following command:

```yaml
node app.js
or
npm start
```

The server will start running on http://localhost:8000.

### Endpoints

- POST /process: Initiates the process of downloading and uploading the video file.

