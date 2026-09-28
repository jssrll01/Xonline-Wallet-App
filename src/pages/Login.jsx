import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../components/Toast.jsx';
import './Login.css';

export default function Login() {
  const { login, attemptsLeft, lockoutUntil, maxAttempts } = useAuth();
  const toast = useToast();
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [shake, setShake] = useState(false);
  const [now, setNow] = useState(Date.now());
  const inputRef = useRef(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    inputRef.current?.focus();
  }, []);

  // Live countdown during lockout
  useEffect(() => {
    if (!lockoutUntil) return;
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, [lockoutUntil]);

  const isLocked = lockoutUntil > now;
  const lockedSeconds = isLocked ? Math.ceil((lockoutUntil - now) / 1000) : 0;
  const lockedMins = Math.floor(lockedSeconds / 60);
  const lockedSecs = lockedSeconds % 60;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isLocked) return;

    const result = login(code.trim());
    if (!result.ok) {
      setError(result.error);
      setShake(true);
      setCode('');
      setTimeout(() => setShake(false), 500);
      toast.push(result.error, 'error');
    } else {
      toast.push('Welcome back', 'success');
    }
  };

  return (
    <div className="login-wrap">
      <motion.div
        className="login-card"
        initial={{ opacity: 0, y: 28, scale: 0.94 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        <motion.div
          className="login-brand"
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.5 }}
        >
          <span className="brand-x">X</span>online
        </motion.div>

        <motion.h1
          className="login-title"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          Enter Access Code
        </motion.h1>

        <form onSubmit={handleSubmit} className="login-form">
          <input
            ref={inputRef}
            type="password"
            inputMode="numeric"
            maxLength={8}
            value={code}
            onChange={(e) => { setCode(e.target.value); setError(''); }}
            placeholder="••••"
            className={`code-input ${shake ? 'shake' : ''} ${error ? 'error' : ''}`}
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck={false}
            disabled={isLocked}
          />

          {isLocked && (
            <p className="login-error locked">
              Locked — retry in {lockedMins}:{String(lockedSecs).padStart(2, '0')}
            </p>
          )}

          {!isLocked && error && <p className="login-error">{error}</p>}

          {!isLocked && attemptsLeft < maxAttempts && attemptsLeft > 0 && !error && (
            <p className="login-attempts">
              {attemptsLeft} attempt{attemptsLeft !== 1 ? 's' : ''} remaining
            </p>
          )}

          <button
            type="submit"
            className="login-btn"
            disabled={!code.trim() || isLocked}
          >
            {isLocked ? `Locked (${lockedMins}:${String(lockedSecs).padStart(2, '0')})` : 'Unlock Wallet'}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
