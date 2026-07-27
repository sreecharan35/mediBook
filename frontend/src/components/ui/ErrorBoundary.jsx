import React from 'react';
import { AlertTriangle, RefreshCcw } from 'lucide-react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    // Future integration: send error to Sentry, LogRocket, etc.
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          minHeight: '100vh', padding: '2rem', textAlign: 'center', background: 'var(--bg-primary)'
        }}>
          <div style={{ 
            background: 'rgba(239, 68, 68, 0.1)', padding: '1.5rem', borderRadius: '50%', marginBottom: '1.5rem', color: '#ef4444' 
          }}>
            <AlertTriangle size={48} />
          </div>
          <h1 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.5rem' }}>
            Something went wrong
          </h1>
          <p style={{ color: 'var(--text-muted)', maxWidth: '400px', marginBottom: '2rem' }}>
            A critical UI error occurred. We've logged the issue. Please try refreshing the page to continue.
          </p>
          <button 
            className="btn btn-primary"
            onClick={() => window.location.reload()}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <RefreshCcw size={16} /> Reload Page
          </button>

          {/* Show stack trace in development */}
          {import.meta.env.DEV && (
            <div style={{ marginTop: '3rem', textAlign: 'left', background: 'var(--bg-secondary)', padding: '1rem', borderRadius: '8px', overflowX: 'auto', maxWidth: '800px', width: '100%', fontSize: '0.85rem', color: '#ef4444' }}>
              <pre>{this.state.error?.stack}</pre>
            </div>
          )}
        </div>
      );
    }

    return this.props.children; 
  }
}

export default ErrorBoundary;
