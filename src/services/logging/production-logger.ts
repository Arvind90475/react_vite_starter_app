import {
    DebugMetadata,
    ErrorMetadata,
    InfoMetadata,
    LoggableUser,
    Logger,
    WarnMetadata
} from "./logger";

/**
 * Production logger with Sentry support
 * This uses dynamic imports to prevent bundling Sentry in development
 */
export class ProductionLogger implements Logger {
  // Define a more specific type for Sentry to avoid 'any'
  private sentry: {
    init: (config: Record<string, unknown>) => void;
    captureMessage: (message: string, options: Record<string, unknown>) => void;
    captureException: (error: Error) => void;
    setUser: (user: Record<string, unknown> | null) => void;
  } | null = null;
  private isInitializing = false;
  private pendingLogs: Array<() => void> = [];

  constructor(dsn: string, environment: string) {
    this.initSentry(dsn, environment);
  }

  private async initSentry(dsn: string, environment: string) {
    if (this.isInitializing) return;
    this.isInitializing = true;

    try {
      // Dynamically import Sentry
      const sentryModule = await import("@sentry/browser");
      this.sentry = sentryModule;

      this.sentry.init({
        dsn,
        environment,
        tracesSampleRate: 0.1,
        sendDefaultPii: true,
      });

      // Process any logs that came in during initialization
      this.pendingLogs.forEach((logFn) => logFn());
      this.pendingLogs = [];
    } catch (error) {
      console.error("Failed to initialize Sentry:", error);
      this.isInitializing = false;
      throw new Error(`Sentry initialization failed: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      this.isInitializing = false;
    }
  }

  private addToQueue(fn: () => void) {
    if (this.sentry) {
      fn();
    } else if (this.isInitializing) {
      this.pendingLogs.push(fn);
    } else {
      // If Sentry is not initialized and not in the process of initializing,
      // throw an error - we don't want silent fallback to console in production
      throw new Error("Sentry is not initialized. Cannot process log.");
    }
  }

  debug(message: string, metadata?: DebugMetadata): void {
    this.addToQueue(() => {
      this.sentry.captureMessage(message, {
        level: "debug",
        extra: metadata,
      });
    });
  }

  info(message: string, metadata?: InfoMetadata): void {
    this.addToQueue(() => {
      this.sentry.captureMessage(message, { level: "info", extra: metadata });
    });
  }

  warn(message: string, metadata?: WarnMetadata): void {
    this.addToQueue(() => {
      this.sentry.captureMessage(message, {
        level: "warning",
        extra: metadata,
      });
    });
  }

  error(message: string, metadata: ErrorMetadata): void {
    this.addToQueue(() => {
      if (metadata.error instanceof Error) {
        // Capture the exception with additional context
        this.sentry.captureException(metadata.error);
      } else {
        this.sentry.captureMessage(message, {
          level: "error",
          extra: metadata,
        });
      }
    });
  }

  setUser(user: LoggableUser | null): void {
    this.addToQueue(() => {
      this.sentry.setUser(user);
    });
  }
}