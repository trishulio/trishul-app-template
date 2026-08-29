import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider, focusManager } from "@tanstack/react-query";
import { ThemeProvider } from "next-themes";
import { ErrorBoundary } from "./components/ErrorBoundary";
import "./index.css";
import { Toaster } from "sonner";
import * as Sentry from "@sentry/react";

focusManager.setEventListener((handleFocus) => {
  if (typeof window !== "undefined" && window.addEventListener) {
    window.addEventListener("visibilitychange", () => {
      handleFocus(document.visibilityState === "visible");
    }, false);

    window.addEventListener("focus", () => handleFocus(true), false);
    return () => {
      window.removeEventListener("visibilitychange", () => handleFocus(true));
      window.removeEventListener("focus", () => handleFocus(true));
    };
  }
});

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: true,
    },
  },
});

function AppContent() {
  return (
    <Routes>
      <Route path="/" element={<p>Home</p>} />
    </Routes>
  );
}

function App() {
  return (
    <Sentry.ErrorBoundary fallback={<ErrorBoundary />}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          storageKey="{{ cookiecutter.project_slug }}-ui-theme"
        >
          <Router>
            <AppContent />
            <Toaster />
          </Router>
        </ThemeProvider>
      </QueryClientProvider>
    </Sentry.ErrorBoundary>
  );
}

export default App;
