import { Component, ReactNode } from "react";
import { ErrorBoundaryUI } from "./ErrorBoundaryUI";

/**
 * ErrorBoundary pour capturer les erreurs de rendu des composants enfants.
 */
class ErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean; error: any }> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: any) {
    return { hasError: true, error };
  }

  componentDidCatch(error: any, errorInfo: any) {
    // Log professionnel
    console.error('Erreur capturée par ErrorBoundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <ErrorBoundaryUI error={this.state.error} stack={this.state.error?.stack} />;
    }
    return this.props.children;
  }
}
export default ErrorBoundary;