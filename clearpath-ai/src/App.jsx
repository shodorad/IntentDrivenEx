import { useChat } from './context/ChatContext';
import Header from './components/Header/Header';
import LandingScreen from './components/LandingScreen/LandingScreen';
import ChatArea from './components/ChatArea/ChatArea';
import InputBar from './components/InputBar/InputBar';
import TrustBanner from './components/TrustBanner/TrustBanner';
import TransparencyPanel from './components/TransparencyPanel/TransparencyPanel';
import styles from './App.module.css';

function AppContent() {
  const { state } = useChat();

  return (
    <div className={styles.page}>
      <Header />
      <div className={styles.containerWrap}>
        <div className={styles.container}>
          {state.mode === 'landing' ? (
            <LandingScreen />
          ) : (
            <ChatArea />
          )}
          <InputBar />
        </div>
      </div>
      <TrustBanner />
      <TransparencyPanel />
    </div>
  );
}

export default function App() {
  return <AppContent />;
}
