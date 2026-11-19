import db from "../db.js";

// Retrieve featured vehicles for the home page
const getFeaturedVehicles = async () => {
  const sql = `
        SELECT
            v.vehicle_id AS "vehicleId",
            v.category_id AS "categoryId",
            c.name AS "categoryName",
            v.year,
            v.make,
            v.model,
            v.price,
            v.mileage,
            v.color,
            v.description,
            v.is_available AS "isAvailable",
            v.is_featured AS "isFeatured"
        FROM vehicles v
        JOIN categories c
            ON c.category_id = v.category_id
        WHERE v.is_featured = TRUE
          AND v.is_available = TRUE
        ORDER BY v.created_at DESC;
    `;

  const result = await db.query(sql);
  return result.rows;
};

// Retrieve all available vehicles
const getAllVehicles = async () => {
  const sql = `
        SELECT
            v.vehicle_id AS "vehicleId",
            v.category_id AS "categoryId",
            c.name AS "categoryName",
            v.year,
            v.make,
            v.model,
            v.price,
            v.mileage,
            v.color,
            v.description,
            v.is_available AS "isAvailable",
            v.is_featured AS "isFeatured"
        FROM vehicles v
        JOIN categories c
            ON c.category_id = v.category_id
        WHERE v.is_available = TRUE
        ORDER BY v.created_at DESC;
    `;

  const result = await db.query(sql);
  return result.rows;
};

// Retrieve available vehicles by category
const getVehiclesByCategory = async (categoryId) => {
  const sql = `
        SELECT
            v.vehicle_id AS "vehicleId",
            v.category_id AS "categoryId",
            c.name AS "categoryName",
            v.year,
            v.make,
            v.model,
            v.price,
            v.mileage,
            v.color,
            v.description,
            v.is_available AS "isAvailable",
            v.is_featured AS "isFeatured"
        FROM vehicles v
        JOIN categories c
            ON c.category_id = v.category_id
        WHERE v.category_id = $1
          AND v.is_available = TRUE
        ORDER BY v.created_at DESC;
    `;

  const result = await db.query(sql, [categoryId]);
  return result.rows;
};

// Retrieve one vehicle by its ID
const getVehicleById = async (vehicleId) => {
  const sql = `
        SELECT
            v.vehicle_id AS "vehicleId",
            v.category_id AS "categoryId",
            c.name AS "categoryName",
            v.year,
            v.make,
            v.model,
            v.price,
            v.mileage,
            v.color,
            v.description,
            v.is_available AS "isAvailable",
            v.is_featured AS "isFeatured"
        FROM vehicles v
        JOIN categories c
            ON c.category_id = v.category_id
        WHERE v.vehicle_id = $1;
    `;

  const result = await db.query(sql, [vehicleId]);
  return result.rows[0] || null;
};

// Add a new vehicle to the inventory
const createVehicle = async (vehicle) => {
  const sql = `
        INSERT INTO vehicles (
            category_id,
            year,
            make,
            model,
            price,
            mileage,
            color,
            description,
            is_available,
            is_featured
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        RETURNING
            vehicle_id AS "vehicleId",
            category_id AS "categoryId",
            year,
            make,
            model,
            price,
            mileage,
            color,
            description,
            is_available AS "isAvailable",
            is_featured AS "isFeatured";
    `;

  const parameters = [
    vehicle.categoryId,
    vehicle.year,
    vehicle.make,
    vehicle.model,
    vehicle.price,
    vehicle.mileage,
    vehicle.color,
    vehicle.description,
    vehicle.isAvailable,
    vehicle.isFeatured,
  ];

  const result = await db.query(sql, parameters);
  return result.rows[0];
};

// Update an existing vehicle
const updateVehicle = async (vehicleId, vehicle) => {
  const sql = `
        UPDATE vehicles
        SET
            category_id = $1,
            year = $2,
            make = $3,
            model = $4,
            price = $5,
            mileage = $6,
            color = $7,
            description = $8,
            is_available = $9,
            is_featured = $10,
            updated_at = CURRENT_TIMESTAMP
        WHERE vehicle_id = $11
        RETURNING
            vehicle_id AS "vehicleId",
            category_id AS "categoryId",
            year,
            make,
            model,
            price,
            mileage,
            color,
            description,
            is_available AS "isAvailable",
            is_featured AS "isFeatured";
    `;

  const parameters = [
    vehicle.categoryId,
    vehicle.year,
    vehicle.make,
    vehicle.model,
    vehicle.price,
    vehicle.mileage,
    vehicle.color,
    vehicle.description,
    vehicle.isAvailable,
    vehicle.isFeatured,
    vehicleId,
  ];

  const result = await db.query(sql, parameters);
  return result.rows[0] || null;
};

// Delete a vehicle by its ID
const deleteVehicle = async (vehicleId) => {
  const sql = `
        DELETE FROM vehicles
        WHERE vehicle_id = $1
        RETURNING vehicle_id AS "vehicleId";
    `;

  const result = await db.query(sql, [vehicleId]);
  return result.rows[0] || null;
};

export {
  getFeaturedVehicles,
  getAllVehicles,
  getVehiclesByCategory,
  getVehicleById,
  createVehicle,
  updateVehicle,
  deleteVehicle,
};
