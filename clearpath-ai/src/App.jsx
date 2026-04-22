import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { muiTheme } from './theme/muiTheme';
import { AnimatePresence, motion } from 'framer-motion';
import { useChat } from './context/ChatContext';
import { useEffect, useState } from 'react';
import Header from './components/Header/Header';
import LandingScreen from './components/LandingScreen/LandingScreen';
import ChatArea from './components/ChatArea/ChatArea';
import InputBar from './components/InputBar/InputBar';
import TrustBanner from './components/TrustBanner/TrustBanner';
import TransparencyPanel from './components/TransparencyPanel/TransparencyPanel';
import IPhoneSMSModal from './components/IPhoneSMSModal/IPhoneSMSModal';
import FloatingShapes from './components/FloatingShapes/FloatingShapes';
import PasswordGate from './components/PasswordGate/PasswordGate';
import PillOverlay from './components/PillOverlay/PillOverlay';
import AdminPanel from './components/AdminPanel/AdminPanel';
import { initializeProductData } from './data/products';
import { initializePersonaData, initializeIntentMapData, getPersonaFromURL } from './data/personas';
import styles from './App.module.css';

function AppContent() {
  const { state, dispatch } = useChat();
  const [dataLoaded, setDataLoaded] = useState(false);

  useEffect(() => {
    Promise.all([
      initializeProductData(),
      initializePersonaData(),
      initializeIntentMapData(),
    ]).then(() => {
      const persona = getPersonaFromURL();
      if (persona) dispatch({ type: 'SET_PERSONA_AFTER_LOAD', payload: persona });
      setDataLoaded(true);
    }).catch(() => {
      // Static fallbacks already in place — proceed normally
      setDataLoaded(true);
    });
  }, []);

  if (!dataLoaded) {
    return (
      <div className={styles.page} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: 40, height: 40, margin: '0 auto 16px',
            border: '3px solid #00B5AD', borderTopColor: 'transparent',
            borderRadius: '50%', animation: 'spin 0.8s linear infinite',
          }} />
          <div style={{ color: '#6B7280', fontSize: '0.95rem' }}>Loading ClearPath AI…</div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <FloatingShapes />
      <Header />
      <div className={styles.containerWrap}>
        <div className={styles.container}>
          <AnimatePresence mode="wait">
            {state.mode === 'landing' ? (
              <motion.div
                key="landing"
                initial={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -48 }}
                transition={{ duration: 0.35, ease: 'easeIn' }}
                style={{ display: 'contents' }}
              >
                <LandingScreen />
              </motion.div>
            ) : (
              <motion.div
                key="chat"
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
                style={{ display: 'contents' }}
              >
                <ChatArea />
              </motion.div>
            )}
          </AnimatePresence>
          <PillOverlay />
          <InputBar />
        </div>
      </div>
      <TrustBanner />
      <TransparencyPanel />
      <IPhoneSMSModal />
      <AdminPanel />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider theme={muiTheme}>
      <CssBaseline />
      <PasswordGate>
        <AppContent />
      </PasswordGate>
    </ThemeProvider>
  );
}
