/**
 * Require a logged-in user for protected routes.
 */
const requireLogin = (req, res, next) => {
  // Redirect users who are not logged in.
  if (!req.session || !req.session.user) {
    return res.redirect("/account/login");
  }

  next();
};

/**
 * Require one of the specified roles for a protected route.
 */
const requireRole = (...allowedRoles) => {
  return (req, res, next) => {
    // Redirect users who are not logged in.
    if (!req.session || !req.session.user) {
      return res.redirect("/account/login");
    }

    // Redirect logged-in users without permission.
    if (!allowedRoles.includes(req.session.user.role)) {
      return res.redirect("/");
    }

    next();
  };
};

export { requireLogin, requireRole };
