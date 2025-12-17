'use client';

import { LoginButton } from '@/app/components/auth/LoginButton';

export function Header() {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-blue-600">Friday</h1>
            <span className="ml-3 text-sm text-gray-500">
              Intent-Driven Employee Assistant
            </span>
          </div>
          <LoginButton />
        </div>
      </div>
    </header>
  );
}
