// src/app/(actions)/authActions.ts
"use server";

import { z } from "zod";
import { redirect } from 'next/navigation';
import { cookies } from "next/headers";
import { getAuth, type UserRecord } from "firebase-admin/auth";
import { createUserProfile, deleteUserProfile } from "@/lib/firebase/firestoreService";
import { adminApp } from "@/lib/firebase/server-config";

// Use the single, centralized admin app instance for Auth
const adminAuth = getAuth(adminApp);

// --- Helper function to map Firebase error codes to user-friendly messages ---
function getFirebaseAuthErrorMessage(errorCode: string): string {
    switch (errorCode) {
        case "auth/invalid-email":
            return "Please enter a valid email address.";
        case "auth/user-not-found":
            return "No account found with this email address.";
        case "auth/invalid-credential":
             return "Incorrect email or password. Please try again.";
        case "auth/email-already-exists":
            return "An account with this email address already exists.";
        case "auth/weak-password":
            return "The password is too weak. Please use a stronger password.";
        case "auth/requires-recent-login":
            return "This is a sensitive operation. Please sign out and sign back in to continue.";
        case "auth/operation-not-allowed":
            return "Email/Password sign-in is not enabled. Please enable it in your Firebase Console under Authentication > Sign-in method.";
        case "auth/wrong-password":
            return "Incorrect password. Please try again.";
        default:
            console.error("Unhandled Firebase Auth Error Code:", errorCode);
            return "An unexpected authentication error occurred. Please try again.";
    }
}

// --- Server Action to create a session from an ID Token ---
export async function createSessionAction(idToken: string) {
    console.log("SERVER: createSessionAction invoked.");
    try {
        const expiresIn = 60 * 60 * 24 * 5 * 1000; // 5 days
        const sessionCookie = await adminAuth.createSessionCookie(idToken, { expiresIn });

        // Set cookie with explicit options, including Path=/
        cookies().set("session", sessionCookie, {
          maxAge: expiresIn,
          httpOnly: true,
          secure: true, // Set to true in production
          path: '/',   // CRITICAL: Make cookie available for all pages
        });

        console.log("SERVER: Session cookie created successfully.");
        return { success: true };
    } catch (error: any) {
        console.error("SERVER CRITICAL: Session creation failed.", {
          errorMessage: error.message,
          errorCode: error.code,
          stack: error.stack,
        });
        // Provide a meaningful error message back to the client.
        return { success: false, error: "Failed to create a session on the server. Please check server logs for details." };
    }
}


// --- Signup Action ---
const signupSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
  password: z.string()
    .min(8, { message: "Password must be at least 8 characters long." })
    .regex(/[a-z]/, { message: "Password must contain at least one lowercase letter." })
    .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter." })
    .regex(/[0-9]/, { message: "Password must contain at least one number." })
    .regex(/[^a-zA-Z0-9]/, { message: "Password must contain at least one special character." }),
  confirmPassword: z.string(),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords do not match.",
  path: ["confirmPassword"],
});

export interface SignupState {
  message: string;
  error?: string | string[];
  fieldErrors?: {
    email?: string[];
    password?: string[];
    confirmPassword?: string[];
  }
}

export async function signupAction(
  prevState: SignupState,
  formData: FormData
): Promise<SignupState> {
  const validation = signupSchema.safeParse(Object.fromEntries(formData));

  if (!validation.success) {
    return {
      message: "Validation failed.",
      error: "Please correct the highlighted fields.",
      fieldErrors: validation.error.flatten().fieldErrors,
    };
  }

  const { email, password } = validation.data;
  let userRecord: UserRecord | null = null;

  try {
    // Step 1: Create the user in Firebase Auth
    userRecord = await adminAuth.createUser({
        email,
        password,
        emailVerified: false,
        disabled: false
    });

    // Step 2: Create the user document in Firestore.
    // This is now in its own try...catch to handle failure separately.
    await createUserProfile({
        uid: userRecord.uid,
        email: userRecord.email!,
        createdAt: new Date().toISOString(),
    });

  } catch (error: any) {
    console.error("Signup Action Error:", error);

    // ATOMIC OPERATION: If Firestore write fails after Auth user is created, delete the Auth user.
    if (userRecord) {
        console.warn(`Firestore profile creation failed for UID ${userRecord.uid}. Deleting orphaned Auth user.`);
        await adminAuth.deleteUser(userRecord.uid);
    }

    const errorMessage = getFirebaseAuthErrorMessage(error.code || 'UNKNOWN_ERROR');
    // Provide a more specific error for database failures
    if (error.code === 'UNKNOWN_ERROR' || !error.code) {
        return { message: "Error", error: "A server error occurred while creating your profile. Please try again." };
    }

    return { message: "Error", error: errorMessage };
  }

  // Redirect to login page with a success message on successful signup
  redirect('/?signup=success');
}

// --- Delete Profile Action ---
const deleteProfileSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
});

export interface DeleteProfileState {
    message: string;
    error?: string;
    fieldErrors?: {
        email?: string[];
    }
}

export async function deleteProfileAction(
    prevState: DeleteProfileState,
    formData: FormData
): Promise<DeleteProfileState> {

    const validation = deleteProfileSchema.safeParse(Object.fromEntries(formData));
    if (!validation.success) {
        return {
            message: "Validation failed.",
            error: "Please correct the errors and try again.",
            fieldErrors: validation.error.flatten().fieldErrors,
        };
    }

    const { email } = validation.data;

    try {
        // Step 1: Find the user by email
        const userRecord = await adminAuth.getUserByEmail(email);

        // Step 2: Delete the user's Firestore document
        await deleteUserProfile(userRecord.uid);

        // Step 3: Delete the user from Firebase Auth
        await adminAuth.deleteUser(userRecord.uid);

        // Step 4: Clean up any lingering session cookie
        if (cookies().has("session")) {
            cookies().delete("session");
        }

    } catch (error: any) {
        console.error("Delete profile error:", error);
        if (error.code === 'auth/user-not-found') {
             return { message: 'Error', error: 'No user found with that email address.' };
        }
        const errorMessage = getFirebaseAuthErrorMessage(error.code || 'UNKNOWN');
        return { message: 'Error', error: errorMessage };
    }

    return { message: "Success" };
}


export async function signOutAction() {
  try {
    cookies().delete("session");
  } catch (error) {
    console.error("Sign out error:", error);
  }
  redirect('/');
}
