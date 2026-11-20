import { Router } from "express";
import { homePage } from "./index.js";

import {
    inventoryList,
    inventoryByCategory,
    vehicleDetail
} from "./inventory/inventory.js";

// Create a new router instance
const router = Router();

// Home route
router.get("/", homePage);

// Public inventory routes
router.get("/inventory", inventoryList);
router.get("/inventory/category/:categoryId", inventoryByCategory);
router.get("/inventory/:vehicleId", vehicleDetail);

export default router;
