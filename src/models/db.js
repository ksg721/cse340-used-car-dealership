import { Pool } from "pg";

// Use development defaults locally, while Render sets NODE_ENV to production.
const nodeEnvironment = process.env.NODE_ENV?.toLowerCase() || "development";
const isProduction = nodeEnvironment === "production";
const connectionString = process.env.DATABASE_URL;

// Fail early with a clear message instead of allowing database queries to
// fail later with a less useful connection error.
if (!connectionString) {
  throw new Error(
    "DATABASE_URL is missing. Add DATABASE_URL to your environment variables.",
  );
}

const pool = new Pool({
  // Render PostgreSQL requires TLS. Local PostgreSQL does not normally need it.
  connectionString,
  ssl: isProduction ? { rejectUnauthorized: false } : false,
});

// Log unexpected idle-client errors so connection problems are visible in the
// local terminal or Render logs.
pool.on("error", (error) => {
  console.error("Unexpected PostgreSQL pool error:", error);
});

let db = pool;

// SQL logging is opt-in so production logs do not expose every query by
// default. The wrapper preserves the pool's query interface.
if (
  nodeEnvironment.includes("dev") &&
  process.env.ENABLE_SQL_LOGGING === "true"
) {
  db = {
    async query(text, parameters) {
      // Record the duration to make slow database queries easier to identify.
      const startTime = Date.now();

      try {
        const result = await pool.query(text, parameters);
        const duration = Date.now() - startTime;

        console.log("Executed query:", {
          text: text.replace(/\s+/g, " ").trim(),
          duration: `${duration}ms`,
          rows: result.rowCount,
        });

        return result;
      } catch (error) {
        console.error("Database query failed:", {
          text: text.replace(/\s+/g, " ").trim(),
          message: error.message,
        });

        throw error;
      }
    },

    async end() {
      // Close all pooled connections when the application shuts down.
      await pool.end();
    },
  };
}

export default db;
