import db from "../models/db.js";

const cleanupExpiredSessions = async () => {
  try {
    // Remove sessions that have passed their expiration time so the session
    // table does not grow indefinitely.
    const result = await db.query(
      "DELETE FROM session WHERE expire < NOW()",
    );

    if (result.rowCount > 0) {
      console.log(`Cleaned up ${result.rowCount} expired sessions.`);
    }
  } catch (error) {
    // connect-pg-simple creates the session table when the first session is
    // saved. This error is therefore expected before the first login.
    if (error.code === "42P01") {
      console.log(
        "The session table does not exist yet. It will be created when the first session is stored.",
      );

      return;
    }

    console.error("Error cleaning up sessions:", error.message);
  }
};

const startSessionCleanup = () => {
  // Run once at startup so old rows are removed immediately.
  cleanupExpiredSessions();

  // Repeat the cleanup every twelve hours as required by the course pattern.
  const twelveHours = 12 * 60 * 60 * 1000;

  setInterval(cleanupExpiredSessions, twelveHours);

  console.log("Session cleanup scheduled every 12 hours.");
};

export { startSessionCleanup };
