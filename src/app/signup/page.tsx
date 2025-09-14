// src/app/signup/page.tsx
import { SignupPage } from "@/components/auth/SignupPage";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <SignupPage />
    </main>
  );
}
