import React from 'react';

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #0C53ED 0%, #2A869E 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2rem',
          fontFamily: 'system-ui, -apple-system, sans-serif'
        }}>
          <div style={{
            background: 'white',
            padding: '2rem',
            borderRadius: '1rem',
            textAlign: 'center',
            maxWidth: '500px',
            boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
          }}>
            <h1 style={{ color: '#0C53ED', marginBottom: '1rem' }}>
              Shalean Cleaning Services
            </h1>
            <p style={{ color: '#666', marginBottom: '1rem' }}>
              We're experiencing a technical issue. Please refresh the page.
            </p>
            <button 
              onClick={() => window.location.reload()}
              style={{
                background: '#0C53ED',
                color: 'white',
                border: 'none',
                padding: '0.75rem 1.5rem',
                borderRadius: '50px',
                cursor: 'pointer',
                fontSize: '1rem'
              }}
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
