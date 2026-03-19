import { useEffect } from 'react';
import { ThemeProvider } from 'styled-components';
import { theme } from '@/styles/Theme';
import { GlobalStyle } from '@/styles/GlobalStyle';
import Router from './routes';
import Toast from '@/components/common/Toast/Toast';
import { useAuthStore } from '@/store/authStore';
import { requestFCMToken, onForegroundMessage, showNotification } from '@/firebase';
import { fcm } from '@/api/Fcm'; 

function App() {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const fetchUser = useAuthStore((state) => state.fetchUser);

  useEffect(() => {
    if (isLoggedIn) {
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

      onForegroundMessage((payload) => {
        const title = payload.notification?.title ?? '알림';
        const body = payload.notification?.body ?? '';
        showNotification(title, body);
      });
    }
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