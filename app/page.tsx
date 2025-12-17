'use client';

import { useAuth } from '@/lib/auth/useAuth';
import { Header } from '@/app/components/layout/Header';
import { Dashboard } from '@/app/components/layout/Dashboard';

export default function Home() {
  const { isAuthenticated, isLoading } = useAuth();

  return (
    <main className="min-h-screen bg-gray-50">
      <Header />
      
      {isLoading ? (
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading...</p>
          </div>
        </div>
      ) : isAuthenticated ? (
        <Dashboard />
      ) : (
        <div className="flex items-center justify-center h-96">
          <div className="text-center max-w-md">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Welcome to Friday
            </h2>
            <p className="text-gray-600 mb-8">
              Your personalized, intent-driven employee assistant powered by
              multi-agent orchestration and Microsoft Entra ID.
            </p>
            <p className="text-sm text-gray-500">
              Sign in to access your dashboard with today&apos;s schedule, news,
              actions, decisions, and approvals.
            </p>
          </div>
        </div>
      )}
    </main>
  );
}
