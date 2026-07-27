import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import ErrorBoundary from '../../components/ui/ErrorBoundary';
// If ThemeProvider or AuthProvider were moved, update imports here
// They are still in src/context/ for now
import { ThemeProvider } from '../../context/ThemeContext';
import { AuthProvider } from '../../context/AuthContext';

/**
 * Global AppProvider wrapper
 * Combines all global contexts (Auth, Theme, Router, Toaster, ErrorBoundary)
 * to keep main.jsx clean and scalable.
 */
export const AppProvider = ({ children }) => {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <AuthProvider>
          <BrowserRouter>
            {children}
            {/* Global Toast Configuration */}
            <Toaster
              position="top-right"
              toastOptions={{
                className: 'toast-override',
                style: {
                  background: 'var(--bg-secondary)',
                  color: 'var(--text-primary)',
                  borderRadius: '12px',
                  boxShadow: '0 8px 30px rgba(0,0,0,0.08)',
                  padding: '16px',
                  fontFamily: 'Inter, sans-serif'
                },
                success: {
                  iconTheme: { primary: '#10b981', secondary: '#fff' }
                },
                error: {
                  iconTheme: { primary: '#ef4444', secondary: '#fff' }
                }
              }}
            />
          </BrowserRouter>
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
};
