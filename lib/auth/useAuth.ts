'use client';

import { useState, useEffect } from 'react';
import { useMsal } from '@azure/msal-react';
import { InteractionStatus } from '@azure/msal-browser';
import { loginRequest } from './msalConfig';

export function useAuth() {
  const { instance, accounts, inProgress } = useMsal();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsAuthenticated(accounts.length > 0);
    setIsLoading(inProgress !== InteractionStatus.None);
  }, [accounts, inProgress]);

  const login = async () => {
    try {
      await instance.loginPopup(loginRequest);
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  const logout = async () => {
    try {
      await instance.logoutPopup();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const getAccessToken = async (scopes: string[] = ['User.Read']) => {
    const account = accounts[0];
    if (!account) {
      throw new Error('No active account');
    }

    try {
      const response = await instance.acquireTokenSilent({
        scopes,
        account,
      });
      return response.accessToken;
    } catch (error) {
      console.error('Silent token acquisition failed:', error);
      // Fallback to interactive
      const response = await instance.acquireTokenPopup({
        scopes,
        account,
      });
      return response.accessToken;
    }
  };

  return {
    isAuthenticated,
    isLoading,
    user: accounts[0] || null,
    login,
    logout,
    getAccessToken,
  };
}
