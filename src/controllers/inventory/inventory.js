import {
  getAllVehicles,
  getVehiclesByCategory,
  getVehicleById,
} from "../../models/inventory/inventory.js";
import { getAllCategories } from "../../models/inventory/categories.js";
import { getImagesByVehicleId } from "../../models/inventory/vehicle-images.js";

// Display all available vehicles
const inventoryList = async (req, res, next) => {
  try {
    const [vehicles, categories] = await Promise.all([
      getAllVehicles(),
      getAllCategories(),
    ]);

    res.render("inventory/list", {
      title: "Vehicle Inventory",
      vehicles,
      categories,
      selectedCategoryId: null,
    });
  } catch (error) {
    next(error);
  }
};

// Display vehicles from one category
const inventoryByCategory = async (req, res, next) => {
  try {
    const categoryId = Number(req.params.categoryId);

    // If category ID is not valid then 404
    if (!Number.isInteger(categoryId) || categoryId <= 0) {
      const error = new Error("Invalid category");
      error.status = 404;
      return next(error);
    }

    const [vehicles, categories] = await Promise.all([
      getVehiclesByCategory(categoryId),
      getAllCategories(),
    ]);

    const selectedCategory = categories.find(
      (category) => category.categoryId === categoryId,
    );

    // If the category does not exist then 404
    if (!selectedCategory) {
      const error = new Error("Category not found.");
      error.status = 404;
      return next(error);
    }

    res.render("inventory/list", {
      title: `${selectedCategory.name} Inventory`,
      vehicles,
      categories,
      selectedCategoryId: categoryId,
    });
  } catch (error) {
    next(error);
  }
};

// Display details for one vehicle
const vehicleDetail = async (req, res, next) => {
  try {
    const vehicleId = Number(req.params.vehicleId);

    // If vehicle ID is not valid then 404
    if (!Number.isInteger(vehicleId) || vehicleId <= 0) {
      const error = new Error("Invalid vehicle");
      error.status = 404;
      return next(error);
    }

    const [vehicle, images] = await Promise.all([
      getVehicleById(vehicleId),
      getImagesByVehicleId(vehicleId),
    ]);

    // If selected vehicle does not exist then 404
    if (!vehicle) {
      const error = new Error("Vehicle not found.");
      error.status = 404;
      return next(error);
    }

    res.render("inventory/detail", {
      title: `${vehicle.year} ${vehicle.make} ${vehicle.model}`,
      vehicle,
      images,
    });
  } catch (error) {
    next(error);
  }
};

export { inventoryList, inventoryByCategory, vehicleDetail };
