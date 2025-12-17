import { Configuration, LogLevel } from '@azure/msal-browser';

/**
 * MSAL Configuration for Entra ID (Azure AD) authentication using PKCE
 */
export const msalConfig: Configuration = {
  auth: {
    clientId: process.env.NEXT_PUBLIC_AZURE_CLIENT_ID || '',
    authority: `https://login.microsoftonline.com/${process.env.NEXT_PUBLIC_AZURE_TENANT_ID || 'common'}`,
    redirectUri: process.env.NEXT_PUBLIC_AZURE_REDIRECT_URI || 'http://localhost:3000',
    postLogoutRedirectUri: '/',
    navigateToLoginRequestUrl: false,
  },
  cache: {
    cacheLocation: 'sessionStorage',
    storeAuthStateInCookie: false,
  },
  system: {
    loggerOptions: {
      loggerCallback: (level: LogLevel, message: string, containsPii: boolean) => {
        if (containsPii) {
          return;
        }
        switch (level) {
          case LogLevel.Error:
            console.error(message);
            return;
          case LogLevel.Info:
            console.info(message);
            return;
          case LogLevel.Verbose:
            console.debug(message);
            return;
          case LogLevel.Warning:
            console.warn(message);
            return;
        }
      },
      logLevel: LogLevel.Warning,
    },
  },
};

/**
 * Scopes for API access
 */
export const loginRequest = {
  scopes: ['User.Read'],
};

/**
 * Add here scopes for access token to be used at API endpoints
 */
export const tokenRequest = {
  scopes: ['User.Read', 'openid', 'profile', 'email'],
import { Configuration, PopupRequest } from '@azure/msal-browser';

// MSAL configuration for Microsoft Entra ID
export const msalConfig: Configuration = {
  auth: {
    clientId: process.env.NEXT_PUBLIC_ENTRA_CLIENT_ID || '',
    authority: `https://login.microsoftonline.com/${process.env.NEXT_PUBLIC_ENTRA_TENANT_ID || 'common'}`,
    redirectUri: process.env.NEXT_PUBLIC_ENTRA_REDIRECT_URI || 'http://localhost:3000',
  },
  cache: {
    cacheLocation: 'sessionStorage', // Store tokens in sessionStorage
    storeAuthStateInCookie: false, // Set to true for IE11/Edge
  },
};

// Scopes for acquiring tokens
export const loginRequest: PopupRequest = {
  scopes: ['User.Read', 'openid', 'profile', 'email'],
};

// Additional scopes for Graph API
export const graphScopes = {
  calendar: ['Calendars.Read'],
  mail: ['Mail.Read'],
  user: ['User.Read', 'User.ReadBasic.All'],
};

// Scopes for backend API calls (OBO flow)
export const apiScopes = {
  orchestrator: ['api://friday-orchestrator/.default'],
  copilot: ['https://graph.microsoft.com/.default'],
};
