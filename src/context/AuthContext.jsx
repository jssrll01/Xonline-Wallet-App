import { createContext, useContext, useEffect, useRef, useState, useCallback } from 'react';

const AuthContext = createContext(null);
const STORAGE_KEY = 'xonline_auth';
const ATTEMPTS_KEY = 'xonline_attempts';
const LOCKOUT_KEY = 'xonline_lockout';

const ACCESS_CODE = '1010';
const IDLE_MS = 2 * 60 * 1000;
const MAX_ATTEMPTS = 5;
const LOCKOUT_MS = 5 * 60 * 1000; // 5 minutes

function getAttempts() {
  try {
    const raw = localStorage.getItem(ATTEMPTS_KEY);
    return raw ? JSON.parse(raw) : { count: 0, firstAt: 0 };
  } catch {
    return { count: 0, firstAt: 0 };
  }
}

function setAttempts(data) {
  localStorage.setItem(ATTEMPTS_KEY, JSON.stringify(data));
}

function getLockoutUntil() {
  const raw = localStorage.getItem(LOCKOUT_KEY);
  return raw ? Number(raw) : 0;
}

function setLockoutUntil(ts) {
  if (ts) localStorage.setItem(LOCKOUT_KEY, String(ts));
  else localStorage.removeItem(LOCKOUT_KEY);
}

export function AuthProvider({ children }) {
  const [isAuthed, setIsAuthed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [lockoutUntil, setLockoutUntilState] = useState(getLockoutUntil());
  const [attemptsLeft, setAttemptsLeft] = useState(MAX_ATTEMPTS - getAttempts().count);
  const idleTimer = useRef(null);

  // Restore session
  useEffect(() => {
    const saved = sessionStorage.getItem(STORAGE_KEY);
    if (saved === 'granted') setIsAuthed(true);
    setLoading(false);
  }, []);

  // Sync lockout countdown
  useEffect(() => {
    if (!lockoutUntil) return;
    const interval = setInterval(() => {
      const remaining = lockoutUntil - Date.now();
      if (remaining <= 0) {
        setLockoutUntil(0);
        setLockoutUntilState(0);
        setAttempts({ count: 0, firstAt: 0 });
        setAttemptsLeft(MAX_ATTEMPTS);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [lockoutUntil]);

  const logout = useCallback(() => {
    sessionStorage.removeItem(STORAGE_KEY);
    setIsAuthed(false);
  }, []);

  // Idle auto-logout
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
    // Check lockout
    const now = Date.now();
    const lockedUntil = getLockoutUntil();
    if (lockedUntil > now) {
      const mins = Math.ceil((lockedUntil - now) / 60000);
      return {
        ok: false,
        error: `Too many attempts. Try again in ${mins} min.`,
        locked: true,
      };
    }

    if (code === ACCESS_CODE) {
      // Success → clear attempts
      setAttempts({ count: 0, firstAt: 0 });
      setAttemptsLeft(MAX_ATTEMPTS);
      sessionStorage.setItem(STORAGE_KEY, 'granted');
      setIsAuthed(true);
      return { ok: true };
    }

    // Failure → increment
    const a = getAttempts();
    const nextCount = a.count + 1;
    const firstAt = a.firstAt || now;
    setAttempts({ count: nextCount, firstAt });

    if (nextCount >= MAX_ATTEMPTS) {
      const until = now + LOCKOUT_MS;
      setLockoutUntil(until);
      setLockoutUntilState(until);
      setAttemptsLeft(0);
      return {
        ok: false,
        error: `Too many attempts. Locked for ${LOCKOUT_MS / 60000} min.`,
        locked: true,
      };
    }

    setAttemptsLeft(MAX_ATTEMPTS - nextCount);
    return {
      ok: false,
      error: `Invalid access code (${MAX_ATTEMPTS - nextCount} left)`,
    };
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isAuthed,
        loading,
        login,
        logout,
        attemptsLeft,
        lockoutUntil,
        maxAttempts: MAX_ATTEMPTS,
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
