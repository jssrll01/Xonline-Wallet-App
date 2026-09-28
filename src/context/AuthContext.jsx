import { createContext, useContext, useEffect, useRef, useState, useCallback } from 'react';

const AuthContext = createContext(null);
const STORAGE_KEY = 'xonline_auth';

// Access code — set here directly
const ACCESS_CODE = '1010';

const IDLE_MS = 2 * 60 * 1000;

export function AuthProvider({ children }) {
  const [isAuthed, setIsAuthed] = useState(false);
  const [loading, setLoading] = useState(true);
  const idleTimer = useRef(null);

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

  return (
    <AuthContext.Provider value={{ isAuthed, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}
