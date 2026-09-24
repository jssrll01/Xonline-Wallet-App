import { useEffect, useState } from 'react';
import './ScreenshotWarning.css';

export default function ScreenshotWarning({ active }) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (!active) return;
    const onKey = (e) => {
      // PrintScreen on Windows
      if (e.key === 'PrintScreen') {
        setShow(true);
        setTimeout(() => setShow(false), 3200);
      }
      // Cmd/Ctrl + Shift + 3/4/5 on Mac
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && ['3', '4', '5', '$', '#', '%'].includes(e.key)) {
        setShow(true);
        setTimeout(() => setShow(false), 3200);
      }
    };
    // Blur screen when tab loses focus while QR is visible (anti-share heuristic)
    window.addEventListener('keyup', onKey);
    return () => window.removeEventListener('keyup', onKey);
  }, [active]);

  if (!active) return null;

  return (
    <>
      <div className="screenshot-hint" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          <line x1="12" y1="9" x2="12" y2="13" />
          <line x1="12" y1="17" x2="12.01" y2="17" />
        </svg>
        <span>Screenshots may expose your account info</span>
      </div>

      {show && (
        <div className="screenshot-toast">
          <span className="screenshot-icon">⚠</span>
          <span>Screenshot detected — protect your info</span>
        </div>
      )}
    </>
  );
}
