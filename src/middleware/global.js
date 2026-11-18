/**
 * Middleware for global template variables.
 */
const addLocalVariables = (req, res, next) => {
    // Set the current year for use in templates.
    res.locals.currentYear = new Date().getFullYear();

    // Make the current environment available to templates.
    res.locals.NODE_ENV = process.env.NODE_ENV?.toLowerCase() || "development";

    next();
};

export { addLocalVariables }
