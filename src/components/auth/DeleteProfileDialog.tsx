// src/components/auth/DeleteProfileDialog.tsx
"use client";

import * as React from "react";
import { useActionState, useTransition } from "react";
import { useRouter } from 'next/navigation';
import { Trash2, AlertTriangle, AtSign, KeyRound } from "lucide-react";

import { deleteProfileAction, type DeleteProfileState } from "@/app/(actions)/authActions";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SubmitButton } from "../gherkin-selenium-pilot/SubmitButton";

const initialDeleteState: DeleteProfileState = {
  message: "",
};

export function DeleteProfileDialog() {
  const [isOpen, setIsOpen] = React.useState(false);
  // We use useTransition here because useActionState doesn't work well with closing dialogs before state updates.
  const [isPending, startTransition] = useTransition();
  const [formState, setFormState] = React.useState<DeleteProfileState>(initialDeleteState);
  const { toast } = useToast();
  const router = useRouter();
  const formRef = React.useRef<HTMLFormElement>(null);

  const handleFormAction = (formData: FormData) => {
    startTransition(async () => {
      const state = await deleteProfileAction(initialDeleteState, formData);
      setFormState(state);

      if (state.message === 'Success') {
        toast({
          title: "Profile Deleted",
          description: "The user profile has been successfully deleted.",
          variant: "default",
        });
        setIsOpen(false);
        formRef.current?.reset();
        // Force a page refresh to clear any stale state
        router.refresh();
      } else if (state.error) {
        toast({
          title: "Deletion Error",
          description: state.error,
          variant: "destructive",
        });
      }
    });
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="link" className="p-0 h-auto text-destructive hover:text-destructive/80">
          <Trash2 className="mr-1 h-4 w-4" />
          Delete Profile
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <form ref={formRef} action={handleFormAction}>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-6 w-6 text-destructive" />
              Are you absolutely sure?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete a user account
              and remove their data from our servers. This is useful for cleaning up accounts that failed to create properly.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className="space-y-4 my-4">
            <div className="space-y-2">
              <Label htmlFor="delete-email" className="flex items-center gap-1">
                <AtSign className="h-4 w-4 text-primary" />
                User Email
              </Label>
              <Input
                id="delete-email"
                name="email"
                type="email"
                placeholder="user@example.com"
                required
                className={formState?.fieldErrors?.email ? "border-destructive" : ""}
              />
               {formState?.fieldErrors?.email && (
                <p className="text-destructive text-sm">{formState.fieldErrors.email[0]}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="delete-password-placeholder" className="flex items-center gap-1">
                 <KeyRound className="h-4 w-4 text-primary" />
                 Password (for verification - currently disabled)
              </Label>
              <Input
                id="delete-password-placeholder"
                name="password"
                type="password"
                defaultValue="placeholder"
                disabled
                className="hidden" // Hiding the input as it's not needed for the form submission
              />
              <p className="text-xs text-muted-foreground">
                For this simplified cleanup tool, any user can be deleted by email alone.
              </p>
            </div>
          </div>

          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <SubmitButton
              type="submit"
              variant="destructive"
              loading={isPending}
              loadingText="Deleting..."
            >
              Yes, delete this profile
            </SubmitButton>
          </AlertDialogFooter>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  );
}
