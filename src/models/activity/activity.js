import db from "../db.js";

// Retrieve recent activity records
const getRecentActivity = async (limit = 25) => {
    const sql = `
        SELECT
            al.activity_id AS "activityId",
            al.user_id AS "userId",
            u.first_name AS "firstName",
            u.last_name AS "lastName",
            al.action,
            al.entity_type AS "entityType",
            al.entity_id AS "entityId",
            al.details,
            al.created_at AS "createdAt"
        FROM activity_log al
        LEFT JOIN users u
            ON u.user_id = al.user_id
        ORDER BY al.created_at DESC
        LIMIT $1;
    `;

    const result = await db.query(sql, [limit]);
    return result.rows;
};

// Add an activity record
const createActivity = async (activity) => {
    const sql = `
        INSERT INTO activity_log (
            user_id,
            action,
            entity_type,
            entity_id,
            details
        )
        VALUES ($1, $2, $3, $4, $5)
        RETURNING
            activity_id AS "activityId",
            user_id AS "userId",
            action,
            entity_type AS "entityType",
            entity_id AS "entityId",
            details,
            created_at AS "createdAt";
    `;

    const result = await db.query(sql, [
        activity.userId,
        activity.action,
        activity.entityType,
        activity.entityId,
        activity.details
    ]);

    return result.rows[0];
};

export {
    getRecentActivity,
    createActivity
};