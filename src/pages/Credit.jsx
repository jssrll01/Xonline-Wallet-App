import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
  gcash: {
    label: 'GCash',
    number: '0945 440 8496',
    name: 'JESSRELL C.',
    tag: 'E-Wallet',
    qr: 'https://res.cloudinary.com/bvw3okdf/image/upload/v1790593677/GCash-MyQR-28092026184016.PNG.jpg',
  },
  maya: {
    label: 'Maya',
    number: '0945 440 8496',
    name: 'JESSRELL CUSTODIO',
    tag: 'E-Wallet',
    qr: 'https://res.cloudinary.com/bvw3okdf/image/upload/v1790593882/myqr_1790592093301.jpg',
  },
  paypal: {
    label: 'PayPal',
    number: 'custodiojessrell07@gmail.com',
    name: 'Jessrell Custodio',
    tag: 'E-Wallet',
    qr: 'https://res.cloudinary.com/bvw3okdf/image/upload/v1790594249/paypal_qr_1790592320029.png',
  },
  gotyme: {
    label: 'GoTyme',
    number: '015249157462',
    name: 'JESSRELL C.',
    tag: 'Bank',
    qr: 'https://res.cloudinary.com/bvw3okdf/image/upload/v1790592841/Screenshot_20260928_183617_GoTyme_PH.jpg',
  },
  bpi: {
    label: 'BPI',
    number: '4069841679',
    name: 'JESSRELL C.',
    tag: 'Bank',
    qr: 'https://res.cloudinary.com/bvw3okdf/image/upload/v1790594150/BPIQR_Jessrell.png',
  },
};

const WALLET_ID = 'XN-1010-0707-1007';
const MEMBER_SINCE = 'OCTOBER 2026';

/* ---------- QR component with skeleton loading ---------- */

function QRWithSkeleton({ src, alt }) {
  const [loaded, setLoaded] = useState(false);
  const [errored, setErrored] = useState(false);

  return (
    <div className="qr-image-wrap">
      {!loaded && !errored && (
        <div className="qr-skeleton" aria-hidden="true">
          <div className="qr-skeleton-shimmer" />
          <div className="qr-skeleton-grid">
            {Array.from({ length: 25 }).map((_, i) => (
              <span key={i} className="qr-skeleton-cell" />
            ))}
          </div>
        </div>
      )}

      {errored ? (
        <div className="qr-error">Failed to load QR</div>
      ) : (
        <img
          src={src}
          alt={alt}
          className={`qr-image ${loaded ? 'loaded' : ''}`}
          onLoad={() => setLoaded(true)}
          onError={() => setErrored(true)}
          loading="eager"
          decoding="async"
          draggable={false}
        />
      )}
    </div>
  );
}

export default function Credit() {
  const [type, setType] = useState('ewallet');
  const [method, setMethod] = useState(null);
  const [copied, setCopied] = useState(false);

  const selected = method ? WALLET_INFO[method] : null;

  // Preload all QR images on mount → instant swap when opening
  useEffect(() => {
    Object.values(WALLET_INFO).forEach((m) => {
      const img = new Image();
      img.src = m.qr;
    });
  }, []);

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
            initial={{ opacity: 0, y: 20, filter: 'blur(4px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: -20, filter: 'blur(4px)' }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
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
                <div className="wallet-status">
                  <span className="wallet-status-dot" />
                  <span>Active</span>
                </div>
              </div>

              <div className="wallet-hero-mid">
                <p className="wallet-label">Xonline Wallet</p>
                <p className="wallet-number">•••• •••• •••• 1007</p>
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
                    <span className="method-tag">
                      {WALLET_INFO[m.id].tag}
                    </span>
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
            initial={{ opacity: 0, y: 16, filter: 'blur(4px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: -16, filter: 'blur(4px)' }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          >
            <motion.div
              className="selected-brand"
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            >
              <span className="selected-tag">{selected.tag}</span>
              <h2 className="selected-label">{selected.label}</h2>
            </motion.div>

            {/* QR with skeleton + corners */}
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
              <div className="qr-corner tl"><span /></div>
              <div className="qr-corner tr"><span /></div>
              <div className="qr-corner bl"><span /></div>
              <div className="qr-corner br"><span /></div>

              <QRWithSkeleton src={selected.qr} alt={`${selected.label} QR`} />
            </motion.div>

            <motion.p
              className="qr-hint"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.35, duration: 0.5 }}
            >
              Scan with {selected.label} app
            </motion.p>

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
