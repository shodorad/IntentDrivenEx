import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { muiTheme } from './theme/muiTheme';
import { AnimatePresence, motion } from 'framer-motion';
import { useChat } from './context/ChatContext';
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
import styles from './App.module.css';

function AppContent() {
  const { state } = useChat();

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
