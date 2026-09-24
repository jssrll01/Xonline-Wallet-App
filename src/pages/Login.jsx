import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext.jsx';
import './Login.css';

export default function Login() {
  const {
    login,
    bioAvailable,
    hasBiometric,
    registerBiometric,
    loginWithBiometric,
    removeBiometric,
  } = useAuth();
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [shake, setShake] = useState(false);
  const [busy, setBusy] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    inputRef.current?.focus();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const result = login(code.trim());
    if (!result.ok) {
      setError(result.error);
      setShake(true);
      setCode('');
      setTimeout(() => setShake(false), 500);
    }
  };

  const handleBiometric = async () => {
    setBusy(true);
    if (hasBiometric) {
      await loginWithBiometric();
    } else {
      const res = await registerBiometric('Xonline User');
      if (res.ok) await loginWithBiometric();
    }
    setBusy(false);
  };

  const handleForgetBio = () => {
    removeBiometric();
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

        <motion.div
          className="login-icon"
          initial={{ opacity: 0, scale: 0.5, rotate: -8 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ delay: 0.25, type: 'spring', stiffness: 180, damping: 14 }}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
        </motion.div>

        <motion.h1
          className="login-title"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.35, duration: 0.5 }}
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
          />

          {error && <p className="login-error">{error}</p>}

          <button type="submit" className="login-btn" disabled={!code.trim() || busy}>
            Unlock Wallet
          </button>
        </form>

        {bioAvailable && (
          <motion.div
            className="bio-section"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            <div className="bio-divider"><span>or</span></div>
            <button className="bio-btn" onClick={handleBiometric} disabled={busy} type="button">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4" />
              </svg>
              <span>{hasBiometric ? 'Unlock with biometrics' : 'Enable biometric unlock'}</span>
            </button>
            {hasBiometric && (
              <button className="bio-forget" onClick={handleForgetBio} type="button">
                Remove biometric lock
              </button>
            )}
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
