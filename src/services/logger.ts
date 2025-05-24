
export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

export interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  metadata?: Record<string, any>;
}

export interface Logger {
  debug: (message: string, metadata?: Record<string, any>) => void;
  info: (message: string, metadata?: Record<string, any>) => void;
  warn: (message: string, metadata?: Record<string, any>) => void;
  error: (message: string, metadata?: Record<string, any>) => void;
}

// Core logging functions (pure functions, no React dependency)
export const createLogEntry = (
  level: LogLevel,
  message: string,
  metadata?: Record<string, any>
): LogEntry => ({
  level,
  message,
  timestamp: new Date().toISOString(),
  metadata,
});

export const formatLogEntry = (entry: LogEntry): string => {
  const metadataStr = entry.metadata ? ` ${JSON.stringify(entry.metadata)}` : '';
  return `[${entry.timestamp}] ${entry.level.toUpperCase()}: ${entry.message}${metadataStr}`;
};

// Console logger implementation
export const createConsoleLogger = (): Logger => ({
  debug: (message: string, metadata?: Record<string, any>) => {
    const entry = createLogEntry('debug', message, metadata);
    console.debug(formatLogEntry(entry));
  },
  info: (message: string, metadata?: Record<string, any>) => {
    const entry = createLogEntry('info', message, metadata);
    console.info(formatLogEntry(entry));
  },
  warn: (message: string, metadata?: Record<string, any>) => {
    const entry = createLogEntry('warn', message, metadata);
    console.warn(formatLogEntry(entry));
  },
  error: (message: string, metadata?: Record<string, any>) => {
    const entry = createLogEntry('error', message, metadata);
    console.error(formatLogEntry(entry));
  },
});

// Default logger instance
export const logger = createConsoleLogger();
