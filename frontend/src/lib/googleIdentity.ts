interface GoogleCredentialResponse {
  credential?: string;
}

interface GooglePromptMomentNotification {
  isNotDisplayed?: () => boolean;
  isSkippedMoment?: () => boolean;
  isDismissedMoment?: () => boolean;
  getNotDisplayedReason?: () => string;
  getSkippedReason?: () => string;
  getDismissedReason?: () => string;
}

interface GoogleAccountsId {
  initialize: (options: {
    client_id: string;
    callback: (response: GoogleCredentialResponse) => void;
  }) => void;
  prompt: (listener?: (notification: GooglePromptMomentNotification) => void) => void;
}

declare global {
  interface Window {
    google?: {
      accounts?: {
        id?: GoogleAccountsId;
      };
    };
  }
}

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID as string | undefined;
const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000').replace(/\/+$/, '');
const GOOGLE_SCRIPT_SRC = 'https://accounts.google.com/gsi/client';

let googleScriptPromise: Promise<void> | null = null;
let resolvedGoogleClientIdPromise: Promise<string> | null = null;

function loadGoogleScript(): Promise<void> {
  if (window.google?.accounts?.id) {
    return Promise.resolve();
  }

  if (googleScriptPromise) {
    return googleScriptPromise;
  }

  googleScriptPromise = new Promise<void>((resolve, reject) => {
    const existingScript = document.querySelector(`script[src="${GOOGLE_SCRIPT_SRC}"]`);
    if (existingScript) {
      existingScript.addEventListener('load', () => resolve(), { once: true });
      existingScript.addEventListener('error', () => reject(new Error('Failed to load Google Identity Services script.')), { once: true });
      return;
    }

    const script = document.createElement('script');
    script.src = GOOGLE_SCRIPT_SRC;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load Google Identity Services script.'));
    document.head.appendChild(script);
  });

  return googleScriptPromise;
}

export async function getGoogleIdToken(): Promise<string> {
  const clientId = GOOGLE_CLIENT_ID || await getGoogleClientIdFromBackend();
  if (!clientId) {
    throw new Error('Google client ID is missing. Set VITE_GOOGLE_CLIENT_ID or configure /auth/config on backend.');
  }

  await loadGoogleScript();
  const googleAccounts = window.google?.accounts?.id;
  if (!googleAccounts) {
    throw new Error('Google Identity Services is unavailable.');
  }

  return new Promise<string>((resolve, reject) => {
    let settled = false;
    const timeoutId = window.setTimeout(() => {
      if (!settled) {
        settled = true;
        reject(new Error('Google sign-in timed out. Please try again.'));
      }
    }, 60000);

    googleAccounts.initialize({
      client_id: clientId,
      callback: (response: GoogleCredentialResponse) => {
        if (settled) return;
        settled = true;
        window.clearTimeout(timeoutId);
        if (!response.credential) {
          reject(new Error('Google sign-in did not return an idToken.'));
          return;
        }
        resolve(response.credential);
      },
    });

    googleAccounts.prompt((notification) => {
      if (settled) return;
      if (notification.isNotDisplayed?.()) {
        settled = true;
        window.clearTimeout(timeoutId);
        reject(new Error(`Google sign-in unavailable: ${notification.getNotDisplayedReason?.() || 'prompt was not displayed'}.`));
      } else if (notification.isSkippedMoment?.()) {
        settled = true;
        window.clearTimeout(timeoutId);
        reject(new Error(`Google sign-in skipped: ${notification.getSkippedReason?.() || 'prompt was skipped'}.`));
      } else if (notification.isDismissedMoment?.()) {
        settled = true;
        window.clearTimeout(timeoutId);
        reject(new Error(`Google sign-in dismissed: ${notification.getDismissedReason?.() || 'prompt was dismissed'}.`));
      }
    });
  });
}

async function getGoogleClientIdFromBackend(): Promise<string> {
  if (resolvedGoogleClientIdPromise) {
    return resolvedGoogleClientIdPromise;
  }

  resolvedGoogleClientIdPromise = (async () => {
    const response = await fetch(`${API_BASE_URL}/auth/config`, {
      method: 'GET',
      headers: { Accept: 'application/json' },
    });
    if (!response.ok) {
      throw new Error('Unable to load Google auth config from backend.');
    }

    const data = await response.json() as { googleClientId?: string | null; googleSignInEnabled?: boolean };
    const clientId = (data.googleClientId || '').trim();
    if (!clientId || data.googleSignInEnabled === false) {
      throw new Error('Google sign-in is disabled on backend. Configure GOOGLE_CLIENT_ID in backend .env.');
    }
    return clientId;
  })();

  try {
    return await resolvedGoogleClientIdPromise;
  } catch (error) {
    resolvedGoogleClientIdPromise = null;
    throw error;
  }
}
