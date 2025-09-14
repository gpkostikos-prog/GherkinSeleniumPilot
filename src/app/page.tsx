// src/app/page.tsx
import { redirect } from 'next/navigation';

// This page now simply redirects to the test converter, bypassing the login screen.
export default function Home() {
  redirect('/test-converter');
}
