import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import App from './App';
import store from './store';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { injectStore } from './api/axios';
import './index.css';

// Inject store into axios instance to avoid circular dependencies
injectStore(store);

// Configure QueryClient
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

// Initialize Theme
const savedTheme = localStorage.getItem('theme') || 'light';
if (savedTheme === 'dark') {
  document.documentElement.classList.add('dark');
} else {
  document.documentElement.classList.remove('dark');
}

import { ErrorBoundary } from 'react-error-boundary';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
          <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
            <ErrorBoundary fallback={<div>Something went wrong. Please refresh.</div>}>
              <App />
            </ErrorBoundary>
          </BrowserRouter>
        </GoogleOAuthProvider>
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 4000,
            className: 'dark:bg-gray-900 dark:text-white dark:border-gray-800 border border-gray-100 rounded-[12px] font-bold text-sm shadow-xl',
          }}
        />
      </QueryClientProvider>
    </Provider>
  </React.StrictMode>
);
