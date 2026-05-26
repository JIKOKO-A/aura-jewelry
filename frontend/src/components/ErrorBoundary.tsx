"use client";

import React, { Component, ErrorInfo, ReactNode } from "react";
import { AlertOctagon, RotateCcw } from "lucide-react";

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export default class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error inside boundary:", error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.href = "/";
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-background px-6 text-center">
          <div className="max-w-md mx-auto">
            <div className="w-16 h-16 rounded-full bg-red-50 text-red-500 flex items-center justify-center mb-8 mx-auto">
              <AlertOctagon size={28} strokeWidth={1.5} />
            </div>
            <h1 className="font-serif text-3xl text-foreground mb-4">Something Went Wrong</h1>
            <p className="font-sans text-sm text-foreground/65 mb-8 leading-relaxed">
              We encountered an unexpected error while rendering this page. Our team has been notified.
            </p>
            <button
              onClick={this.handleReset}
              className="px-8 py-3.5 bg-foreground text-background font-sans text-xs uppercase tracking-widest hover:bg-foreground/90 transition-colors inline-flex items-center gap-2 rounded-sm"
            >
              <RotateCcw size={14} /> Return to Home
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
