# WerkFlow

## Installation & Setup

To run this application locally, you must have **Node.js** installed on your machine.

### !!! Important: Environment Variables (API Keys)
To ensure the security of my credentials, the `.env` file is not included in this repository.
**Before running the application, you must populate these keys.** You may find the keys in the powerpoint presentation and in the PebblePad submission.

1. Locate the `.env.example` file inside the `backend` directory.
2. Rename this file to exactly `.env` (removing the .example extension).
3. Open your new `.env` file.
4. Copy the required keys from the Title Slide of my PowerPoint presentation (or my PebblePad submission) and paste them in, so the file looks exactly like this:
   ```env
   ADZUNA_APP_ID=the_copied_app_id
   ADZUNA_API_KEY=the_copied_api_key
   MONGO_URI=the_copied_mongo_uri
   ```

## Setup instructions

### For Windows Users
! Ensure the .env file is populated.
1. Double-click the `start_windows.bat` file located in the root directory.
2. Two command prompt windows will automatically open (one for the backend, one for the frontend).
3. The frontend will launch (usually at `http://localhost:5173` - check the terminal output for the exact URL).

### For Mac/Linux Users
! Ensure the .env file is populated.
1. Open your terminal in the root directory.
2. Run the start script by typing: `bash start_mac_linux.sh`
3. The frontend will launch (usually at `http://localhost:5173` - check the terminal output for the exact URL).

### Manual Installation (If scripts fail)

If the automated scripts do not work for any reason, you can run the application manually by opening two separate terminal windows:

**Terminal 1 (Backend):**
1. Navigate to the backend directory: `cd backend`
2. Install dependencies: `npm install`
3. Start the server: `node server.js`

**Terminal 2 (Frontend):**
1. Navigate to the frontend directory: `cd frontend`
2. Install dependencies: `npm install`
3. Start the application: `npm run dev`
4. The frontend will launch and be available at `http://localhost:5173`.

## Extra info

There are two terminals as one is for the frontend, the other is for the backend.  
Each terminal runs `npm install` to download the necessary dependencies in the corresponding folder.  
The frontend runs `npm run dev` to turn on the frontend and let you connect using the provided URL.  
The backend runs `node server.js` to turn on the backend.