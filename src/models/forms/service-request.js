import db from "../db.js";

// Retrieve service requests belonging to one user
const getServiceRequestsByUserId = async (userId) => {
    const sql = `
        SELECT
            sr.service_request_id AS "serviceRequestId",
            sr.user_id AS "userId",
            sr.vehicle_id AS "vehicleId",
            v.year,
            v.make,
            v.model,
            sr.service_type AS "serviceType",
            sr.description,
            sr.status,
            sr.employee_notes AS "employeeNotes",
            sr.submitted_at AS "submittedAt",
            sr.updated_at AS "updatedAt",
            sr.completed_at AS "completedAt"
        FROM service_requests sr
        LEFT JOIN vehicles v
            ON v.vehicle_id = sr.vehicle_id
        WHERE sr.user_id = $1
        ORDER BY sr.submitted_at DESC;
    `;

    const result = await db.query(sql, [userId]);
    return result.rows;
};

// Retrieve all service requests for employees
const getAllServiceRequests = async () => {
    const sql = `
        SELECT
            sr.service_request_id AS "serviceRequestId",
            sr.user_id AS "userId",
            u.first_name AS "firstName",
            u.last_name AS "lastName",
            u.email,
            sr.vehicle_id AS "vehicleId",
            v.year,
            v.make,
            v.model,
            sr.service_type AS "serviceType",
            sr.description,
            sr.status,
            sr.employee_notes AS "employeeNotes",
            sr.submitted_at AS "submittedAt",
            sr.updated_at AS "updatedAt",
            sr.completed_at AS "completedAt"
        FROM service_requests sr
        JOIN users u
            ON u.user_id = sr.user_id
        LEFT JOIN vehicles v
            ON v.vehicle_id = sr.vehicle_id
        ORDER BY sr.submitted_at DESC;
    `;

    const result = await db.query(sql);
    return result.rows;
};

// Create a new service request
const createServiceRequest = async (request) => {
    const sql = `
        INSERT INTO service_requests (
            user_id,
            vehicle_id,
            service_type,
            description
        )
        VALUES ($1, $2, $3, $4)
        RETURNING
            service_request_id AS "serviceRequestId",
            user_id AS "userId",
            vehicle_id AS "vehicleId",
            service_type AS "serviceType",
            description,
            status,
            submitted_at AS "submittedAt";
    `;

    const result = await db.query(sql, [
        request.userId,
        request.vehicleId,
        request.serviceType,
        request.description
    ]);

    return result.rows[0];
};

// Update the status and employee notes for a service request
const updateServiceRequest = async (
    serviceRequestId,
    status,
    employeeNotes
) => {
    const sql = `
        UPDATE service_requests
        SET
            status = $1,
            employee_notes = $2,
            updated_at = CURRENT_TIMESTAMP,
            completed_at = CASE
                WHEN $1 = 'Completed' THEN CURRENT_TIMESTAMP
                ELSE completed_at
            END
        WHERE service_request_id = $3
        RETURNING
            service_request_id AS "serviceRequestId",
            status,
            employee_notes AS "employeeNotes",
            updated_at AS "updatedAt",
            completed_at AS "completedAt";
    `;

    const result = await db.query(sql, [
        status,
        employeeNotes,
        serviceRequestId
    ]);

    return result.rows[0] || null;
};

// Retrieve status history for a service request
const getServiceRequestHistory = async (serviceRequestId) => {
    const sql = `
        SELECT
            srh.history_id AS "historyId",
            srh.service_request_id AS "serviceRequestId",
            srh.changed_by_user_id AS "changedByUserId",
            u.first_name AS "firstName",
            u.last_name AS "lastName",
            srh.old_status AS "oldStatus",
            srh.new_status AS "newStatus",
            srh.note,
            srh.changed_at AS "changedAt"
        FROM service_request_history srh
        LEFT JOIN users u
            ON u.user_id = srh.changed_by_user_id
        WHERE srh.service_request_id = $1
        ORDER BY srh.changed_at;
    `;

    const result = await db.query(sql, [serviceRequestId]);
    return result.rows;
};

// Record a service-request status change
const createServiceRequestHistory = async (history) => {
    const sql = `
        INSERT INTO service_request_history (
            service_request_id,
            changed_by_user_id,
            old_status,
            new_status,
            note
        )
        VALUES ($1, $2, $3, $4, $5)
        RETURNING
            history_id AS "historyId",
            service_request_id AS "serviceRequestId",
            old_status AS "oldStatus",
            new_status AS "newStatus",
            note,
            changed_at AS "changedAt";
    `;

    const result = await db.query(sql, [
        history.serviceRequestId,
        history.changedByUserId,
        history.oldStatus,
        history.newStatus,
        history.note
    ]);

    return result.rows[0];
};

export {
    getServiceRequestsByUserId,
    getAllServiceRequests,
    createServiceRequest,
    updateServiceRequest,
    getServiceRequestHistory,
    createServiceRequestHistory
};