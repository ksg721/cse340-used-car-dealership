import { Router } from "express";
import { homePage } from "./index.js";
import { inventoryList, inventoryByCategory, vehicleDetail } from "./inventory/inventory.js";
import { showRegistration, registerUser } from "./forms/registration.js";
import { showLogin, loginUser, logoutUser } from "./forms/login.js";

// Create a new router instance
const router = Router();

// Home route
router.get("/", homePage);

// Public inventory routes
router.get("/inventory", inventoryList);
router.get("/inventory/category/:categoryId", inventoryByCategory);
router.get("/inventory/:vehicleId", vehicleDetail);

// Account routes
router.get("/account/register", showRegistration);
router.post("/account/resgister", registerUser);

router.get("/account/login", showLogin);
router.post("/account/login", loginUser);

router.post("/account/logout", logoutUser);

export default router;
