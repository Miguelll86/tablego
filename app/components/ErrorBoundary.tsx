'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    // In produzione, invia l'errore a un servizio di monitoring
    if (process.env.NODE_ENV === 'production') {
      // TODO: Implementare invio a servizio di monitoring
      console.error('Production error:', { error, errorInfo });
    }
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center">
          <div className="text-center max-w-md mx-auto p-8 bg-white/80 backdrop-blur-md rounded-2xl shadow-xl border border-gray-100 dark:bg-slate-800/80 dark:border-slate-700">
            <div className="text-red-500 text-6xl mb-4">⚠️</div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              Ops! Qualcosa è andato storto
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Si è verificato un errore inaspettato. Riprova a ricaricare la pagina.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-3 rounded-full font-bold shadow-md hover:from-orange-600 hover:to-orange-700 transition-all"
            >
              Ricarica Pagina
            </button>
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="mt-4 text-left">
                <summary className="cursor-pointer text-sm text-gray-500">
                  Dettagli errore (solo sviluppo)
                </summary>
                <pre className="mt-2 text-xs bg-gray-100 dark:bg-slate-700 p-2 rounded overflow-auto">
                  {this.state.error.toString()}
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