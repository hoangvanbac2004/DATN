'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught Error in ErrorBoundary:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: undefined });
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-[#090d16] p-6 text-white text-center">
          <div className="w-full max-w-md space-y-6 rounded-3xl border border-red-500/20 bg-gray-900/80 p-8 backdrop-blur-xl shadow-2xl">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-red-500/10 text-red-400 border border-red-500/20 shadow-lg">
              <AlertTriangle className="h-8 w-8" />
            </div>

            <div className="space-y-2">
              <h2 className="text-xl font-bold font-heading text-white">Something went wrong</h2>
              <p className="text-xs text-gray-400">
                An unexpected application error occurred. Don&apos;t worry, your work is saved.
              </p>
              {this.state.error?.message && (
                <div className="mt-2 rounded-xl bg-gray-950/60 p-3 text-[11px] font-mono text-red-400 border border-white/5 break-words">
                  {this.state.error.message}
                </div>
              )}
            </div>

            <button
              onClick={this.handleReset}
              className="flex w-full items-center justify-center space-x-2 rounded-xl bg-indigo-600 py-3 text-xs font-semibold text-white shadow-lg transition hover:bg-indigo-500 active:scale-[0.98]"
            >
              <RefreshCw className="h-4 w-4" />
              <span>Try Again</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
