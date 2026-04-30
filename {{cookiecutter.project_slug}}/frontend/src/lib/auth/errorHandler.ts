import { toast } from "sonner";

/**
 * Global error handler utility
 */
export class ErrorHandler {
  private static initialized = false;

  /**
   * Initialize global error handlers
   */
  static init() {
    if (this.initialized) return;

    // Handle unhandled promise rejections
    window.addEventListener("unhandledrejection", (event) => {
      // Suppress AbortError as they are expected during cleanup
      const reason = event.reason;
      const message = reason instanceof Error ? reason.message : String(reason);

      if (reason instanceof DOMException && reason.name === "AbortError") {
        console.log("Suppressed AbortError during cleanup:", message);
        event.preventDefault();
        return;
      }

      if (typeof reason === "string" && reason.includes("AbortError")) {
        console.log("Suppressed AbortError during cleanup:", message);
        event.preventDefault();
        return;
      }

      console.error("Unhandled promise rejection:", event.reason);

      toast.error(`Promise rejection: ${message}`, {
        description: "An unexpected error occurred.",
        duration: 5000,
      });
    });

    // Handle uncaught errors
    window.addEventListener("error", (event) => {
      console.error("Uncaught error:", event.error);

      const message =
        event.error instanceof Error
          ? event.error.message
          : "Unknown error occurred";

      toast.error(`Error: ${message}`, {
        description: "An unexpected error occurred.",
        duration: 5000,
      });
    });

    this.initialized = true;
  }

  /**
   * Manually handle and display an error
   */
  static handle(error: unknown, context?: string) {
    console.error(context ? `${context}:` : "Error:", error);

    const message = error instanceof Error ? error.message : String(error);

    const title = context ? `${context}: ${message}` : message;

    toast.error(title, {
      description: "Please try again or contact support if the issue persists.",
      duration: 5000,
    });
  }

  /**
   * Wrap an async function to automatically handle errors
   */
  static async wrap<T>(
    fn: () => Promise<T>,
    context?: string,
  ): Promise<T | undefined> {
    try {
      return await fn();
    } catch (error) {
      this.handle(error, context);
      return undefined;
    }
  }

  /**
   * Wrap a sync function to automatically handle errors
   */
  static try<T>(fn: () => T, context?: string): T | undefined {
    try {
      return fn();
    } catch (error) {
      this.handle(error, context);
      return undefined;
    }
  }
}
