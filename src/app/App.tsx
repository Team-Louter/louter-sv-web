import { useEffect } from 'react';
import { ThemeProvider } from 'styled-components';
import { theme } from '@/styles/Theme';
import { GlobalStyle } from '@/styles/GlobalStyle';
import Router from './routes';
import Toast from '@/components/common/Toast/Toast';
import { useAuthStore } from '@/store/authStore';
import { requestFCMToken, onForegroundPushMessage, showNotification } from '@/firebase';
import { fcm } from '@/api/Fcm';

function App() {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const fetchUser = useAuthStore((state) => state.fetchUser);

  useEffect(() => {
    if (!isLoggedIn) return;

    fetchUser();

    const initFCM = async () => {
      try {
        const token = await requestFCMToken();
        if (token) {
          await fcm(token);
        }
      } catch (err) {
        console.error('FCM 토큰 발급 실패:', err);
      }
    };

    initFCM();

    const cleanup = onForegroundPushMessage((title, body) => {
      showNotification(title, body);
    });

    return () => cleanup();
  }, [isLoggedIn]);

  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <Router />
      <Toast />
    </ThemeProvider>
  );
}

export default App;