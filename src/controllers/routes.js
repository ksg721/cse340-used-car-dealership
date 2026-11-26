import { Router } from "express";
import { homePage, accountPage } from "./index.js";
import {
  inventoryList,
  inventoryByCategory,
  vehicleDetail,
} from "./inventory/inventory.js";
import { showRegistration, registerUser } from "./forms/registration.js";
import { showLogin, loginUser, logoutUser } from "./forms/login.js";

import { requireLogin, requireRole } from "../middleware/auth.js";

import { employeeDashboard } from "./dashboard/employee.js";

import { ownerDashboard } from "./dashboard/owner.js";

// Create a new router instance
const router = Router();

// Load inventory styles for inventory routes.
router.use("/inventory", (req, res, next) => {
  res.addStyle('<link rel="stylesheet" href="/css/inventory.css">');

  next();
});

// Load account styles for login and registration routes.
router.use("/account", (req, res, next) => {
  res.addStyle('<link rel="stylesheet" href="/css/account.css">');

  next();
});

// Load home page styles for the home route.
router.get("/", (req, res, next) => {
  res.addStyle('<link rel="stylesheet" href="/css/home.css">');

  next();
}, homePage);

// Public inventory routes
router.get("/inventory", inventoryList);
router.get("/inventory/category/:categoryId", inventoryByCategory);
router.get("/inventory/:vehicleId", vehicleDetail);

// Account routes
router.get("/account/register", showRegistration);
router.post("/account/register", registerUser);

router.get("/account/login", showLogin);
router.post("/account/login", loginUser);

router.post("/account/logout", logoutUser);

// Require authentication for the account page
router.get("/account/profile", requireLogin, accountPage);

// Allow employees and owners to access the employee dashboard.
router.get(
  "/dashboard/employee",
  requireRole("employee", "owner"),
  employeeDashboard,
);

// Allow only owners to access the owner dashboard.
router.get("/dashboard/owner", requireRole("owner"), ownerDashboard);

export default router;
