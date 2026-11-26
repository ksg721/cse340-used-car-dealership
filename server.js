import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import session from "express-session";
import connectPgSimple from "connect-pg-simple";

import { setupDatabase, testConnection } from "./src/models/setup.js";
import { startSessionCleanup } from "./src/utils/session-cleanup.js";

import routes from "./src/controllers/routes.js";
// Import global middleware.
import { addLocalVariables } from "./src/middleware/global.js";

/**
 * Server configuration
 */
const currentFile = fileURLToPath(import.meta.url);
const currentDirectory = path.dirname(currentFile);

const nodeEnvironment = process.env.NODE_ENV?.toLowerCase() || "development";
const port = process.env.PORT || 3000;

/**
 * Validate required environment variables
 */

if (!process.env.SESSION_SECRET) {
  throw new Error(
    "SESSION_SECRET is missing. Add it to your .env file or Render environment variables.",
  );
}

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL is missing. Add it to your .env file or Render environment variables.",
  );
}

/**
 * Setup Express Server
 */

const app = express();

// Trust Render's reverse proxy so secure session cookies work in production.
app.set("trust proxy", 1);

const pgSession = connectPgSimple(session);

/**
 * Configure session middleware
 */

app.use(
  session({
    store: new pgSession({
      conObject: {
        connectionString: process.env.DATABASE_URL,
      },
      tableName: "session",
      createTableIfMissing: true,
    }),
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: nodeEnvironment !== "development",
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
    },
  }),
);

/**
 * Configure Express
 */
app.use(express.static(path.join(currentDirectory, "public")));

app.use(express.urlencoded({ extended: true }));

app.use(express.json());

app.set("view engine", "ejs");

app.set("views", path.join(currentDirectory, "src/views"));

/**
 * Global Middleware
 */
// Add common template variables
app.use(addLocalVariables);

/**
 * Routes
 */
app.use("/", routes);

/**
 * Error Handling
 */
// Handle requests that do not match an existing route
app.use((req, res, next) => {
  const error = new Error("Page Not Found");
  error.status = 404;

  next(error);
});

// Handle errors from routes and middleware
app.use((error, req, res, next) => {
  // Avoid sending another response if one has already been sent
  if (res.headersSent || res.finished) {
    return next(error);
  }

  // Use the error status when available, otherwise use status 500
  const status = error.status || 500;

  // Select the appropriate view
  const template = status === 404 ? "404" : "500";

  // Hide detailed error information in production
  const context = {
    title: status === 404 ? "Page Not Found" : "Server Error",
    error:
      nodeEnvironment === "production" ? "An error occurred." : error.message,
    stack: nodeEnvironment === "production" ? null : error.stack,
  };

  // Render the appropriate error view
  try {
    res.status(status).render(`errors/${template}`, context);
  } catch (renderError) {
    // Send a basic response if the error view cannot be rendered
    if (!res.headersSent) {
      res
        .status(status)
        .send(`<h1>Error ${status}</h1><p>An error occurred.</p>`);
    }
  }
});

/**
 * Start Server
 */
const startServer = async () => {
  try {
    await testConnection();

    await setupDatabase();

    startSessionCleanup();

    app.listen(port, "0.0.0.0", () => {
      console.log(`Server is running on port ${port}.`);
      console.log(`Local URL: http://localhost:${port}/`);
      console.log(`Environment: ${nodeEnvironment}.`);
    });
  } catch (error) {
    console.error("The server could not start:", error.message);
    process.exit(1);
  }
};

startServer();
