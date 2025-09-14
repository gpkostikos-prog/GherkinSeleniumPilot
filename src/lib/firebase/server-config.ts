// src/lib/firebase/server-config.ts
import 'dotenv/config'; // Explicitly load environment variables from .env
import { initializeApp, getApps, cert, App } from "firebase-admin/app";

// This placeholder is for the user to replace with their actual service account JSON content.
const placeholderValue = "PASTE_YOUR_FIREBASE_SERVICE_ACCOUNT_JSON_HERE";

const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;

// Check for the service account JSON at the module level to fail fast.
if (!serviceAccountJson) {
  throw new Error(
    'CRITICAL: The FIREBASE_SERVICE_ACCOUNT_JSON environment variable is not set. ' +
    'Please add it to your .env file. ' +
    'This variable should contain the entire content of your Firebase service account JSON file.'
  );
}

// More robust check: see if the placeholder text is *included* in the variable.
if (serviceAccountJson.includes(placeholderValue)) {
  throw new Error(
    'CRITICAL: The FIREBASE_SERVICE_ACCOUNT_JSON environment variable contains the placeholder value. ' +
    'Please replace the placeholder text in your .env file with the actual content of your Firebase service account JSON file.'
  );
}


let serviceAccount: any;
try {
  serviceAccount = JSON.parse(serviceAccountJson);
} catch (error) {
    throw new Error(
        'CRITICAL: Failed to parse FIREBASE_SERVICE_ACCOUNT_JSON. ' +
        'Please ensure it is a valid JSON string. ' +
        'Original error: ' + (error instanceof Error ? error.message : String(error))
    );
}


const appName = "firebase-admin-app";

// A function to initialize and get the Firebase Admin app instance.
function initFirebaseAdminApp(): App {
  // Check if the app is already initialized to avoid re-initialization.
  const alreadyCreated = getApps().find((app) => app.name === appName);
  if (alreadyCreated) {
    return alreadyCreated;
  }

  // Initialize the Firebase Admin app with the service account credentials.
  // This is the corrected, working initialization.
  return initializeApp(
    {
      credential: cert(serviceAccount),
      projectId: serviceAccount.project_id,
    },
    appName
  );
}

// Initialize and export the single admin app instance for the entire server.
export const adminApp = initFirebaseAdminApp();
