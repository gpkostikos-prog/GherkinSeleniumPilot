
// src/components/gherkin-selenium-pilot/PrivacyInfoFooterSection.tsx
import Link from 'next/link';
import { AlertTriangle, ShieldCheck } from 'lucide-react';

export function PrivacyInfoFooterSection() {
  return (
    <div className="container mx-auto px-4 py-3 text-xs text-muted-foreground border-t bg-background/70">
      <div className="flex flex-col md:flex-row items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-5 w-5 text-accent" />
          <p className="font-semibold">Your Privacy & Data:</p>
        </div>
      </div>
      <ul className="list-disc list-inside space-y-1 mt-2 pl-2 text-left">
        <li>
          We are committed to protecting your privacy. This application minimizes the logging of your activity.
        </li>
        <li>
          Your input data (Gherkin, code snippets, etc.) is processed by AI services (powered by Google) to provide the features of this tool and is not persistently stored by this application after processing, beyond what is necessary for the AI service interaction.
        </li>
        <li>
          For more information on how we handle data and your rights, including those under GDPR, please review our{' '}
          <Link href="/privacy-policy" className="underline hover:text-primary transition-colors">
            Privacy Policy
          </Link>
          . (Note: This is a placeholder link. You'll need to create and link your actual privacy policy.)
        </li>
      </ul>
      <div className="mt-3 flex items-center gap-1 text-muted-foreground/80">
        <AlertTriangle className="h-3 w-3" />
        <p>
          The information above is for general awareness. Please consult our Privacy Policy for full details.
          For legal advice on GDPR compliance, consult a legal professional.
        </p>
      </div>
    </div>
  );
}
