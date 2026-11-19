import db from "../db.js";

// Retrieve all images for one vehicle
const getImagesByVehicleId = async (vehicleId) => {
    const sql = `
        SELECT
            image_id AS "imageId",
            vehicle_id AS "vehicleId",
            image_url AS "imageUrl",
            alt_text AS "altText",
            display_order AS "displayOrder"
        FROM vehicle_images
        WHERE vehicle_id = $1
        ORDER BY display_order;
    `;

    const result = await db.query(sql, [vehicleId]);
    return result.rows;
};

// Add an image to a vehicle
const createVehicleImage = async (vehicleId, imageUrl, altText, displayOrder) => {
    const sql = `
        INSERT INTO vehicle_images (
            vehicle_id,
            image_url,
            alt_text,
            display_order
        )
        VALUES ($1, $2, $3, $4)
        RETURNING
            image_id AS "imageId",
            vehicle_id AS "vehicleId",
            image_url AS "imageUrl",
            alt_text AS "altText",
            display_order AS "displayOrder";
    `;

    const result = await db.query(sql, [
        vehicleId,
        imageUrl,
        altText,
        displayOrder
    ]);

    return result.rows[0];
};

// Delete an image by its ID
const deleteVehicleImage = async (imageId) => {
    const sql = `
        DELETE FROM vehicle_images
        WHERE image_id = $1
        RETURNING image_id AS "imageId";
    `;

    const result = await db.query(sql, [imageId]);
    return result.rows[0] || null;
};

export {
    getImagesByVehicleId,
    createVehicleImage,
    deleteVehicleImage
};