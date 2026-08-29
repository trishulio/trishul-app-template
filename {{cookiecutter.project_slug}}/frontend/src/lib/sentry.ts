import * as Sentry from "@sentry/react";

const SENTRY_DSN = import.meta.env.VITE_SENTRY_DSN as string | undefined;

let initialized = false;

/**
 * Initialize Sentry for error tracking.
 * No-op if VITE_SENTRY_DSN is not set (safe to ship without config).
 */
export function initSentry() {
  if (initialized || !SENTRY_DSN) return;

  Sentry.init({
    dsn: SENTRY_DSN,
    environment: (import.meta.env.VITE_APP_ENV as string) || "production",
    tracesSampleRate: 0.1,
    sendDefaultPii: false,
    integrations: [
      Sentry.browserTracingIntegration(),
      Sentry.replayIntegration({
        maskAllText: true,
        blockAllMedia: true,
      }),
    ],
    replaysSessionSampleRate: 0,
    replaysOnErrorSampleRate: 0.1,
  });

  initialized = true;
}

/**
 * Report an error to Sentry.
 * Safe to call even if Sentry is not initialized — no-op in that case.
 */
export function reportError(error: unknown, context?: Record<string, unknown>) {
  if (!initialized) return;
  Sentry.captureException(error, { extra: context });
}

/**
 * Set a user identifier for grouping errors (no PII).
 */
export function setSentryUser(id: string) {
  if (!initialized) return;
  Sentry.setUser({ id });
}
