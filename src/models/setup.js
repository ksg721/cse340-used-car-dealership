import { readFile } from "fs/promises";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import db from "./db.js";

const currentFile = fileURLToPath(import.meta.url);
const currentDirectory = dirname(currentFile);

const setupDatabase = async () => {
  // Resolve the schema path relative to this module so the code works both
  // locally and when deployed to Render.
  const schemaPath = join(currentDirectory, "sql", "dealership.sql");
  const schemaSql = await readFile(schemaPath, "utf8");

  // Prevent the server from starting successfully with no database schema.
  if (!schemaSql.trim()) {
    throw new Error(
      "dealership.sql is empty. Add the database schema before starting the server.",
    );
  }

  // dealership.sql uses idempotent CREATE statements, so this can safely run
  // whenever the server starts.
  await db.query(schemaSql);

  console.log("Dealership database tables initialized.");

  return true;
};

const testConnection = async () => {
  // A small query confirms that the server can reach PostgreSQL before it
  // begins accepting requests.
  const result = await db.query("SELECT NOW() AS current_time");

  console.log(
    "Database connection successful:",
    result.rows[0].current_time,
  );

  return true;
};

export { setupDatabase, testConnection };
