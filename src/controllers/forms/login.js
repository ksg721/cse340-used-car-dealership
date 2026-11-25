import bcrypt from "bcrypt";
import { getUserByEmail } from "../../models/users/users.js";

// Display the Login form
const showLogin = (req, res) => {
  const message = req.query.registered
    ? "Your account was created. Please log in."
    : null;

  res.render("forms/login/form", {
    title: "Log In",
    errors: [],
    message,
  });
};

// Process a Login form submission
const loginUser = async (req, res, next) => {
  try {
    const email = req.body.email?.trim().toLowerCase();
    const password = req.body.password || "";

    if (!email || !password) {
      return res.status(400).render("forms/login/form", {
        title: "Log In",
        errors: ["Email and password are required."],
        message: null,
      });
    }

    const user = await getUserByEmail(email);

    // Use one generic error for invalid credentials
    if (!user) {
      return res.status(401).render("forms/login/form", {
        title: "Log In",
        errors: ["Email or password is incorrect."],
        message: null,
      });
    }

    const passwordMatches = await bcrypt.compare(password, user.passwordHash);

    if (!passwordMatches) {
      return res.status(401).render("forms/login/form", {
        title: "Log In",
        errors: ["Email or password is incorrect."],
        message: null,
      });
    }

    // Regenerate the session after successful authentication
    req.session.regenerate((sessionError) => {
      if (sessionError) {
        return next(sessionError);
      }

      // Store only safe user information in the session
      req.session.user = {
        userId: user.userId,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
      };

      req.session.save((saveError) => {
        if (saveError) {
          return next(saveError);
        }

        res.redirect("/");
      });
    });
  } catch (error) {
    next(error);
  }
};

// Log the current user out
const logoutUser = (req, res, next) => {
  req.session.destroy((error) => {
    if (error) {
      return next(error);
    }

    res.clearCookie("connect.sid");
    res.redirect("/");
  });
};

export { showLogin, loginUser, logoutUser };
