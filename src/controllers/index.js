import { getFeaturedVehicles } from "../models/inventory/inventory.js";

// Display the home page with featured vehicles.
const homePage = async (req, res, next) => {
  try {
    const featuredVehicles = await getFeaturedVehicles();

    res.render("home", {
      title: "Used Car Dealership",
      featuredVehicles,
      currentYear: new Date().getFullYear(),
    });
  } catch (error) {
    next(error);
  }
};

export { homePage };
