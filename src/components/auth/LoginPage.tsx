// src/components/auth/LoginPage.tsx
"use client";

import * as React from "react";
import { useSearchParams } from "next/navigation";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { LoginForm } from "./LoginForm"; // Import the new LoginForm

export function LoginPage() {
  const { toast } = useToast();
  const searchParams = useSearchParams();

  React.useEffect(() => {
    if (searchParams.get("signup") === "success") {
      toast({
        title: "Profile Created!",
        description: "Your profile has been created successfully. Please sign in to continue.",
        variant: "default",
      });
    }
  }, [searchParams, toast]);

  return (
    <Card className="w-full max-w-md shadow-2xl">
      <CardHeader className="text-center">
        <CardTitle className="text-3xl font-bold">Welcome Back</CardTitle>
        <CardDescription>Sign in to access the Proteus Pilot</CardDescription>
      </CardHeader>
      <CardContent>
        {/* Replace the old form with the new LoginForm component */}
        <LoginForm />
      </CardContent>
    </Card>
  );
}
