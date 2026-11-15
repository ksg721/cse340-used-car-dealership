# CSE 340 Used Car Dealership Project Plan

This plan is for Option B of the CSE 340 Final Project: Used Car Dealership.
It follows the organization used in `cse340-practice-green`, the MVC assignments,
Units 1-4, and the final project requirements.

## Course progression

- Unit 1: Express, ESM, routing, EJS, static assets, and Nodemon
- Unit 2: route parameters, middleware, errors, and MVC
- Unit 3: PostgreSQL, CRUD, forms, sessions, validation, and bcrypt
- Unit 4: flash messages, role-based access, deployment, and refactoring

Course material:

- [Unit 1](https://byui-cse.github.io/cse340-course/unit/1/index.html)
- [Unit 2](https://byui-cse.github.io/cse340-course/unit/2/index.html)
- [Unit 3](https://byui-cse.github.io/cse340-course/unit/3/index.html)
- [Unit 4](https://byui-cse.github.io/cse340-course/unit/4/index.html)

## Milestone 1: Confirm the development environment

1. Verify Node.js is installed.
2. Verify pnpm is installed.
3. Verify Git is installed.
4. Install PostgreSQL locally.
5. Install or confirm pgAdmin is available.
6. Create a local PostgreSQL database for the dealership.
7. Confirm the database connection through pgAdmin.
8. Confirm the project starts with `pnpm run dev`.
9. Confirm `.env` is ignored by Git.
10. Keep the instructor-required Render build command:

    ```text
    pnpm install --dangerously-allow-all-builds
    ```

11. Remove the conflicting `pnpm-workspace.yaml` file if the project is not using pnpm workspaces.
12. Commit the working environment setup.

Suggested commit:

```text
chore: prepare project development environment
```

## Milestone 2: Install and verify required packages

1. Confirm Express is installed.
2. Confirm EJS is installed.
3. Confirm the PostgreSQL `pg` package is installed.
4. Install `bcrypt`.
5. Install `express-session`.
6. Install `connect-pg-simple`.
7. Install `express-validator`.
8. Confirm Nodemon is installed.
9. Keep WebSockets only if using the course live-reload setup.
10. Run a clean dependency installation.
11. Start the server again.
12. Commit the dependency setup.

Suggested commit:

```text
chore: add authentication session and validation dependencies
```

## Milestone 3: Establish the course MVC structure

1. Keep `server.js` at the project root.
2. Make `server.js` responsible only for server configuration.
3. Configure the `public` directory.
4. Configure EJS.
5. Configure `src/views` as the view directory.
6. Import `src/controllers/routes.js` into `server.js`.
7. Import global middleware from `src/middleware/global.js`.
8. Create the home controller in `src/controllers/index.js`.
9. Create the main router in `src/controllers/routes.js`.
10. Create `src/views/home.ejs`.
11. Create header and footer partials.
12. Render the home page through a controller.
13. Remove the direct placeholder route from `server.js`.
14. Confirm the home page works.
15. Commit the MVC foundation.

Suggested commit:

```text
feat: establish course MVC application structure
```

## Milestone 4: Add global middleware and error handling

1. Add URL-encoded form parsing.
2. Add JSON body parsing.
3. Create `src/middleware/global.js`.
4. Add common template variables through `res.locals`.
5. Create a 404 error view.
6. Create a 500 error view.
7. Add a 404 handler.
8. Add a centralized error handler.
9. Hide detailed errors in production.
10. Show useful errors during development.
11. Test an invalid URL.
12. Test a forced server error.
13. Commit error handling.

Suggested commit:

```text
feat: add global middleware and centralized error handling
```

## Milestone 5: Design the database before writing models

Required tables:

```text
users
categories
vehicles
vehicle_images
reviews
service_requests
contact_messages
activity_log
```

1. Design the `users` table.
2. Add a `role` column.
3. Support `owner`, `employee`, and `user` roles.
4. Design the `categories` table.
5. Design the `vehicles` table.
6. Connect each vehicle to a category.
7. Design the `vehicle_images` table.
8. Connect images to vehicles with a one-to-many relationship.
9. Design the `reviews` table.
10. Connect reviews to users and vehicles.
11. Design the `service_requests` table.
12. Connect service requests to users.
13. Connect service requests to vehicles.
14. Add a service-request status column.
15. Design the `contact_messages` table.
16. Design the `activity_log` table.
17. Choose appropriate PostgreSQL data types.
18. Define primary keys.
19. Define foreign keys.
20. Decide where `CASCADE` or `SET NULL` is appropriate.
21. Decide which columns are required.
22. Add timestamps.
23. Export the ERD from pgAdmin.
24. Save it as `docs/erd.png`.
25. Commit the database design.

Suggested commit:

```text
feat: design dealership relational database schema
```

## Milestone 6: Create the database schema and seed data

1. Write table definitions in `src/models/sql/dealership.sql`.
2. Create the tables in dependency order.
3. Add foreign-key constraints.
4. Add service-request status values.
5. Add starter categories.
6. Add starter vehicles.
7. Add vehicle image records.
8. Add test users.
9. Hash test-user passwords with bcrypt.
10. Add at least one owner account.
11. Add at least one employee account.
12. Add at least one standard user account.
13. Add starter reviews.
14. Add starter service requests.
15. Add starter contact messages.
16. Record activity entries where appropriate.
17. Put repeatable starter data in `seed.sql`.
18. Run the schema from pgAdmin.
19. Run the seed data.
20. Verify relationships in pgAdmin.
21. Commit the schema and seed data.

Suggested commit:

```text
feat: add dealership database schema and seed data
```

## Milestone 7: Create the PostgreSQL model layer

1. Configure the connection in `src/models/db.js`.
2. Read the database URL from environment variables.
3. Support local and Render database connections.
4. Keep database access out of controllers.
5. Create inventory model functions.
6. Create category model functions.
7. Create vehicle model functions.
8. Create vehicle-image model functions.
9. Create user model functions.
10. Create review model functions.
11. Create service-request model functions.
12. Create contact-message model functions.
13. Create activity model functions.
14. Use parameterized queries everywhere.
15. Convert database `snake_case` values to controller-friendly `camelCase`.
16. Test each model function separately.
17. Commit the model layer.

Suggested commit:

```text
feat: add PostgreSQL models for dealership data
```

## Milestone 8: Build the public vehicle pages

1. Create the inventory controller.
2. Add vehicle routes to `routes.js`.
3. Add a public vehicle-list route.
4. Add a category-filter route.
5. Add a vehicle-detail route with a parameter.
6. Retrieve vehicles from PostgreSQL.
7. Retrieve categories from PostgreSQL.
8. Retrieve vehicle images.
9. Create `src/views/inventory/list.ejs`.
10. Create `src/views/inventory/detail.ejs`.
11. Display featured vehicles on the home page.
12. Display vehicle specifications.
13. Display price and availability.
14. Display vehicle images.
15. Add a friendly not-found response.
16. Test invalid vehicle IDs.
17. Test every category.
18. Commit the public inventory pages.

Suggested commit:

```text
feat: add public vehicle inventory and detail pages
```

## Milestone 9: Build registration and authentication

1. Create the registration controller.
2. Create registration model functions.
3. Create the registration form.
4. Validate required registration fields.
5. Check for duplicate email addresses.
6. Hash passwords with bcrypt.
7. Store only password hashes.
8. Create the login controller.
9. Create the login form.
10. Compare passwords with bcrypt.
11. Create the logout route.
12. Configure `express-session`.
13. Configure PostgreSQL session storage.
14. Configure secure cookies.
15. Configure production session behavior.
16. Store the logged-in user in the session.
17. Make the current user available to EJS views.
18. Test registration.
19. Test login.
20. Test logout.
21. Test an incorrect password.
22. Commit authentication.

Suggested commit:

```text
feat: add registration login and session authentication
```

## Milestone 10: Add authentication and role middleware

1. Create authentication-checking middleware.
2. Redirect unauthenticated users to login.
3. Create role-checking middleware.
4. Protect user-only routes.
5. Protect employee-only routes.
6. Protect owner-only routes.
7. Test a logged-out user.
8. Test a standard user accessing employee pages.
9. Test an employee accessing owner pages.
10. Test an owner accessing all protected pages.
11. Commit access control.

Suggested commit:

```text
feat: add role-based route protection
```

## Milestone 11: Add flash messages

1. Configure flash-message support.
2. Add flash messages to the session.
3. Expose messages through global middleware.
4. Add a flash-message partial.
5. Display success messages after registration.
6. Display success messages after login.
7. Display error messages after failed login.
8. Display messages after validation failures.
9. Display messages after CRUD operations.
10. Commit flash messaging.

Suggested commit:

```text
feat: add session-based flash messaging
```

## Milestone 12: Add contact messages

1. Create the contact controller.
2. Create the contact model.
3. Create the contact form.
4. Validate name, email, and message.
5. Reject empty submissions.
6. Sanitize submitted values.
7. Insert messages with a parameterized query.
8. Show a success message after submission.
9. Add employee access to contact submissions.
10. Display saved submissions in the employee dashboard.
11. Add a response or status field if desired.
12. Commit contact messaging.

Suggested commit:

```text
feat: add validated contact message workflow
```

## Milestone 13: Add vehicle reviews

1. Create the review controller.
2. Create the review model.
3. Create the review form.
4. Require authentication.
5. Require a vehicle ID.
6. Require the user ID from the session.
7. Validate the rating.
8. Validate review text.
9. Save the review with a parameterized query.
10. Display reviews on vehicle detail pages.
11. Allow users to edit their own reviews.
12. Allow users to delete their own reviews.
13. Prevent users from editing another user’s review.
14. Add employee review moderation.
15. Allow employees to delete inappropriate reviews.
16. Commit review functionality.

Suggested commit:

```text
feat: add user vehicle reviews and moderation
```

## Milestone 14: Add the service-request workflow

Use these statuses:

```text
Submitted
In Progress
Completed
```

1. Create the service-request controller.
2. Create the service-request model.
3. Create the request form.
4. Require authentication.
5. Allow users to select their vehicle.
6. Allow users to select a service type.
7. Validate the request.
8. Save the request with `Submitted` status.
9. Display the user’s service-request history.
10. Display the current status.
11. Display status history.
12. Add employee access to all service requests.
13. Allow employees to update status.
14. Allow employees to add notes.
15. Prevent standard users from changing status.
16. Add flash messages after status changes.
17. Test all three workflow stages.
18. Commit the service workflow.

Suggested commit:

```text
feat: add service request status workflow
```

## Milestone 15: Build the employee dashboard

1. Create the employee controller.
2. Create the employee dashboard view.
3. Protect the dashboard with employee authorization.
4. Display operational totals.
5. Display vehicle inventory.
6. Allow employees to edit price.
7. Allow employees to edit description.
8. Allow employees to edit availability.
9. Display reviews awaiting moderation.
10. Allow employees to remove inappropriate reviews.
11. Display service requests.
12. Allow employees to update service status.
13. Allow employees to add service notes.
14. Display contact submissions.
15. Test the dashboard as an employee.
16. Test that standard users cannot access it.
17. Commit the employee dashboard.

Suggested commit:

```text
feat: add employee management dashboard
```

## Milestone 16: Build the owner dashboard

1. Create the owner controller.
2. Create the owner dashboard view.
3. Protect it with owner authorization.
4. Display all users.
5. Display user roles.
6. Add category management.
7. Add category creation.
8. Add category editing.
9. Add category deletion.
10. Add vehicle creation.
11. Add vehicle editing.
12. Add vehicle deletion.
13. Add vehicle-image management.
14. Display activity-log information.
15. Add employee-account management if included.
16. Test owner-only access.
17. Test all owner CRUD operations.
18. Commit the owner dashboard.

Suggested commit:

```text
feat: add owner inventory and account management
```

## Milestone 17: Complete validation and security

1. Validate every POST form.
2. Validate every route parameter.
3. Validate query-string filters.
4. Sanitize user input.
5. Use parameterized SQL queries.
6. Confirm no passwords are stored as plain text.
7. Confirm password fields are never displayed.
8. Confirm sessions use secure settings in production.
9. Confirm protected routes check authentication.
10. Confirm role routes check authorization.
11. Prevent users from modifying other users’ reviews.
12. Prevent users from modifying service-request status.
13. Prevent employees from performing owner-only actions.
14. Prevent system details from appearing in production errors.
15. Test malformed IDs.
16. Test missing form fields.
17. Test unauthorized requests.
18. Commit the security and validation work.

Suggested commit:

```text
fix: strengthen validation authorization and error security
```

## Milestone 18: Refactor to match the practice project

1. Keep routes in `src/controllers/routes.js`.
2. Keep basic page handlers in `src/controllers/index.js`.
3. Keep feature controllers in feature folders.
4. Keep feature models in feature folders.
5. Keep global middleware in `src/middleware/global.js`.
6. Keep forms under `src/views/forms/`.
7. Keep section views inside section folders.
8. Keep shared templates in `src/views/partials/`.
9. Use consistent naming.
10. Remove unused imports.
11. Remove commented-out experimental code.
12. Keep `server.js` limited to configuration.
13. Add dynamic section-specific CSS if using the course asset pattern.
14. Confirm every `res.render()` path matches its view file.
15. Test all routes after refactoring.
16. Commit the refactor.

Suggested commit:

```text
refactor: align project organization with course MVC patterns
```

## Milestone 19: Complete the interface

1. Create the shared header.
2. Create the navigation partial.
3. Create the footer partial.
4. Add navigation for public pages.
5. Add navigation based on the current user role.
6. Add vehicle cards.
7. Add form styling.
8. Add dashboard styling.
9. Add responsive styling.
10. Add client-side validation where appropriate.
11. Keep server-side validation regardless of client-side validation.
12. Confirm every page is rendered through EJS.
13. Confirm CSS and JavaScript load from `public/`.
14. Test desktop layout.
15. Test mobile layout.
16. Commit the interface work.

Suggested commit:

```text
feat: complete server-rendered dealership interface
```

## Milestone 20: Complete the README and documentation

The README must include:

1. Project description.
2. Intended users.
3. Database schema.
4. ERD image.
5. Explanation of the owner role.
6. Explanation of the employee role.
7. Explanation of the standard-user role.
8. Test account username or email for each role.
9. Do not include test passwords.
10. State that all test accounts use the instructor-required password.
11. Known limitations.
12. Local setup instructions.
13. Environment-variable instructions.
14. Local database setup instructions.
15. Deployment URL.
16. GitHub repository URL.
17. Major application features.

Commit:

```text
docs: document dealership setup roles schema and limitations
```

## Milestone 21: Test the complete application

### Logged-out visitor

1. Home page loads.
2. Featured vehicles display.
3. Category browsing works.
4. Vehicle detail pages work.
5. Vehicle images display.
6. Contact form loads.
7. Invalid pages show a 404 page.

### Standard user

1. Registration works.
2. Login works.
3. Logout works.
4. Reviews can be created.
5. Own reviews can be edited.
6. Own reviews can be deleted.
7. Other users’ reviews cannot be changed.
8. Service requests can be submitted.
9. Service history displays.
10. Service status displays.
11. Contact messages can be submitted.

### Employee

1. Employee dashboard loads.
2. Vehicle details can be edited.
3. Reviews can be moderated.
4. Service requests can be viewed.
5. Status can be updated.
6. Notes can be added.
7. Contact messages can be viewed.
8. Owner-only pages are blocked.

### Owner

1. Owner dashboard loads.
2. Categories can be created.
3. Categories can be edited.
4. Categories can be deleted.
5. Vehicles can be added.
6. Vehicles can be edited.
7. Vehicles can be deleted.
8. Users and roles can be viewed.
9. Activity data can be viewed.

Commit:

```text
test: verify public user employee and owner workflows
```

## Milestone 22: Deploy to Render

1. Push the complete project to GitHub.
2. Confirm the correct branch is pushed.
3. Create or connect the Render web service.
4. Use the instructor-required build command:

    ```text
    pnpm install --dangerously-allow-all-builds
    ```

5. Use this start command:

    ```text
    pnpm start
    ```

6. Add the production PostgreSQL database.
7. Add the production database URL as an environment variable.
8. Add the session secret.
9. Add the production environment setting.
10. Confirm `.env` is not uploaded.
11. Confirm the application uses Render’s `PORT`.
12. Confirm development-only WebSocket behavior is disabled in production.
13. Run the Render deployment.
14. Check the deployment logs.
15. Test the live home page.
16. Test the live login.
17. Test the live database connection.
18. Test a live form submission.
19. Test a live employee workflow.
20. Test a live owner workflow.
21. Record the live URL in the README.
22. Commit deployment documentation.

Suggested commit:

```text
deploy: configure Render production deployment
```

## Milestone 23: Confirm the commit-history requirement

The project needs at least 15 substantial commits. A recommended sequence is:

1. Environment setup
2. Dependency setup
3. MVC foundation
4. Error handling
5. Database design
6. Database schema
7. PostgreSQL models
8. Public inventory
9. Authentication
10. Role authorization
11. Flash messaging
12. Contact workflow
13. Review system
14. Service-request workflow
15. Employee dashboard
16. Owner dashboard
17. Security refactor
18. Interface completion
19. Documentation
20. Testing and deployment

Avoid many tiny commits such as “fix typo” or “add one line.” Each commit should represent a working feature or meaningful refactor.

## Required final outcome

The completed project should be a live, server-rendered used-car dealership application with:

- Express and EJS
- ESM syntax only
- PostgreSQL
- Multiple related tables
- Foreign keys and normalized data
- Owner, employee, and standard-user roles
- Session-based authentication
- Bcrypt password hashing
- Protected routes
- Public vehicle browsing
- Vehicle details and images
- User reviews with ownership controls
- Contact form stored in the database
- Service requests with status tracking
- Employee dashboard
- Owner dashboard
- Validation and sanitization
- Parameterized queries
- Centralized error handling
- Flash messages
- Render deployment
- Connected production PostgreSQL database
- README documentation
- ERD image
- At least 15 substantial Git commits

The application is complete only when each role can perform its intended actions, the database persists the data, the live Render deployment works, and the repository demonstrates the MVC and backend concepts from Units 1-4.
