import React from "react";
import * as Sentry from "@sentry/browser";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    console.log("Error Boundary caught error");
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.log("Error catcheddd");
    // You can also log the error to an error reporting service
    console.error(error, errorInfo);
    Sentry.captureException(error);
  }

  render() {
    if (this.state.hasError) {
      console.log("There was an error");
      // You can render any custom fallback UI
      return (
        <div className="w-screen h-screen bg-black shadow-md overflow-hidden flex flex-col items-center justify-center">
          <div className="text-white p-8 text-center">
            An error occured, try to restart Slingshow.
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
