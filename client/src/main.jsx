import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import App from './App.jsx';
import './index.css';
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 5 * 60 * 1000,
      refetchOnWindowFocus: false,
    },
  },
});
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <App />
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#ffffff',
              color: '#161d17',
              borderRadius: '12px',
              border: '1px solid #bbcbbb',
              boxShadow: '0 4px 20px rgba(44, 62, 80, 0.1)',
              fontFamily: 'Inter, sans-serif',
            },
            success: { iconTheme: { primary: '#006d37', secondary: '#ffffff' } },
            error: { iconTheme: { primary: '#ba1a1a', secondary: '#ffffff' } },
          }}
        />
      </QueryClientProvider>
    </BrowserRouter>
  </StrictMode>
);
