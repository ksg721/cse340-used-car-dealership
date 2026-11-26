/**
 * Middleware for global template variables.
 */

const setHeadAssetsFunctionality = (res) => {
  // Store styles registered by route middleware.
  res.locals.styles = [];

  // Add a stylesheet to the current page
  res.addStyle = (css) => {
    res.locals.styles.push(css);
  };

  // Output the styles registered for the current page.
  res.locals.renderStyles = () => {
    return res.locals.styles.join("\n");
  };
};

const addLocalVariables = (req, res, next) => {
  // Set the current year for use in templates
  res.locals.currentYear = new Date().getFullYear();

  // Make the current environment available to templates
  res.locals.NODE_ENV = process.env.NODE_ENV?.toLowerCase() || "development";

  // Make the Logged-in user available to all EJS views
  res.locals.currentUser = req.session.user || null;

  // Set up dynamic stylesheet loading.
  setHeadAssetsFunctionality(res);

  next();
};

export { addLocalVariables };
