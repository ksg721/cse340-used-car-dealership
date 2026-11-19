import db from "../db.js";

// Retrieve a user by email for authentication
const getUserByEmail = async (email) => {
    const sql = `
        SELECT
            user_id AS "userId",
            first_name AS "firstName",
            last_name AS "lastName",
            email,
            password_hash AS "passwordHash",
            role
        FROM users
        WHERE email = $1;
    `;

    const result = await db.query(sql, [email]);
    return result.rows[0] || null;
};

// Retrieve a user by ID without returning the password hash
const getUserById = async (userId) => {
    const sql = `
        SELECT
            user_id AS "userId",
            first_name AS "firstName",
            last_name AS "lastName",
            email,
            role,
            created_at AS "createdAt"
        FROM users
        WHERE user_id = $1;
    `;

    const result = await db.query(sql, [userId]);
    return result.rows[0] || null;
};

// Retrieve all users for the owner dashboard
const getAllUsers = async () => {
    const sql = `
        SELECT
            user_id AS "userId",
            first_name AS "firstName",
            last_name AS "lastName",
            email,
            role,
            created_at AS "createdAt"
        FROM users
        ORDER BY last_name, first_name;
    `;

    const result = await db.query(sql);
    return result.rows;
};

// Create a user with an already-hashed password
const createUser = async (user) => {
    const sql = `
        INSERT INTO users (
            first_name,
            last_name,
            email,
            password_hash,
            role
        )
        VALUES ($1, $2, $3, $4, $5)
        RETURNING
            user_id AS "userId",
            first_name AS "firstName",
            last_name AS "lastName",
            email,
            role;
    `;

    const result = await db.query(sql, [
        user.firstName,
        user.lastName,
        user.email,
        user.passwordHash,
        user.role || "user"
    ]);

    return result.rows[0];
};

// Update a user's role
const updateUserRole = async (userId, role) => {
    const sql = `
        UPDATE users
        SET
            role = $1,
            updated_at = CURRENT_TIMESTAMP
        WHERE user_id = $2
        RETURNING
            user_id AS "userId",
            first_name AS "firstName",
            last_name AS "lastName",
            email,
            role;
    `;

    const result = await db.query(sql, [role, userId]);
    return result.rows[0] || null;
};

export {
    getUserByEmail,
    getUserById,
    getAllUsers,
    createUser,
    updateUserRole
};