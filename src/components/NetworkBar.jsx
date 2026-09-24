import { useEffect, useState } from 'react';
import './NetworkBar.css';

export default function NetworkBar() {
  const [online, setOnline] = useState(navigator.onLine);
  const [showBack, setShowBack] = useState(false);

  useEffect(() => {
    const onOnline = () => {
      setOnline(true);
      setShowBack(true);
      setTimeout(() => setShowBack(false), 1800);
    };
    const onOffline = () => setOnline(false);

    window.addEventListener('online', onOnline);
    window.addEventListener('offline', onOffline);
    return () => {
      window.removeEventListener('online', onOnline);
      window.removeEventListener('offline', onOffline);
    };
  }, []);

  if (online && !showBack) return null;

  return (
    <div className={`net-bar ${online ? 'net-back' : 'net-off'}`}>
      <span className="net-dot" />
      <span>{online ? 'Back online' : "You're offline"}</span>
    </div>
  );
}
