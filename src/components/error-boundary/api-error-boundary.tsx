"use client";

import React from "react";
import { Button, Card, CardBody } from "@nextui-org/react";
import { AlertCircle, RefreshCw, Wifi, WifiOff } from "lucide-react";

interface ApiErrorBoundaryProps {
  error?: Error | null;
  isLoading?: boolean;
  onRetry?: () => void;
  children: React.ReactNode;
  fallbackMessage?: string;
}

export default function ApiErrorBoundary({
  error,
  isLoading,
  onRetry,
  children,
  fallbackMessage = "Failed to load data",
}: ApiErrorBoundaryProps) {
  // Show loading state
  if (isLoading) {
    return children;
  }

  // Show error state
  if (error) {
    return <ApiErrorFallback error={error} onRetry={onRetry} message={fallbackMessage} />;
  }

  // Show children if no error
  return <>{children}</>;
}

interface ApiErrorFallbackProps {
  error: Error;
  onRetry?: () => void;
  message: string;
}

function ApiErrorFallback({ error, onRetry, message }: ApiErrorFallbackProps) {
  const isNetworkError = error.message.includes("Network Error") || 
                        error.message.includes("fetch") ||
                        error.message.includes("ERR_NETWORK");

  const isTimeoutError = error.message.includes("timeout") ||
                        error.message.includes("ETIMEDOUT");

  const is401Error = error.message.includes("401") ||
                    error.message.includes("Unauthorized");

  const is403Error = error.message.includes("403") ||
                    error.message.includes("Forbidden");

  const is500Error = error.message.includes("500") ||
                    error.message.includes("Internal Server Error");

  let errorTitle = "API Error";
  let errorDescription = message;
  let icon = <AlertCircle className="h-12 w-12 text-danger" />;

  if (isNetworkError) {
    errorTitle = "Connection Error";
    errorDescription = "Unable to connect to the server. Please check your internet connection.";
    icon = <WifiOff className="h-12 w-12 text-danger" />;
  } else if (isTimeoutError) {
    errorTitle = "Request Timeout";
    errorDescription = "The request took too long to complete. Please try again.";
    icon = <AlertCircle className="h-12 w-12 text-warning" />;
  } else if (is401Error) {
    errorTitle = "Authentication Required";
    errorDescription = "Your session has expired. Please sign in again.";
    icon = <AlertCircle className="h-12 w-12 text-warning" />;
  } else if (is403Error) {
    errorTitle = "Access Denied";
    errorDescription = "You don't have permission to access this resource.";
    icon = <AlertCircle className="h-12 w-12 text-danger" />;
  } else if (is500Error) {
    errorTitle = "Server Error";
    errorDescription = "Something went wrong on our end. Please try again later.";
    icon = <AlertCircle className="h-12 w-12 text-danger" />;
  }

  return (
    <div className="flex min-h-[200px] items-center justify-center p-4">
      <Card className="w-full max-w-sm">
        <CardBody className="text-center">
          <div className="mb-4 flex justify-center">
            {icon}
          </div>
          
          <h3 className="mb-2 text-lg font-semibold text-foreground">
            {errorTitle}
          </h3>
          
          <p className="mb-4 text-sm text-muted-foreground">
            {errorDescription}
          </p>

          {process.env.NODE_ENV === "development" && (
            <details className="mb-4 rounded-lg bg-danger-50 p-2 text-left text-xs dark:bg-danger-900/20">
              <summary className="cursor-pointer font-medium text-danger">
                Debug Info
              </summary>
              <pre className="mt-2 whitespace-pre-wrap text-danger">
                {error.message}
              </pre>
            </details>
          )}

          {onRetry && (
            <Button
              color="primary"
              variant="solid"
              startContent={<RefreshCw className="h-4 w-4" />}
              onClick={onRetry}
              size="sm"
            >
              Try Again
            </Button>
          )}

          {is401Error && (
            <Button
              color="warning"
              variant="solid"
              onClick={() => window.location.href = "/"}
              size="sm"
              className="mt-2"
            >
              Sign In
            </Button>
          )}
        </CardBody>
      </Card>
    </div>
  );
}
