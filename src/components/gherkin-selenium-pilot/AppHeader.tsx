// src/components/gherkin-selenium-pilot/AppHeader.tsx
import Link from 'next/link';
import { User } from 'lucide-react';

interface AppHeaderProps {
  title: string;
  userEmail: string | null | undefined; // Allow undefined
}

const ProteusHeadLogoIcon = () => (
  <svg
    aria-hidden="true"
    width="50" // Increased from 40
    height="50" // Increased from 40
    viewBox="0 0 64 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="text-primary-foreground"
  >
    {/* Outer circle suggesting a face/head shape */}
    <circle cx="32" cy="32" r="26" stroke="currentColor" strokeWidth="3.5" opacity="0.5" />

    {/* Flowing beard/water elements - made more prominent */}
    <path
      d="M22 46 Q26 52 32 50 Q38 52 42 46"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      opacity="0.9"
    />
    <path
      d="M20 40 Q25 48 32 45 Q39 48 44 40"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      opacity="0.7"
    />
     <path
      d="M18 34 Q24 44 32 40 Q40 44 46 34"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      opacity="0.5"
    />

    {/* Suggestion of a crown or wisdom - made more prominent */}
    <path
      d="M26 20 Q32 14 38 20"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      opacity="0.8"
    />
    <path
      d="M32 14 V 9" // Slightly extended
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      opacity="0.8"
    />
    {/* Eyes made more prominent */}
    <circle cx="32" cy="26" r="2.5" fill="currentColor" opacity="0.7" />
    <circle cx="25" cy="30" r="2" fill="currentColor" opacity="0.6" />
    <circle cx="39" cy="30" r="2" fill="currentColor" opacity="0.6" />
  </svg>
);


export function AppHeader({ title, userEmail }: AppHeaderProps) {
  return (
    <header className="py-4 px-4 md:px-6 bg-primary text-primary-foreground shadow-lg">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
            <ProteusHeadLogoIcon />
            <div>
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight">{title}</h1>
              <p className="text-sm text-primary-foreground/80 tracking-wide">
                Intelligent Test Definition & Transformation
              </p>
            </div>
        </div>
        <div className="flex items-center gap-4">
          {/* The SignOutButton has been removed since there is no login process. */}
        </div>
      </div>
    </header>
  );
}
