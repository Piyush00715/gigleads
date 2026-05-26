import { useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { useAuthStore } from './store/authStore';
import { useThemeStore } from './store/themeStore';
import { AppRoutes } from './routes';
import { api } from './services/api';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
    },
  },
});

export default function App() {
  const { login, logout, setInitializing } = useAuthStore();
  const { initializeTheme } = useThemeStore();

  useEffect(() => {
    // Sync UI with stored or system theme preferences
    initializeTheme();

    // Verify if active session exists on load
    const verifySession = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        logout();
        return;
      }
      try {
        const response = await api.get('/auth/me');
        login(response.data.data.user, token);
      } catch (err) {
        logout();
      } finally {
        setInitializing(false);
      }
    };

    verifySession();
  }, [login, logout, setInitializing, initializeTheme]);

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AppRoutes />
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#0f172a',
              color: '#fff',
              borderRadius: '12px',
              fontSize: '13px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
            },
            success: {
              iconTheme: {
                primary: '#10b981',
                secondary: '#fff',
              },
            },
          }}
        />
      </BrowserRouter>
    </QueryClientProvider>
  );
}
