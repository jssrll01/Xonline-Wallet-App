import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { AuthProvider, useAuth } from './context/AuthContext.jsx';
import CosmicBackground from './components/CosmicBackground.jsx';
import NetworkBar from './components/NetworkBar.jsx';
import ScrollToTop from './components/ScrollToTop.jsx';
import Navbar from './components/Navbar.jsx';
import Login from './pages/Login.jsx';
import Credit from './pages/Credit.jsx';

const pageVariants = {
  initial: { opacity: 0, y: 24, scale: 0.985, filter: 'blur(6px)' },
  animate: { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' },
  exit: { opacity: 0, y: -18, scale: 0.985, filter: 'blur(6px)' },
};

const pageTransition = { duration: 0.5, ease: [0.22, 1, 0.36, 1] };

function PageWrapper({ children }) {
  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={pageTransition}
      style={{ willChange: 'transform, opacity, filter' }}
    >
      {children}
    </motion.div>
  );
}

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageWrapper><Credit /></PageWrapper>} />
        <Route path="/credit" element={<PageWrapper><Credit /></PageWrapper>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AnimatePresence>
  );
}

function ProtectedShell() {
  const { isAuthed, loading } = useAuth();
  const location = useLocation();

  if (loading) return null;

  if (!isAuthed) {
    return (
      <AnimatePresence mode="wait">
        <motion.div
          key={`login-${location.pathname}`}
          variants={pageVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={pageTransition}
        >
          <Login />
        </motion.div>
      </AnimatePresence>
    );
  }

  return (
    <>
      <Navbar />
      <ScrollToTop />
      <AnimatedRoutes />
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <CosmicBackground />
        <NetworkBar />
        <ProtectedShell />
      </BrowserRouter>
    </AuthProvider>
  );
}
