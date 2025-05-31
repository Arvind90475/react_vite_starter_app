
export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

export type LogMetadata = Record<string, unknown>;

export interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  metadata?: LogMetadata;
}

export interface Logger {
  debug: (message: string, metadata?: LogMetadata) => void;
  info: (message: string, metadata?: LogMetadata) => void;
  warn: (message: string, metadata?: LogMetadata) => void;
  error: (message: string, metadata?: LogMetadata) => void;
}

// Core logging functions (pure functions, no React dependency)
export const createLogEntry = (
  level: LogLevel,
  message: string,
  metadata?: LogMetadata
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
  debug: (message: string, metadata?: LogMetadata) => {
    const entry = createLogEntry('debug', message, metadata);
    console.debug(formatLogEntry(entry));
  },
  info: (message: string, metadata?: LogMetadata) => {
    const entry = createLogEntry('info', message, metadata);
    console.info(formatLogEntry(entry));
  },
  warn: (message: string, metadata?: LogMetadata) => {
    const entry = createLogEntry('warn', message, metadata);
    console.warn(formatLogEntry(entry));
  },
  error: (message: string, metadata?: LogMetadata) => {
    const entry = createLogEntry('error', message, metadata);
    console.error(formatLogEntry(entry));
  },
});

// Default logger instance
export const logger = createConsoleLogger();
