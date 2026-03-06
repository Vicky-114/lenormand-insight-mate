import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";

const base = import.meta.env.BASE_URL;

class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { error: unknown }
> {
  state = { error: null as unknown };

  static getDerivedStateFromError(error: unknown) {
    return { error };
  }

  componentDidCatch(error: unknown, info: unknown) {
    console.error("App crashed:", error, info);
  }

  render() {
    if (this.state.error) {
      const msg =
        this.state.error instanceof Error
          ? this.state.error.message
          : String(this.state.error);

      return (
        <div style={{ padding: 16, fontFamily: "system-ui" }}>
          <h1>App crashed</h1>
          <pre style={{ whiteSpace: "pre-wrap" }}>{msg}</pre>
          <p>Open DevTools Console for details.</p>
        </div>
      );
    }
    return this.props.children;
  }
}

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter basename={base}>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </BrowserRouter>
  </React.StrictMode>
);
