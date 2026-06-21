import { Component, type ReactNode, type ErrorInfo } from 'react';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error('SpecFlow error:', error, info);
  }

  render(): ReactNode {
    if (this.state.hasError) {
      return (
        <div
          style={{
            padding: '48px',
            textAlign: 'center',
            fontFamily: "'DM Sans', Arial, sans-serif",
            color: '#0b1739',
          }}
        >
          <h2 style={{ fontSize: '22px', fontWeight: 700 }}>Something went wrong</h2>
          <p style={{ color: '#63708b', margin: '12px 0 24px' }}>
            An unexpected error occurred. Please reload the page.
          </p>
          <button
            onClick={() => window.location.reload()}
            style={{
              border: '1px solid #1254d9',
              background: '#1254d9',
              color: '#fff',
              borderRadius: '7px',
              padding: '10px 24px',
              fontSize: '14px',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Reload page
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
