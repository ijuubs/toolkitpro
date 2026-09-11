import * as React from 'react';
import { useState, useEffect } from 'react';
import { AlertTriangle, RefreshCw, Home, X, ChevronDown, ChevronUp } from 'lucide-react';

interface ErrorDetails {
  message: string;
  source?: string;
  lineno?: number;
  colno?: number;
  stack?: string;
}

/**
 * Global Error Overlay that catches unhandled errors and promise rejections across the application.
 * Provides a user-friendly recovery UI with a prominent "Reload Page" button.
 */
export default function GlobalErrorOverlay() {
  const [errorDetails, setErrorDetails] = useState<ErrorDetails | null>(null);
  const [showTechnicalDetails, setShowTechnicalDetails] = useState<boolean>(false);

  useEffect(() => {
    // Handler for global JavaScript runtime errors
    const handleGlobalError = (event: ErrorEvent) => {
      const msg = event.message || '';
      const src = event.filename || '';

      // Avoid intercepting non-critical benign errors (e.g. cross-origin script error, standard browser extension, or benign resize observer)
      if (
        !msg ||
        msg.includes('ResizeObserver') ||
        msg.includes('websocket') ||
        msg.includes('Script error') ||
        msg.includes('adsbygoogle') ||
        msg.includes('googletagmanager') ||
        src.includes('googletagmanager') ||
        src.includes('googlesyndication') ||
        src.includes('google-analytics') ||
        src.includes('doubleclick') ||
        (!src && event.lineno === 0)
      ) {
        event.preventDefault();
        return;
      }

      console.error('[GlobalErrorOverlay] Caught uncaught error:', event.error || event.message);

      setErrorDetails({
        message: event.message || 'An unexpected error occurred in the application.',
        source: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        stack: event.error?.stack || ''
      });
    };

    // Handler for unhandled Promise rejections
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      const reason = event.reason;
      const message = typeof reason === 'string' 
        ? reason 
        : reason?.message || 'An unhandled asynchronous operation failed.';

      // Ignore benign vite websocket errors
      if (message.includes('websocket') || message.includes('ResizeObserver')) {
        return;
      }

      console.error('[GlobalErrorOverlay] Caught unhandled rejection:', reason);

      setErrorDetails({
        message,
        stack: reason?.stack || (typeof reason === 'object' ? JSON.stringify(reason, null, 2) : '')
      });
    };

    window.addEventListener('error', handleGlobalError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    return () => {
      window.removeEventListener('error', handleGlobalError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, []);

  if (!errorDetails) {
    return null;
  }

  const handleReload = () => {
    window.location.reload();
  };

  const handleGoHome = () => {
    window.location.href = '/';
  };

  const handleDismiss = () => {
    setErrorDetails(null);
  };

  return (
    <div
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="global-error-title"
      aria-describedby="global-error-description"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/75 backdrop-blur-xs animate-fadeIn"
    >
      <div className="w-full max-w-2xl bg-white dark:bg-[#181922] border-4 sm:border-8 border-black text-black dark:text-white shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] p-6 sm:p-8 space-y-6 relative max-h-[90vh] overflow-y-auto">
        {/* Dismiss / Close button */}
        <button
          onClick={handleDismiss}
          className="absolute top-4 right-4 p-1.5 border-2 border-black bg-yellow-300 text-black hover:bg-black hover:text-white transition-colors"
          title="Dismiss notice"
          aria-label="Close error overlay"
        >
          <X size={20} />
        </button>

        {/* Header with high contrast Alert badge */}
        <div className="flex items-start gap-4">
          <div className="p-3 bg-red-500 border-4 border-black text-white shrink-0 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <AlertTriangle size={32} className="stroke-[2.5]" />
          </div>
          <div className="space-y-1">
            <span className="inline-block bg-yellow-400 text-black text-xs font-black uppercase px-2 py-0.5 border border-black mb-1">
              Application Notice
            </span>
            <h2 id="global-error-title" className="text-2xl sm:text-3xl font-black uppercase tracking-tight leading-none">
              Unexpected Error
            </h2>
          </div>
        </div>

        {/* User-friendly message */}
        <div id="global-error-description" className="space-y-3 font-medium text-base sm:text-lg leading-relaxed text-neutral-800 dark:text-neutral-200">
          <p>
            An unexpected error occurred during execution. Your data is stored locally in your browser and has not been lost.
          </p>
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            Reloading the application will reinitialize the component state and clear temporary memory issues.
          </p>
        </div>

        {/* Primary Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <button
            onClick={handleReload}
            className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-yellow-400 text-black border-4 border-black font-black text-base uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all cursor-pointer"
          >
            <RefreshCw size={18} className="stroke-[2.5]" />
            Reload Page
          </button>

          <button
            onClick={handleGoHome}
            className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-white dark:bg-black text-black dark:text-white border-4 border-black font-black text-base uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all cursor-pointer"
          >
            <Home size={18} />
            Back to Dashboard
          </button>

          <button
            onClick={handleDismiss}
            className="inline-flex items-center justify-center px-4 py-3.5 bg-neutral-200 dark:bg-neutral-800 text-black dark:text-white border-4 border-black font-black text-sm uppercase hover:bg-neutral-300 dark:hover:bg-neutral-700 transition-colors cursor-pointer"
          >
            Try to Continue
          </button>
        </div>

        {/* Collapsible Technical Details for Debugging */}
        <div className="pt-2 border-t-2 border-black/30 dark:border-white/30">
          <button
            type="button"
            onClick={() => setShowTechnicalDetails(!showTechnicalDetails)}
            className="inline-flex items-center gap-2 text-xs font-black uppercase text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white underline cursor-pointer"
          >
            {showTechnicalDetails ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            {showTechnicalDetails ? 'Hide Error Details' : 'View Error Details'}
          </button>

          {showTechnicalDetails && (
            <div className="mt-3 p-4 bg-neutral-100 dark:bg-neutral-900 border-2 border-black text-xs font-mono overflow-x-auto space-y-2">
              <p className="font-bold text-red-600 dark:text-red-400 break-words">
                {errorDetails.message}
              </p>
              {errorDetails.source && (
                <p className="text-neutral-600 dark:text-neutral-400">
                  Location: {errorDetails.source}:{errorDetails.lineno}:{errorDetails.colno}
                </p>
              )}
              {errorDetails.stack && (
                <pre className="text-[11px] text-neutral-700 dark:text-neutral-300 whitespace-pre-wrap break-all mt-2 max-h-40 overflow-y-auto">
                  {errorDetails.stack}
                </pre>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
