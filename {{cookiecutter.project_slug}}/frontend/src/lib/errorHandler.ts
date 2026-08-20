import { toast } from "sonner";
import { registerGlobalErrorListeners } from "./errorEvents";

export class ErrorHandler {
  private static initialized = false;

  static init() {
    if (this.initialized) return;
    registerGlobalErrorListeners();
    this.initialized = true;
  }

  static handle(error: unknown, context?: string) {
    const message = error instanceof Error ? error.message : String(error);
    const title = context ? `${context}: ${message}` : message;
    toast.error(title, {
      description: "Please try again or contact support if the issue persists.",
      duration: 5000,
    });
  }

  static async wrap<T>(fn: () => Promise<T>, context?: string) {
    try {
      return await fn();
    } catch (error) {
      this.handle(error, context);
      return undefined;
    }
  }

  static try<T>(fn: () => T, context?: string) {
    try {
      return fn();
    } catch (error) {
      this.handle(error, context);
      return undefined;
    }
  }
}
