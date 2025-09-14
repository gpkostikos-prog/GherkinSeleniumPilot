// src/components/auth/SignupPage.tsx
"use client";

import * as React from "react";
import { useActionState } from "react";
import { AtSign, KeyRound, AlertTriangle, UserPlus } from "lucide-react";

import { signupAction, type SignupState } from "@/app/(actions)/authActions";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { SubmitButton } from "@/components/gherkin-selenium-pilot/SubmitButton";
import Link from "next/link";

const initialSignupState: SignupState = {
  message: "",
};

export function SignupPage() {
  const [formState, formAction] = useActionState(signupAction, initialSignupState);

  return (
    <Card className="w-full max-w-md shadow-2xl">
      <CardHeader className="text-center">
        <CardTitle className="text-3xl font-bold">Create Profile</CardTitle>
        <CardDescription>Join the Proteus Pilot program</CardDescription>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="space-y-4">
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
              aria-invalid={!!formState?.fieldErrors?.email}
              aria-describedby="email-error"
              className={formState?.fieldErrors?.email ? "border-destructive" : ""}
            />
            {formState?.fieldErrors?.email && (
              <div id="email-error" className="text-destructive text-sm" role="alert">
                {formState.fieldErrors.email.join(", ")}
              </div>
            )}
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
              aria-invalid={!!formState?.fieldErrors?.password}
              aria-describedby="password-error"
              className={formState?.fieldErrors?.password ? "border-destructive" : ""}
            />
            {formState?.fieldErrors?.password && (
              <div id="password-error" className="text-destructive text-sm" role="alert">
                {formState.fieldErrors.password.join(", ")}
              </div>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword" className="text-base font-semibold flex items-center gap-1">
              <KeyRound className="h-4 w-4 text-primary" />
              Confirm Password
            </Label>
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              required
              aria-invalid={!!formState?.fieldErrors?.confirmPassword}
              aria-describedby="confirmPassword-error"
              className={formState?.fieldErrors?.confirmPassword ? "border-destructive" : ""}
            />
            {formState?.fieldErrors?.confirmPassword && (
              <div id="confirmPassword-error" className="text-destructive text-sm" role="alert">
                {formState.fieldErrors.confirmPassword.join(", ")}
              </div>
            )}
          </div>
          
          {formState?.error && !formState.fieldErrors && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Signup Failed</AlertTitle>
              <AlertDescription>{String(formState.error)}</AlertDescription>
            </Alert>
          )}

          <SubmitButton
            loadingText="Creating profile..."
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            <UserPlus className="mr-2 h-4 w-4" />
            Create Profile
          </SubmitButton>
        </form>

        <div className="mt-4 text-center text-sm">
            Already have an account?{' '}
            <Link href="/" className="underline text-primary hover:text-primary/80">
                Sign In
            </Link>
        </div>
      </CardContent>
    </Card>
  );
}
