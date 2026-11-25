import bcrypt from "bcrypt";
import { createUser, getUserByEmail } from "../../models/users/users.js";

// Display the registration form
const showRegistration = (req, res) => {
  res.render("forms/registration/form", {
    title: "Create an Account",
    errors: [],
    formData: {},
  });
};

// Process a registration form submission
const registerUser = async (req, res, next) => {
  try {
    const firstName = req.body.firstName?.trim();
    const lastName = req.body.lastName?.trim();
    const email = req.body.email?.trim().toLowerCase();
    const password = req.body.password || "";
    const confirmPassword = req.body.confirmPassword || "";

    const errors = [];

    // Validate the required registration fields
    if (!firstName) {
      errors.push("First name is required.");
    }

    if (!lastName) {
      errors.push("Last name is required.");
    }

    if (!email || !email.includes("@")) {
      errors.push("A valid email address is required.");
    }

    if (password.length < 8) {
      errors.push("Password must be at least 8 characters long.");
    }

    if (password !== confirmPassword) {
      errors.push("Passwords must match.");
    }

    if (errors.length > 0) {
      return res.status(400).render("forms/registration/form", {
        title: "Create an Account",
        errors,
        formData: {
          firstName,
          lastName,
          email,
        },
      });
    }

    // Prevent duplicate email addresses
    const existingUser = await getUserByEmail(email);

    if (existingUser) {
      return res.status(400).render("forms/registration/form", {
        title: "Create an Account",
        errors: ["An account with that email already exists."],
        formData: {
          firstName,
          lastName,
          email,
        },
      });
    }

    // Store only a bcrypt password hash
    const passwordHash = await bcrypt.hash(password, 12);

    await createUser({
      firstName,
      lastName,
      email,
      passwordHash,
      role: "user",
    });

    // Send the new user to the Login page
    res.redirect("/account/login?registered=true");
  } catch (error) {
    next(error);
  }
};

export { showRegistration, registerUser };
