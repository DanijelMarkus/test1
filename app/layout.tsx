import type { Metadata } from 'next';
import './globals.css';
import AuthProvider from '@/lib/auth/AuthProvider';

export const metadata: Metadata = {
  title: 'Danci - Enterprise Portal',
  description: 'Danci web app with Entra ID SSO and Copilot-backed API',
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
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      <body className="font-sans">
        <MsalAuthProvider>{children}</MsalAuthProvider>
      </body>
    </html>
  );
}
