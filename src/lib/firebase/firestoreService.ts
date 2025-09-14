// src/lib/firebase/firestoreService.ts
/**
 * This file contains functions for interacting with Firestore using the Firebase Admin SDK.
 * These functions are designed to be used ONLY within server-side contexts (e.g., Next.js Server Actions).
 */
import { getFirestore } from "firebase-admin/firestore";
import { adminApp } from "./server-config"; // Use the central adminApp instance

// Get the Firestore instance from the single, initialized Admin App.
const db = getFirestore(adminApp);

// Define a basic type for our User data structure
interface UserProfile {
    uid: string;
    email: string;
    createdAt: string;
}

/**
 * Creates or updates a user's profile in the 'users' collection.
 * @param userData The profile data for the user.
 */
export async function createUserProfile(userData: UserProfile): Promise<void> {
    try {
        const userDocRef = db.collection("users").doc(userData.uid);
        await userDocRef.set(userData);
        console.log("User profile created/updated successfully for UID:", userData.uid);
    } catch (error) {
        console.error("Error creating user profile in Firestore:", error);
        // Re-throw the error to be caught by the calling server action
        throw new Error("Failed to create user profile in database.");
    }
}

/**
 * Deletes a user's profile from the 'users' collection.
 * @param uid The unique identifier of the user to delete.
 */
export async function deleteUserProfile(uid: string): Promise<void> {
    try {
        const userDocRef = db.collection("users").doc(uid);
        await userDocRef.delete();
        console.log("User profile deleted successfully for UID:", uid);
    } catch (error) {
        console.error("Error deleting user profile from Firestore:", error);
        // We can choose to not throw here if the Auth deletion is more critical
        // but for consistency it's good to know if this fails.
        throw new Error("Failed to delete user profile from database.");
    }
}

/**
 * Fetches a single user's profile from the 'users' collection by their UID.
 * @param uid The unique identifier of the user.
 * @returns The user's profile data, or null if not found.
 */
export async function getUserProfile(uid: string): Promise<UserProfile | null> {
    try {
        const userDocRef = db.collection("users").doc(uid);
        const userDocSnap = await userDocRef.get();

        if (userDocSnap.exists) {
            return userDocSnap.data() as UserProfile;
        } else {
            return null;
        }
    } catch (error) {
        console.error("Error getting user document:", error);
        throw new Error("Failed to fetch user profile.");
    }
}
