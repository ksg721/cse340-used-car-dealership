// Route handler for the home page.
const homePage = (req, res) => {
    res.render("home", {
        title: "Coming Soon",

        // Provide current year to footer
        currentYear: new Date().getFullYear()
    });
};

export { homePage };
