import React from 'react';
import { AlertCircle, RefreshCcw, Home } from 'lucide-react';
import Button from './Button';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[400px] flex flex-col items-center justify-center p-8 text-center bg-white dark:bg-slate-900 rounded-[2rem] border border-border dark:border-slate-800 shadow-xl">
          <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-2xl flex items-center justify-center mb-6">
            <AlertCircle size={32} />
          </div>
          <h2 className="text-2xl font-serif text-text-primary dark:text-white mb-3">Something went wrong</h2>
          <p className="text-text-secondary dark:text-gray-400 mb-8 max-w-md mx-auto">
            The dashboard encountered an unexpected error. This might be due to a temporary connection issue or a rendering conflict.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Button 
              variant="primary" 
              icon={RefreshCcw}
              onClick={() => window.location.reload()}
            >
              Reload Dashboard
            </Button>
            <Button 
              variant="outline" 
              icon={Home}
              onClick={() => window.location.href = '/'}
            >
              Back to Home
            </Button>
          </div>
          {process.env.NODE_ENV === 'development' && (
            <div className="mt-8 p-4 bg-gray-50 dark:bg-black/20 rounded-xl text-left overflow-auto max-w-full">
              <p className="text-[10px] font-mono text-red-500">{this.state.error?.toString()}</p>
            </div>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
