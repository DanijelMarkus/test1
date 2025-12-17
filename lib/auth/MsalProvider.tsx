'use client';

import { ReactNode } from 'react';
import { MsalProvider as AzureMsalProvider } from '@azure/msal-react';
import { PublicClientApplication, EventType, EventMessage, AuthenticationResult } from '@azure/msal-browser';
import { msalConfig } from './msalConfig';

// Initialize MSAL instance
const msalInstance = new PublicClientApplication(msalConfig);

// Handle redirect promise
msalInstance.initialize().then(() => {
  // Account selection logic is app dependent
  const accounts = msalInstance.getAllAccounts();
  if (accounts.length > 0) {
    msalInstance.setActiveAccount(accounts[0]);
  }

  msalInstance.addEventCallback((event: EventMessage) => {
    if (event.eventType === EventType.LOGIN_SUCCESS && event.payload) {
      const payload = event.payload as AuthenticationResult;
      const account = payload.account;
      msalInstance.setActiveAccount(account);
    }
  });
});

interface MsalAuthProviderProps {
  children: ReactNode;
}

export function MsalAuthProvider({ children }: MsalAuthProviderProps) {
  return (
    <AzureMsalProvider instance={msalInstance}>
      {children}
    </AzureMsalProvider>
  );
}

export { msalInstance };
