// src/components/auth/LoginForm.tsx
"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { AtSign, KeyRound, AlertTriangle, ShieldQuestion, UserPlus } from "lucide-react";
import { getAuth, signInWithEmailAndPassword, type AuthError } from "firebase/auth";

import { createSessionAction } from "@/app/(actions)/authActions";
import { DeleteProfileDialog } from "./DeleteProfileDialog";
import { app } from "@/lib/firebase/config";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { SubmitButton } from "@/components/gherkin-selenium-pilot/SubmitButton";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";

export function LoginForm() {
    const router = useRouter();
    const { toast } = useToast();
    const [isLoading, setIsLoading] = React.useState(false);
    const [error, setError] = React.useState<string | null>(null);

    const handleForgotPassword = () => {
        toast({
            title: "Forgot Password",
            description: "A password recovery email would be sent in a real application.",
            variant: "default",
        });
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setIsLoading(true);
        setError(null);

        const formData = new FormData(event.currentTarget);
        const email = formData.get("email") as string;
        const password = formData.get("password") as string;

        if (!email || !password) {
            setError("Email and password are required.");
            setIsLoading(false);
            return;
        }

        const auth = getAuth(app);
        try {
            // Step 1: Client-side authentication with Firebase
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const idToken = await userCredential.user.getIdToken();

            // Step 2: Server-side session creation
            const sessionResult = await createSessionAction(idToken);
            if (sessionResult.success) {
                // Step 3: Redirect on successful session creation
                router.push("/test-converter");
            } else {
                // The server action failed. Display the specific error from the server.
                setError(sessionResult.error || "An unknown server error occurred.");
            }

        } catch (error: any) {
            // This catch block now correctly handles client-side Firebase Auth errors
            let errorMessage = "An unexpected error occurred. Please try again.";
            if (error.code) { // This is a Firebase AuthError
                switch (error.code) {
                    case 'auth/user-not-found':
                    case 'auth/wrong-password':
                    case 'auth/invalid-credential':
                        errorMessage = "Incorrect email or password. Please try again.";
                        break;
                    case 'auth/invalid-email':
                        errorMessage = "Please enter a valid email address.";
                        break;
                    default:
                        console.error("Firebase sign-in error:", error);
                        errorMessage = `An authentication error occurred. Please check logs.`;
                        break;
                }
            } else {
                // This handles any other unexpected errors during the process
                console.error("Sign-in process unexpected error:", error);
            }
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="email" className="text-base font-semibold flex items-center gap-1">
                        <AtSign className="h-4 w-4 text-primary" />
                        Email
                    </Label>
                    <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="user@example.com"
                        required
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="password" className="text-base font-semibold flex items-center gap-1">
                        <KeyRound className="h-4 w-4 text-primary" />
                        Password
                    </Label>
                    <Input
                        id="password"
                        name="password"
                        type="password"
                        required
                    />
                </div>
                
                {error && (
                    <Alert variant="destructive">
                        <AlertTriangle className="h-4 w-4" />
                        <AlertTitle>Login Failed</AlertTitle>
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}

                <SubmitButton
                    loading={isLoading}
                    loadingText="Signing in..."
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                    Sign In
                </SubmitButton>
            </form>

            <div className="mt-4 flex flex-wrap justify-between items-center text-sm">
                <Button variant="link" className="p-0 h-auto" onClick={handleForgotPassword}>
                    <ShieldQuestion className="mr-1 h-4 w-4" />
                    Forgot Password?
                </Button>
                <DeleteProfileDialog />
            </div>
            <div className="mt-4 text-center text-sm">
                Don&apos;t have an account?{' '}
                <Link href="/signup" className="underline text-primary hover:text-primary/80 flex items-center justify-center gap-1">
                    <UserPlus className="h-4 w-4" />
                    Create a Profile
                </Link>
            </div>
        </>
    );
}