import { createContext, useContext, useEffect, useRef, useState, useCallback } from 'react';

const AuthContext = createContext(null);
const STORAGE_KEY = 'xonline_auth';
const BIO_KEY = 'xonline_bio_cred';

// Access code — set here directly (no env required)
const ACCESS_CODE = '1010';

const IDLE_MS = 2 * 60 * 1000;

export function AuthProvider({ children }) {
  const [isAuthed, setIsAuthed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [bioAvailable, setBioAvailable] = useState(false);
  const idleTimer = useRef(null);

  useEffect(() => {
    const check = async () => {
      try {
        if (
          window.PublicKeyCredential &&
          typeof PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable === 'function'
        ) {
          const ok = await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
          setBioAvailable(ok);
        }
      } catch {
        setBioAvailable(false);
      }
    };
    check();
  }, []);

  useEffect(() => {
    const saved = sessionStorage.getItem(STORAGE_KEY);
    if (saved === 'granted') setIsAuthed(true);
    setLoading(false);
  }, []);

  const logout = useCallback(() => {
    sessionStorage.removeItem(STORAGE_KEY);
    setIsAuthed(false);
  }, []);

  useEffect(() => {
    if (!isAuthed) {
      if (idleTimer.current) clearTimeout(idleTimer.current);
      return;
    }
    const reset = () => {
      if (idleTimer.current) clearTimeout(idleTimer.current);
      idleTimer.current = setTimeout(() => {
        logout();
        window.dispatchEvent(new CustomEvent('xonline:idle-logout'));
      }, IDLE_MS);
    };
    const events = ['mousemove', 'keydown', 'click', 'touchstart', 'scroll'];
    events.forEach((e) => window.addEventListener(e, reset, { passive: true }));
    reset();
    return () => {
      events.forEach((e) => window.removeEventListener(e, reset));
      if (idleTimer.current) clearTimeout(idleTimer.current);
    };
  }, [isAuthed, logout]);

  const login = useCallback((code) => {
    if (code === ACCESS_CODE) {
      sessionStorage.setItem(STORAGE_KEY, 'granted');
      setIsAuthed(true);
      return { ok: true };
    }
    return { ok: false, error: 'Invalid access code' };
  }, []);

  const registerBiometric = useCallback(async (label = 'Xonline User') => {
    if (!bioAvailable || !window.PublicKeyCredential) {
      return { ok: false, error: 'Biometrics not available on this device' };
    }
    try {
      const challenge = new Uint8Array(32);
      crypto.getRandomValues(challenge);
      const userId = new Uint8Array(16);
      crypto.getRandomValues(userId);
      const cred = await navigator.credentials.create({
        publicKey: {
          challenge,
          rp: { name: 'Xonline Wallet' },
          user: { id: userId, name: label, displayName: label },
          pubKeyCredParams: [
            { type: 'public-key', alg: -7 },
            { type: 'public-key', alg: -257 },
          ],
          authenticatorSelection: {
            authenticatorAttachment: 'platform',
            userVerification: 'required',
            residentKey: 'preferred',
          },
          timeout: 60000,
          attestation: 'none',
        },
      });
      const b64 = btoa(String.fromCharCode(...new Uint8Array(cred.rawId)));
      sessionStorage.setItem(BIO_KEY, b64);
      return { ok: true };
    } catch (e) {
      return { ok: false, error: e?.message || 'Biometric setup failed' };
    }
  }, [bioAvailable]);

  const hasBiometric = !!sessionStorage.getItem(BIO_KEY);

  const loginWithBiometric = useCallback(async () => {
    const stored = sessionStorage.getItem(BIO_KEY);
    if (!stored) return { ok: false, error: 'No biometric credential registered' };
    try {
      const rawId = Uint8Array.from(atob(stored), (c) => c.charCodeAt(0));
      const challenge = new Uint8Array(32);
      crypto.getRandomValues(challenge);
      await navigator.credentials.get({
        publicKey: {
          challenge,
          timeout: 60000,
          userVerification: 'required',
          allowCredentials: [{ id: rawId, type: 'public-key', transports: ['internal'] }],
        },
      });
      sessionStorage.setItem(STORAGE_KEY, 'granted');
      setIsAuthed(true);
      return { ok: true };
    } catch (e) {
      return { ok: false, error: e?.message || 'Biometric unlock failed' };
    }
  }, []);

  const removeBiometric = useCallback(() => {
    sessionStorage.removeItem(BIO_KEY);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isAuthed, loading, login, logout,
        bioAvailable, hasBiometric,
        registerBiometric, loginWithBiometric, removeBiometric,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}
