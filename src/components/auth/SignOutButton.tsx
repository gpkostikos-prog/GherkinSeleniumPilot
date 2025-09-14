// src/components/auth/SignOutButton.tsx
"use client";

import { signOutAction } from "@/app/(actions)/authActions";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

export function SignOutButton() {
  return (
    <form action={signOutAction}>
      <Button type="submit" variant="ghost" className="text-primary-foreground hover:bg-primary/80 hover:text-primary-foreground">
        <LogOut className="mr-2 h-4 w-4" />
        Sign Out
      </Button>
    </form>
  );
}
