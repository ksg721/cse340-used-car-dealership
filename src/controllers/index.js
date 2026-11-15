// Render the temp home page
const homePage = (req, res) => {
    res.render("home", {
        title:"Coming Soon"
    });
};

export { homePage };