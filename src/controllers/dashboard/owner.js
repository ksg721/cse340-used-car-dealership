// Display the owner dashboard.
const ownerDashboard = (req, res) => {
  res.render("dashboard/owner", {
    title: "Owner Dashboard",
  });
};

export { ownerDashboard };
