import db from "../db.js";

// Retrieve approved reviews for a vehicle
const getReviewsByVehicleId = async (vehicleId) => {
    const sql = `
        SELECT
            r.review_id AS "reviewId",
            r.user_id AS "userId",
            r.vehicle_id AS "vehicleId",
            u.first_name AS "firstName",
            u.last_name AS "lastName",
            r.rating,
            r.review_text AS "reviewText",
            r.created_at AS "createdAt",
            r.updated_at AS "updatedAt"
        FROM reviews r
        JOIN users u
            ON u.user_id = r.user_id
        WHERE r.vehicle_id = $1
          AND r.is_approved = TRUE
        ORDER BY r.created_at DESC;
    `;

    const result = await db.query(sql, [vehicleId]);
    return result.rows;
};

// Create a review for a vehicle
const createReview = async (review) => {
    const sql = `
        INSERT INTO reviews (
            user_id,
            vehicle_id,
            rating,
            review_text
        )
        VALUES ($1, $2, $3, $4)
        RETURNING
            review_id AS "reviewId",
            user_id AS "userId",
            vehicle_id AS "vehicleId",
            rating,
            review_text AS "reviewText",
            is_approved AS "isApproved";
    `;

    const result = await db.query(sql, [
        review.userId,
        review.vehicleId,
        review.rating,
        review.reviewText
    ]);

    return result.rows[0];
};

// Delete a review belonging to a specific user
const deleteUserReview = async (reviewId, userId) => {
    const sql = `
        DELETE FROM reviews
        WHERE review_id = $1
          AND user_id = $2
        RETURNING review_id AS "reviewId";
    `;

    const result = await db.query(sql, [reviewId, userId]);
    return result.rows[0] || null;
};

// Retrieve reviews awaiting employee approval
const getPendingReviews = async () => {
    const sql = `
        SELECT
            r.review_id AS "reviewId",
            r.vehicle_id AS "vehicleId",
            u.email,
            v.make,
            v.model,
            r.rating,
            r.review_text AS "reviewText",
            r.created_at AS "createdAt"
        FROM reviews r
        JOIN users u
            ON u.user_id = r.user_id
        JOIN vehicles v
            ON v.vehicle_id = r.vehicle_id
        WHERE r.is_approved = FALSE
        ORDER BY r.created_at;
    `;

    const result = await db.query(sql);
    return result.rows;
};

// Approve a review
const approveReview = async (reviewId) => {
    const sql = `
        UPDATE reviews
        SET
            is_approved = TRUE,
            updated_at = CURRENT_TIMESTAMP
        WHERE review_id = $1
        RETURNING
            review_id AS "reviewId",
            is_approved AS "isApproved";
    `;

    const result = await db.query(sql, [reviewId]);
    return result.rows[0] || null;
};

export {
    getReviewsByVehicleId,
    createReview,
    deleteUserReview,
    getPendingReviews,
    approveReview
};