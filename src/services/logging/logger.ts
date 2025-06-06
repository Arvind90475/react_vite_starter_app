import { ConsoleLogger } from './console-logger';
import { ProductionLogger } from './production-logger';

export type LogLevel = "debug" | "info" | "warn" | "error";

// Base metadata type
export type BaseMetadata = {
  [key: string]: unknown;
};

// Specific metadata types for each log level
export type DebugMetadata = BaseMetadata;
export type InfoMetadata = BaseMetadata;
export type WarnMetadata = BaseMetadata 

// Error metadata should always include certain fields
export type ErrorMetadata = BaseMetadata & {
  error: Error;
};

// Union type for all metadata
export type LogMetadata = DebugMetadata | InfoMetadata | WarnMetadata | ErrorMetadata;

// User type definition
export type LoggableUser = { 
  id: string; 
  email?: string;
};

export interface Logger {
  debug: (message: string, metadata?: DebugMetadata) => void;
  info: (message: string, metadata?: InfoMetadata) => void;
  warn: (message: string, metadata?: WarnMetadata) => void;
  error: (message: string, metadata: ErrorMetadata) => void; // Error metadata is required
  setUser: (user: LoggableUser | null) => void;
}


export const createLogger = (): Logger => {
  const environment = import.meta.env.MODE;
  const isProd = environment === 'production';

  console.log(`Logger initialized in ${environment} mode`);

  // In production, use Sentry logger if DSN is configured
  if (import.meta.env.VITE_SENTRY_DSN) {
    try {
      return new ProductionLogger(import.meta.env.VITE_SENTRY_DSN, environment);
    } catch (error) {
      console.error("Failed to initialize production logger:", error);
      // In production with failed Sentry, we'll throw an error
      if (isProd) {
        throw new Error(`Production logger initialization failed: ${error instanceof Error ? error.message : String(error)}`);
      }
      // In non-production environments with Sentry DSN configured but failing, fall back to console
      console.warn("Falling back to console logger due to Sentry initialization failure");
    }
  }

  // In development/test, use console logger
  return new ConsoleLogger();
};

// Export singleton logger instance
export const logger = createLogger();
