import { HashRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "next-themes";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { Toaster } from "sonner";
import { configureAmplify } from "./lib/auth/configureAmplify";
import { OpsLayout } from "./ops/OpsLayout.tsx";
import { OpsDashboard } from "./ops/OpsDashboard.tsx";
import { OpsTenantsPage } from "./ops/OpsTenantsPage.tsx";
import { OpsHealthPage } from "./ops/OpsHealthPage.tsx";
import { OpsBeansPage } from "./ops/OpsBeansPage.tsx";
import "./index.css";

configureAmplify();

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: true,
    },
  },
});

function OpsAppContent() {
  return (
    <Routes>
      <Route element={<OpsLayout />}>
        <Route path="/" element={<OpsDashboard />} />
        <Route path="/tenants" element={<OpsTenantsPage />} />
        <Route path="/health" element={<OpsHealthPage />} />
        <Route path="/beans" element={<OpsBeansPage />} />
      </Route>
    </Routes>
  );
}

export function OpsApp() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          storageKey="{{cookiecutter.project_slug}}-ops-ui-theme"
        >
          <Router>
            <OpsAppContent />
            <Toaster />
          </Router>
        </ThemeProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}
