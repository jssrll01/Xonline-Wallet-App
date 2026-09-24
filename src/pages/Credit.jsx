import { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { motion, AnimatePresence } from 'framer-motion';
import ScreenshotWarning from '../components/ScreenshotWarning.jsx';
import './Credit.css';

const METHODS = {
  ewallet: [
    { id: 'gcash', name: 'GCash', color: '#007DFE' },
    { id: 'maya', name: 'Maya', color: '#00C853' },
    { id: 'paypal', name: 'PayPal', color: '#003087' },
  ],
  bank: [
    { id: 'gotyme', name: 'GoTyme', color: '#00B8D4' },
    { id: 'bpi', name: 'BPI', color: '#B5121B' },
  ],
};

const WALLET_INFO = {
  gcash: { label: 'GCash', number: '0945 440 8496', name: 'JESSRELL C.' },
  maya: { label: 'Maya', number: '0945 440 8496', name: 'JESSRELL CUSTODIO' },
  paypal: { label: 'PayPal', number: 'custodiojessrell07@gmail.com', name: 'Jessrell Custodio' },
  gotyme: { label: 'GoTyme', number: '1234 5678 9012', name: 'JESSRELL C.' },
  bpi: { label: 'BPI', number: '1234 5678 9012', name: 'JESSRELL C.' },
};

const WALLET_ID = 'XN-4021-8890-1174';
const MEMBER_SINCE = 'MAR 2024';

export default function Credit() {
  const [type, setType] = useState('ewallet');
  const [method, setMethod] = useState(null);
  const [copied, setCopied] = useState(false);

  const selected = method ? WALLET_INFO[method] : null;
  const qrValue = selected
    ? `${selected.label}|${selected.number}|${selected.name}`
    : '';

  const copyToClipboard = async () => {
    if (!selected) return;
    try {
      await navigator.clipboard.writeText(selected.number);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      /* ignore */
    }
  };

  const isFullView = Boolean(method);

  return (
    <div className={`page credit-page ${isFullView ? 'full-view' : ''}`}>
      <AnimatePresence mode="wait">
        {!isFullView && (
          <motion.div
            key="list-view"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -14 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Wallet Card Hero */}
            <motion.div
              className="wallet-hero"
              initial={{ opacity: 0, y: 24, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="wallet-hero-glow" />
              <div className="wallet-card-shimmer" />

              <div className="wallet-hero-top">
                <div className="wallet-chip">
                  <div className="chip-lines">
                    <span /><span /><span />
                  </div>
                </div>
              </div>

              <div className="wallet-hero-mid">
                <p className="wallet-label">Xonline Wallet</p>
                <p className="wallet-number">•••• •••• •••• 1174</p>
              </div>

              <div className="wallet-hero-bottom">
                <div>
                  <p className="wallet-meta-label">Wallet ID</p>
                  <p className="wallet-meta-value">{WALLET_ID}</p>
                </div>
                <div>
                  <p className="wallet-meta-label">Member Since</p>
                  <p className="wallet-meta-value">{MEMBER_SINCE}</p>
                </div>
              </div>
            </motion.div>

            {/* Section title */}
            <div className="section-head">
              <h2 className="section-title">Choose a method</h2>
              <p className="section-sub">Credit funds to your Xonline wallet</p>
            </div>

            {/* Toggle */}
            <div className="toggle-group">
              <button
                className={type === 'ewallet' ? 'active' : ''}
                onClick={() => { setType('ewallet'); setMethod(null); }}
              >
                E-Wallet
              </button>
              <button
                className={type === 'bank' ? 'active' : ''}
                onClick={() => { setType('bank'); setMethod(null); }}
              >
                Bank
              </button>
            </div>

            {/* Method list */}
            <div className="method-list">
              <AnimatePresence mode="popLayout">
                {METHODS[type].map((m, i) => (
                  <motion.button
                    key={m.id}
                    layout
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ delay: i * 0.05, duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                    whileHover={{ scale: 1.015, y: -2 }}
                    whileTap={{ scale: 0.985 }}
                    className="method-item"
                    onClick={() => setMethod(m.id)}
                  >
                    <span className="method-bar" style={{ background: m.color }} />
                    <span className="method-name">{m.name}</span>
                    <span className="method-arrow">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="9 18 15 12 9 6" />
                      </svg>
                    </span>
                  </motion.button>
                ))}
              </AnimatePresence>
            </div>
          </motion.div>
        )}

        {isFullView && selected && (
          <motion.div
            key={`qr-${method}`}
            className="qr-section full-page"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
          >
            <motion.div
              className="selected-brand"
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            >
              <h2 className="selected-label">{selected.label}</h2>
              <span className="selected-sub">
                <span className="live-dot" /> Ready to receive
              </span>
            </motion.div>

            {/* QR with pop animation */}
            <motion.div
              className="qr-wrapper"
              initial={{ opacity: 0, scale: 0.7, rotate: -4 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{
                type: 'spring',
                stiffness: 220,
                damping: 18,
                mass: 0.8,
                delay: 0.05,
              }}
            >
              <div className="qr-corner tl" />
              <div className="qr-corner tr" />
              <div className="qr-corner bl" />
              <div className="qr-corner br" />
              <QRCodeSVG
                value={qrValue}
                size={240}
                bgColor="#ffffff"
                fgColor="#0a0e1a"
                level="M"
              />
            </motion.div>

            <ScreenshotWarning active={true} />

            <motion.div
              className="wallet-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="wallet-detail">
                <p className="detail-label">
                  {method === 'paypal' ? 'Email Address' : 'Account Number'}
                </p>
                <p className="detail-value">{selected.number}</p>
              </div>

              <div className="wallet-detail">
                <p className="detail-label">Account Name</p>
                <p className="detail-value">{selected.name}</p>
              </div>

              <div className="wallet-actions">
                <motion.button
                  className="copy-btn"
                  onClick={copyToClipboard}
                  whileTap={{ scale: 0.96 }}
                >
                  {copied ? (
                    <>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      Copied
                    </>
                  ) : (
                    <>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
                        <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                      </svg>
                      Copy
                    </>
                  )}
                </motion.button>

                <button className="secondary-btn" onClick={() => setMethod(null)}>
                  Change
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
