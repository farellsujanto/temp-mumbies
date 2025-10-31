import { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle } from 'lucide-react';
import Button from './Button';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
    this.setState({
      error,
      errorInfo,
    });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-neutral-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl p-8 max-w-2xl w-full">
            <div className="flex items-center gap-4 mb-6">
              <div className="bg-red-100 p-3 rounded-full">
                <AlertTriangle className="w-8 h-8 text-red-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-neutral-900">
                  Something went wrong
                </h1>
                <p className="text-neutral-600 mt-1">
                  The application encountered an error and couldn't load properly.
                </p>
              </div>
            </div>

            {this.state.error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <p className="font-mono text-sm text-red-900 break-words">
                  {this.state.error.toString()}
                </p>
              </div>
            )}

            <div className="space-y-3">
              <p className="text-sm text-neutral-700">
                <strong>Possible causes:</strong>
              </p>
              <ul className="text-sm text-neutral-600 space-y-2 list-disc list-inside">
                <li>Missing environment variables (check Vercel settings)</li>
                <li>Network connectivity issues</li>
                <li>Configuration problems</li>
              </ul>
            </div>

            <div className="mt-6 flex gap-3">
              <Button
                onClick={() => window.location.reload()}
                className="flex-1"
              >
                Reload Page
              </Button>
              <Button
                onClick={() => this.setState({ hasError: false, error: null, errorInfo: null })}
                variant="outline"
                className="flex-1"
              >
                Try Again
              </Button>
            </div>

            {process.env.NODE_ENV === 'development' && this.state.errorInfo && (
              <details className="mt-6">
                <summary className="cursor-pointer text-sm font-medium text-neutral-700 hover:text-neutral-900">
                  Stack Trace (Development Only)
                </summary>
                <pre className="mt-2 p-4 bg-neutral-100 rounded-lg text-xs overflow-auto">
                  {this.state.errorInfo.componentStack}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
