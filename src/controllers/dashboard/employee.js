// Display the employee dashboard.
const employeeDashboard = (req, res) => {
  res.render("dashboard/employee", {
    title: "Employee Dashboard",
  });
};

export { employeeDashboard };
