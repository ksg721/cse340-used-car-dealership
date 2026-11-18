import { Router } from "express";
import { homePage } from "./index.js";

// Create a new router instance
const router = Router();

// Home route
router.get("/", homePage);

export default router;