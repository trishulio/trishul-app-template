import { toast } from "sonner";

import { reportError } from "./sentry";

const report = (title: string, description: string) => {
  toast.error(title, { description, duration: 5000 });
};

const toMessage = (error: unknown) =>
  error instanceof Error ? error.message : String(error);

export function registerGlobalErrorListeners() {
  window.addEventListener("unhandledrejection", (event) => {
    const message = toMessage(event.reason);

    if (
      event.reason instanceof DOMException &&
      event.reason.name === "AbortError"
    ) {
      event.preventDefault();
      return;
    }

    if (
      typeof event.reason === "string" &&
      event.reason.includes("AbortError")
    ) {
      event.preventDefault();
      return;
    }

    reportError(event.reason, { type: "unhandledrejection" });
    report(`Promise rejection: ${message}`, "An unexpected error occurred.");
  });

  window.addEventListener("error", (event) => {
    const message =
      event.error instanceof Error
        ? event.error.message
        : "Unknown error occurred";
        
    reportError(event.error, { type: "uncaught-error" });
    report(`Error: ${message}`, "An unexpected error occurred.");
  });
}
