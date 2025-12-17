import type { Metadata } from 'next';
import './globals.css';
import { MsalAuthProvider } from '@/lib/auth/MsalProvider';

export const metadata: Metadata = {
  title: 'Friday - Intent-Driven Employee Assistant',
  description: 'Your personalized, agentic employee experience platform',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="font-sans">
        <MsalAuthProvider>{children}</MsalAuthProvider>
      </body>
    </html>
  );
}
