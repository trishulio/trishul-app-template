import React, { Component } from "react";
import type { ReactNode } from "react";
import { toast } from "sonner";

interface Props {
  children?: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);

    // Display error toast
    toast.error(`An error occurred: ${error.message}`, {
      description: "Please try again or contact support if the issue persists.",
      duration: 5000,
    });

    // Reset error state after showing toast
    setTimeout(() => {
      this.setState({ hasError: false });
    }, 100);
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
              <h2 className="text-xl font-semibold mb-2">
                Something went wrong
              </h2>
              <p className="text-gray-600">
                Please refresh the page to continue.
              </p>
            </div>
          </div>
        )
      );
    }

    return this.props.children;
  }
}
