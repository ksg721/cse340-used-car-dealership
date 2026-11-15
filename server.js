import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import session from "express-session";
import connectPgSimple from "connect-pg-simple";

import { setupDatabase, testConnection } from "./src/models/setup.js";
import { startSessionCleanup } from "./src/utils/session-cleanup.js";

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
 * Temporary route
 */
app.get("/", (request, response) => {
  response.send("Used car dealership is running.");
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
      console.log(`Environment: ${nodeEnvironment}.`);
    });
  } catch (error) {
    console.error("The server could not start:", error.message);
    process.exit(1);
  }
};

startServer();
