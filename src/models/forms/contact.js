import db from "../db.js";

// Retrieve all contact messages for employees
const getAllContactMessages = async () => {
    const sql = `
        SELECT
            contact_message_id AS "contactMessageId",
            name,
            email,
            subject,
            message,
            status,
            response,
            created_at AS "createdAt",
            updated_at AS "updatedAt"
        FROM contact_messages
        ORDER BY created_at DESC;
    `;

    const result = await db.query(sql);
    return result.rows;
};

// Create a new contact message
const createContactMessage = async (message) => {
    const sql = `
        INSERT INTO contact_messages (
            name,
            email,
            subject,
            message
        )
        VALUES ($1, $2, $3, $4)
        RETURNING
            contact_message_id AS "contactMessageId",
            name,
            email,
            subject,
            message,
            status,
            created_at AS "createdAt";
    `;

    const result = await db.query(sql, [
        message.name,
        message.email,
        message.subject,
        message.message
    ]);

    return result.rows[0];
};

// Update the status and response for a contact message
const updateContactMessage = async (
    contactMessageId,
    status,
    response
) => {
    const sql = `
        UPDATE contact_messages
        SET
            status = $1,
            response = $2,
            updated_at = CURRENT_TIMESTAMP
        WHERE contact_message_id = $3
        RETURNING
            contact_message_id AS "contactMessageId",
            status,
            response,
            updated_at AS "updatedAt";
    `;

    const result = await db.query(sql, [
        status,
        response,
        contactMessageId
    ]);

    return result.rows[0] || null;
};

export {
    getAllContactMessages,
    createContactMessage,
    updateContactMessage
};