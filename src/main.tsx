import { logger } from "./services/logging/logger.ts";

// intentionally import logger first to ensure it's initialized before any other code runs
// This is important for capturing logs from the very start of the application
// Register global error handlers for uncaught errors
window.addEventListener("error", (event) => {
  logger.error("Uncaught error", {
    message: event.message,
    error: event.error,
    filename: event.filename,
  });
});

window.addEventListener("unhandledrejection", (event) => {
  logger.error("Unhandled promise rejection", {
    reason: event.reason,
    error:
      event.reason instanceof Error
        ? event.reason
        : new Error(String(event.reason)),
  });
});

import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Log application startup
logger.info("Application starting", {
  environment: import.meta.env.MODE,
  version: import.meta.env.VITE_APP_VERSION || "1.0.0",
});

// Create and render the React app
const rootElement = document.getElementById("root");
if (!rootElement) {
  logger.error("Root element not found.", {
    error: new Error(
      "Root element not found, Ensure your HTML has a <div id='root'></div>."
    ),
  });
  throw new Error("Root element not found");
}
createRoot(rootElement).render(<App />);
