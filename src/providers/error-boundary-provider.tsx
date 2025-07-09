"use client";

import React, { ReactNode } from "react";
import ErrorBoundary from "@/components/error-boundary/error-boundary";
import { toast } from "sonner";

interface ErrorBoundaryProviderProps {
  children: ReactNode;
}

export default function ErrorBoundaryProvider({ children }: ErrorBoundaryProviderProps) {
  const handleError = (error: Error, errorInfo: React.ErrorInfo) => {
    // Log error to console in development
    if (process.env.NODE_ENV === "development") {
      console.error("Global Error Boundary:", error, errorInfo);
    }

    // Show toast notification
    toast.error("Something went wrong", {
      description: "An unexpected error occurred. Please try refreshing the page.",
      duration: 5000,
    });

    // Here you could send error to external logging service
    // Example: Sentry, LogRocket, Bugsnag, etc.
    /*
    if (typeof window !== "undefined") {
      // Send to error reporting service
      errorReportingService.captureException(error, {
        contexts: {
          react: {
            componentStack: errorInfo.componentStack,
          },
        },
        tags: {
          section: "global_error_boundary",
        },
      });
    }
    */
  };

  return (
    <ErrorBoundary onError={handleError}>
      {children}
    </ErrorBoundary>
  );
}
