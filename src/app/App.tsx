import { useEffect } from 'react';
import { ThemeProvider } from 'styled-components';
import { theme } from '@/styles/Theme';
import { GlobalStyle } from '@/styles/GlobalStyle';
import Router from './routes';
import Toast from '@/components/common/Toast/Toast';
import { useAuthStore } from '@/store/authStore';

function App() {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const fetchUser = useAuthStore((state) => state.fetchUser);

  useEffect(() => {
    if (isLoggedIn) {
      fetchUser();
    }
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <Router />
      <Toast />
    </ThemeProvider>
  );
}

export default App;