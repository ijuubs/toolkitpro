import * as React from 'react';
import { AlertTriangle, RefreshCw, RotateCcw } from 'lucide-react';

interface Props {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  onReset?: () => void;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export default class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('[ErrorBoundary] Caught component error:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: undefined });
    if (this.props.onReset) {
      this.props.onReset();
    }
  };

  private handleReload = () => {
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="p-6 sm:p-8 border-4 sm:border-8 border-black bg-white dark:bg-[#181922] text-black dark:text-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] space-y-6">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-red-500 border-4 border-black text-white shrink-0 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <AlertTriangle size={28} className="stroke-[2.5]" />
            </div>
            <div className="space-y-1">
              <span className="inline-block bg-yellow-400 text-black text-xs font-black uppercase px-2 py-0.5 border border-black">
                Component Snag
              </span>
              <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight">
                Unable to Load Tool Component
              </h2>
            </div>
          </div>

          <p className="font-medium text-base text-neutral-800 dark:text-neutral-200 leading-relaxed">
            An unexpected error occurred while rendering this interface. Your local session and data remain safe.
          </p>

          <div className="flex flex-wrap gap-3 pt-2">
            <button 
              onClick={this.handleReload}
              className="inline-flex items-center gap-2 px-6 py-3 bg-yellow-400 text-black font-black text-sm uppercase border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all cursor-pointer"
            >
              <RefreshCw size={16} className="stroke-[2.5]" />
              Reload Page
            </button>
            <button 
              onClick={this.handleReset}
              className="inline-flex items-center gap-2 px-6 py-3 bg-white dark:bg-black text-black dark:text-white font-black text-sm uppercase border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all cursor-pointer"
            >
              <RotateCcw size={16} />
              Try Again
            </button>
          </div>

          {this.state.error && (
            <div className="pt-2 border-t-2 border-black/20 dark:border-white/20">
              <details className="cursor-pointer">
                <summary className="text-xs font-bold uppercase text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white">
                  Technical Details
                </summary>
                <pre className="mt-2 p-3 bg-neutral-100 dark:bg-neutral-900 border-2 border-black text-xs font-mono text-red-600 dark:text-red-400 overflow-x-auto">
                  {this.state.error.toString()}
                </pre>
              </details>
            </div>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}

