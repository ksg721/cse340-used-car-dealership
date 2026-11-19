import db from "../db.js";

// Retrieve all vehicle categories
const getAllCategories = async () => {
    const sql = `
        SELECT
            category_id AS "categoryId",
            name,
            description
        FROM categories
        ORDER BY name;
    `;

    const result = await db.query(sql);
    return result.rows;
};

// Retrieve one category by its ID
const getCategoryById = async (categoryId) => {
    const sql = `
        SELECT
            category_id AS "categoryId",
            name,
            description
        FROM categories
        WHERE category_id = $1;
    `;

    const result = await db.query(sql, [categoryId]);
    return result.rows[0] || null;
};

// Create a new category
const createCategory = async (name, description) => {
    const sql = `
        INSERT INTO categories (
            name,
            description
        )
        VALUES ($1, $2)
        RETURNING
            category_id AS "categoryId",
            name,
            description;
    `;

    const result = await db.query(sql, [name, description]);
    return result.rows[0];
};

// Update an existing category
const updateCategory = async (categoryId, name, description) => {
    const sql = `
        UPDATE categories
        SET
            name = $1,
            description = $2,
            updated_at = CURRENT_TIMESTAMP
        WHERE category_id = $3
        RETURNING
            category_id AS "categoryId",
            name,
            description;
    `;

    const result = await db.query(sql, [name, description, categoryId]);
    return result.rows[0] || null;
};

// Delete a category by its ID
const deleteCategory = async (categoryId) => {
    const sql = `
        DELETE FROM categories
        WHERE category_id = $1
        RETURNING category_id AS "categoryId";
    `;

    const result = await db.query(sql, [categoryId]);
    return result.rows[0] || null;
};

export {
    getAllCategories,
    getCategoryById,
    createCategory,
    updateCategory,
    deleteCategory
};