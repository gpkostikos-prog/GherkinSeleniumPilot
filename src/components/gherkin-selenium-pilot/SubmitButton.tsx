// src/components/gherkin-selenium-pilot/SubmitButton.tsx
"use client";

import { useFormStatus } from "react-dom";
import { Button, type ButtonProps } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface SubmitButtonProps extends ButtonProps {
  loadingText?: string;
  children: React.ReactNode;
  loading?: boolean; // Allow overriding pending state if form uses useActionState
}

export function SubmitButton({ children, loadingText = "Processing...", loading: explicitLoading, ...props }: SubmitButtonProps) {
  const { pending } = useFormStatus();
  const isLoading = explicitLoading !== undefined ? explicitLoading : pending;

  return (
    <Button type="submit" disabled={isLoading} {...props}>
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          {loadingText}
        </>
      ) : (
        children
      )}
    </Button>
  );
}
