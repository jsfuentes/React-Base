import * as Sentry from "@sentry/react";
import React, { ErrorInfo } from "react";
import Button from "src/components/Button";

interface ErrorBoundaryProps {
  full?: boolean;
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  full: boolean;
}

export default class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, full: Boolean(props.full) };
  }

  static getDerivedStateFromError(error: Error) {
    console.log("Error Boundary caught error");
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.log("Error catcheddd");
    // You can also log the error to an error reporting service
    console.error(errorInfo, error);
    Sentry.captureException(error, { extra: { errorInfo } });
  }

  //https://www.fastly.com/blog/clearing-cache-browser
  render() {
    if (this.state.hasError) {
      console.log("There was an error");
      // You can render any custom fallback UI
      const cls = this.state.full ? "w-full h-full" : "w-screen h-screen";
      return (
        <div
          className={`${cls} bg-black shadow-md overflow-hidden flex flex-col items-center justify-center`}
        >
          <div className="text-white p-8 text-center">
            An error occured, try hard refreshing the page.
          </div>
          <Button variant="secondary" onClick={() => window.location.reload()}>
            Reload Page
          </Button>
        </div>
      );
    }

    return <>{this.props.children}</>;
  }
}
