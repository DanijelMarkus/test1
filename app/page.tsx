'use client';

import { useState } from 'react';
import { useIsAuthenticated, useMsal } from '@azure/msal-react';
import { loginRequest } from '@/lib/auth/msalConfig';
import SearchBar from '@/components/ui/SearchBar';
import CardGrid from '@/components/cards/CardGrid';

export default function Home() {
  const isAuthenticated = useIsAuthenticated();
  const { instance } = useMsal();
  const [searchResults, setSearchResults] = useState<any>(null);
  const [searching, setSearching] = useState(false);

  const handleLogin = () => {
    instance.loginPopup(loginRequest).catch((e) => {
      console.error('Login failed:', e);
    });
  };

  const handleLogout = () => {
    instance.logoutPopup().catch((e) => {
      console.error('Logout failed:', e);
    });
  };

  const handleSearch = async (query: string) => {
    setSearching(true);
    setSearchResults(null);

    try {
      const response = await fetch('/api/orchestrator', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query,
          userId: 'user-123',
        }),
      });
      const data = await response.json();
      setSearchResults(data);
    } catch (error) {
      console.error('Search failed:', error);
      setSearchResults({
        success: false,
        error: 'Search failed. Please try again.',
      });
    } finally {
      setSearching(false);
    }
  };

  return (
    <main className="min-h-screen">
      {/* Header */}
      <header className="bg-primary text-white py-4 px-6 shadow-md">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">Danci</h1>
          <div>
            {isAuthenticated ? (
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-white text-primary rounded hover:bg-gray-100 transition-colors"
              >
                Sign Out
              </button>
            ) : (
              <button
                onClick={handleLogin}
                className="px-4 py-2 bg-white text-primary rounded hover:bg-gray-100 transition-colors"
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4 text-gray-800">
            Welcome to Danci
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Your intelligent enterprise assistant powered by AI
          </p>

          {/* Search Bar */}
          <SearchBar onSearch={handleSearch} />

          {/* Search Results */}
          {searching && (
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <p className="text-gray-700">Searching...</p>
            </div>
          )}

          {searchResults && !searching && (
            <div className="mt-6 p-4 bg-white rounded-lg shadow-md max-w-3xl mx-auto text-left">
              <h3 className="text-lg font-bold mb-2 text-gray-800">Results:</h3>
              {searchResults.success ? (
                <div>
                  <p className="text-sm text-gray-600 mb-2">
                    <strong>Intent:</strong> {searchResults.data?.intent?.action} (
                    {(searchResults.data?.intent?.confidence * 100).toFixed(0)}% confidence)
                  </p>
                  <pre className="bg-gray-100 p-3 rounded overflow-auto text-xs">
                    {JSON.stringify(searchResults.data, null, 2)}
                  </pre>
                </div>
              ) : (
                <p className="text-red-600">{searchResults.error}</p>
              )}
            </div>
          )}
        </div>

        {/* Dashboard Cards */}
        <div className="mt-12">
          <h3 className="text-2xl font-bold mb-6 text-gray-800 text-center">
            Quick Access
          </h3>
          <CardGrid />
        </div>

        {/* Info Section */}
        <div className="mt-16 text-center">
          <h3 className="text-2xl font-bold mb-4 text-gray-800">
            Powered by Advanced AI Orchestration
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 max-w-5xl mx-auto">
            <div className="bg-white p-4 rounded-lg shadow">
              <h4 className="font-bold text-primary">Intent Agent</h4>
              <p className="text-sm text-gray-600">Analyzes your queries</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <h4 className="font-bold text-primary">Planner Agent</h4>
              <p className="text-sm text-gray-600">Creates execution plans</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <h4 className="font-bold text-primary">Executor Agent</h4>
              <p className="text-sm text-gray-600">Executes actions</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <h4 className="font-bold text-primary">Memory Agent</h4>
              <p className="text-sm text-gray-600">Maintains context</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <h4 className="font-bold text-primary">Guardrails Agent</h4>
              <p className="text-sm text-gray-600">Ensures security</p>
            </div>
          </div>
        </div>

        {/* Connectors Section */}
        <div className="mt-12 text-center">
          <h3 className="text-2xl font-bold mb-4 text-gray-800">
            Integrated Connectors
          </h3>
          <div className="flex justify-center gap-6 flex-wrap">
            <div className="bg-white px-6 py-3 rounded-lg shadow">
              <span className="font-semibold text-gray-800">ServiceNow (MCP)</span>
            </div>
            <div className="bg-white px-6 py-3 rounded-lg shadow">
              <span className="font-semibold text-gray-800">Workday (MCP)</span>
            </div>
            <div className="bg-white px-6 py-3 rounded-lg shadow">
              <span className="font-semibold text-gray-800">Custom Connectors</span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-6 mt-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p>&copy; 2024 Danci - Enterprise Portal. All rights reserved.</p>
          <p className="text-sm text-gray-400 mt-2">
            Powered by Next.js, Azure AD, and AI Orchestration
          </p>
        </div>
      </footer>
    </main>
  );
}
