import { useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import ConfirmModal from './ConfirmModal.jsx';
import './Navbar.css';

export default function Navbar() {
  const { logout } = useAuth();
  const [confirming, setConfirming] = useState(false);

  const handleConfirmLogout = () => {
    setConfirming(false);
    logout();
  };

  return (
    <>
      <nav className="navbar">
        <div className="navbar-brand">
          <span className="brand-x">X</span>online
        </div>
        <button className="logout-btn" onClick={() => setConfirming(true)} title="Logout">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
          <span>Logout</span>
        </button>
      </nav>

      <ConfirmModal
        open={confirming}
        title="Log out of Xonline?"
        message="You'll need to enter your access code again to continue."
        confirmLabel="Log out"
        cancelLabel="Stay"
        variant="danger"
        onConfirm={handleConfirmLogout}
        onCancel={() => setConfirming(false)}
      />
    </>
  );
}
