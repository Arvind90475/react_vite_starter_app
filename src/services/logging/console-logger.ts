import { 
  Logger, 
  LogLevel, 
  DebugMetadata, 
  InfoMetadata, 
  WarnMetadata, 
  ErrorMetadata,
  LoggableUser
} from "./logger";
export class ConsoleLogger implements Logger {
  private currentUser: LoggableUser | null = null;

  private formatLog(
    level: LogLevel,
    message: string,
    metadata: Record<string, unknown> = {}
  ): string {
    const timestamp = new Date().toISOString();

    // Merge current user data with provided metadata if user is set
    const enhancedMetadata = { ...metadata };
    if (this.currentUser) {
      enhancedMetadata.user = {
        id: this.currentUser.id,
        email: this.currentUser.email,
      };
    }

    const metadataStr =
      Object.keys(enhancedMetadata).length > 0
        ? ` ${JSON.stringify(enhancedMetadata)}`
        : "";
    return `[${timestamp}] ${level.toUpperCase()}: ${message}${metadataStr}`;
  }

  debug(message: string, metadata?: DebugMetadata): void {
    console.debug(this.formatLog("debug", message, metadata));
  }

  info(message: string, metadata?: InfoMetadata): void {
    console.info(this.formatLog("info", message, metadata));
  }

  warn(message: string, metadata?: WarnMetadata): void {
    console.warn(this.formatLog("warn", message, metadata));
  }

  error(message: string, metadata: ErrorMetadata): void {
    // Special handling for error type
    if (metadata.error instanceof Error) {
      console.error(this.formatLog("error", message, {
        ...metadata,
        errorMessage: metadata.error.message,
        stack: metadata.error.stack
      }));
    } else {
      console.error(this.formatLog("error", message, metadata));
    }
  }

  setUser(
    user: LoggableUser | null
  ): void {
    this.currentUser = user;

    if (user) {
      this.debug("User context set", {
        action: "user_context_set",
        userId: user.id,
        ...(user.email && { email: user.email }),
      });
    } else {
      this.debug("User context cleared", { action: "user_context_cleared" });
    }
  }
}
