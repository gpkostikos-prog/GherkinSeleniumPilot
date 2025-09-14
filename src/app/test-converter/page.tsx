// src/app/test-converter/page.tsx
import PageClient from "@/components/gherkin-selenium-pilot/PageClient";
import { AppHeader } from "@/components/gherkin-selenium-pilot/AppHeader";

export default async function TestConverterPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <AppHeader title="Proteus" userEmail={null} />
      <PageClient />
    </div>
  );
}
