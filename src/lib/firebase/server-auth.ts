// src/lib/firebase/server-auth.ts
import { cookies } from "next/headers";
import { getAuth } from "firebase-admin/auth";
import { adminApp } from "./server-config"; // Use the central adminApp instance

const adminAuth = getAuth(adminApp);

export async function getCurrentUser() {
  const sessionCookie = cookies().get("session")?.value || "";
  
  // 1. Log whether we found a cookie
  if (!sessionCookie) {
    console.log("SERVER-AUTH (getCurrentUser): No session cookie found.");
    return null;
  }
  console.log("SERVER-AUTH (getCurrentUser): Found session cookie. Verifying...");

  try {
     // 2. Verify the session cookie.
     const decodedClaims = await adminAuth.verifySessionCookie(sessionCookie, true);
     
     // 3. Log success and return user data
     console.log("SERVER-AUTH (getCurrentUser): Session cookie is VALID. UID:", decodedClaims.uid);
     return {
        uid: decodedClaims.uid,
        email: decodedClaims.email,
     };
  } catch (error: any) {
    // 4. Log failure
    console.error("SERVER-AUTH (getCurrentUser): Session cookie verification FAILED.", {
      errorCode: error.code,
      errorMessage: error.message,
    });
    return null;
  }
}
