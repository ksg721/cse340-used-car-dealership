BEGIN;

-- Add test users for each required role.
INSERT INTO users (
    first_name,
    last_name,
    email,
    password_hash,
    role
)
VALUES
    (
        'Site',
        'Owner',
        'owner@usedcars.test',
        '$2b$12$IRGYk19zWma8Jc4zkP0F6uJixs/o7fKawmxadUkdqEFTQ0KB0u9SW',
        'owner'
    ),
    (
        'Service',
        'Employee',
        'employee@usedcars.test',
        '$2b$12$LFrQLvgGF1cKZ.qX/QFxG.ljTsMZXNPx4KE/cmOMvXHojBfcqRG9q',
        'employee'
    ),
    (
        'Standard',
        'User',
        'user@usedcars.test',
        '$2b$12$1uYqHyJeE0MjHkfGU0owpeN/.pGYumUzoL/Yk.l9YZx.Y7Jrlk6eC',
        'user'
    )
ON CONFLICT (email) DO NOTHING;

INSERT INTO categories (name, description)
VALUES
    ('Cars', 'Sedans, coupes, and compact cars.'),
    ('SUVs', 'Sport utility vehicles and crossover vehicles.'),
    ('Trucks', 'Pickup trucks and work trucks.'),
    ('Vans', 'Passenger and cargo vans.')
ON CONFLICT (name) DO NOTHING;

INSERT INTO vehicles (
    category_id,
    year,
    make,
    model,
    price,
    mileage,
    color,
    description,
    is_available,
    is_featured
)
SELECT
    category_id,
    2022,
    'Toyota',
    'Camry',
    24995.00,
    32500,
    'Silver',
    'Reliable sedan with excellent fuel economy.',
    TRUE,
    TRUE
FROM categories
WHERE name = 'Cars'
AND NOT EXISTS (
    SELECT 1
    FROM vehicles
    WHERE make = 'Toyota'
    AND model = 'Camry'
    AND year = 2022
);

INSERT INTO vehicles (
    category_id,
    year,
    make,
    model,
    price,
    mileage,
    color,
    description,
    is_available,
    is_featured
)
SELECT
    category_id,
    2021,
    'Ford',
    'F-150',
    38995.00,
    41000,
    'Blue',
    'Full-size pickup truck ready for work or recreation.',
    TRUE,
    TRUE
FROM categories
WHERE name = 'Trucks'
AND NOT EXISTS (
    SELECT 1
    FROM vehicles
    WHERE make = 'Ford'
    AND model = 'F-150'
    AND year = 2021
);

INSERT INTO vehicles (
    category_id,
    year,
    make,
    model,
    price,
    mileage,
    color,
    description,
    is_available,
    is_featured
)
SELECT
    category_id,
    2023,
    'Honda',
    'CR-V',
    31995.00,
    18500,
    'White',
    'Comfortable SUV with modern safety features.',
    TRUE,
    TRUE
FROM categories
WHERE name = 'SUVs'
AND NOT EXISTS (
    SELECT 1
    FROM vehicles
    WHERE make = 'Honda'
    AND model = 'CR-V'
    AND year = 2023
);

INSERT INTO vehicle_images (
    vehicle_id,
    image_url,
    alt_text,
    display_order
)
SELECT
    vehicle_id,
    '/images/toyota-camry.jpg',
    'Silver Toyota Camry',
    1
FROM vehicles
WHERE make = 'Toyota'
AND model = 'Camry'
AND year = 2022
AND NOT EXISTS (
    SELECT 1
    FROM vehicle_images
    WHERE vehicle_id = vehicles.vehicle_id
);

INSERT INTO vehicle_images (
    vehicle_id,
    image_url,
    alt_text,
    display_order
)
SELECT
    vehicle_id,
    '/images/ford-f150.jpg',
    'Blue Ford F-150',
    1
FROM vehicles
WHERE make = 'Ford'
AND model = 'F-150'
AND year = 2021
AND NOT EXISTS (
    SELECT 1
    FROM vehicle_images
    WHERE vehicle_id = vehicles.vehicle_id
);

INSERT INTO vehicle_images (
    vehicle_id,
    image_url,
    alt_text,
    display_order
)
SELECT
    vehicle_id,
    '/images/honda-crv.jpg',
    'White Honda CR-V',
    1
FROM vehicles
WHERE make = 'Honda'
AND model = 'CR-V'
AND year = 2023
AND NOT EXISTS (
    SELECT 1
    FROM vehicle_images
    WHERE vehicle_id = vehicles.vehicle_id
);

-- Add starter reviews for an existing user and vehicle.
INSERT INTO reviews (
    user_id,
    vehicle_id,
    rating,
    review_text,
    is_approved
)
SELECT
    u.user_id,
    v.vehicle_id,
    5,
    'Excellent vehicle and great overall experience.',
    TRUE
FROM users u
JOIN vehicles v
    ON v.make = 'Toyota'
    AND v.model = 'Camry'
WHERE u.email = 'user@usedcars.test'
  AND NOT EXISTS (
      SELECT 1
      FROM reviews r
      WHERE r.user_id = u.user_id
        AND r.vehicle_id = v.vehicle_id
  );

  -- Add a starter service request for the standard user.
INSERT INTO service_requests (
    user_id,
    vehicle_id,
    service_type,
    description,
    status
)
SELECT
    u.user_id,
    v.vehicle_id,
    'General Inspection',
    'Please inspect the vehicle before purchase.',
    'Submitted'
FROM users u
JOIN vehicles v
    ON v.make = 'Toyota'
    AND v.model = 'Camry'
WHERE u.email = 'user@usedcars.test'
  AND NOT EXISTS (
      SELECT 1
      FROM service_requests sr
      WHERE sr.user_id = u.user_id
        AND sr.vehicle_id = v.vehicle_id
        AND sr.service_type = 'General Inspection'
  );

  -- Record the original status of the starter service request.
INSERT INTO service_request_history (
    service_request_id,
    changed_by_user_id,
    old_status,
    new_status,
    note
)
SELECT
    sr.service_request_id,
    u.user_id,
    NULL,
    'Submitted',
    'Service request was submitted.'
FROM service_requests sr
JOIN users u
    ON u.email = 'employee@usedcars.test'
JOIN users request_user
    ON request_user.user_id = sr.user_id
WHERE request_user.email = 'user@usedcars.test'
  AND sr.service_type = 'General Inspection'
  AND NOT EXISTS (
      SELECT 1
      FROM service_request_history srh
      WHERE srh.service_request_id = sr.service_request_id
        AND srh.new_status = 'Submitted'
  );

  -- Add a starter contact message from a potential customer.
INSERT INTO contact_messages (
    name,
    email,
    subject,
    message,
    status
)
SELECT
    'Demo Customer',
    'customer@example.com',
    'Question About Available Vehicles',
    'I would like to know which vehicles are currently available.',
    'Received'
WHERE NOT EXISTS (
    SELECT 1
    FROM contact_messages
    WHERE email = 'customer@example.com'
      AND subject = 'Question About Available Vehicles'
);

-- Record starter activity for the dealership dashboard.
INSERT INTO activity_log (
    user_id,
    action,
    entity_type,
    entity_id,
    details
)
SELECT
    u.user_id,
    'Created starter vehicle',
    'vehicle',
    v.vehicle_id,
    'Starter vehicle data was added to the dealership.'
FROM users u
JOIN vehicles v
    ON v.make = 'Toyota'
    AND v.model = 'Camry'
WHERE u.email = 'owner@usedcars.test'
  AND NOT EXISTS (
      SELECT 1
      FROM activity_log al
      WHERE al.user_id = u.user_id
        AND al.action = 'Created starter vehicle'
        AND al.entity_type = 'vehicle'
        AND al.entity_id = v.vehicle_id
  );

INSERT INTO activity_log (
    user_id,
    action,
    entity_type,
    entity_id,
    details
)
SELECT
    u.user_id,
    'Created starter service request',
    'service_request',
    sr.service_request_id,
    'Starter service request data was added.'
FROM users u
JOIN service_requests sr
    ON sr.service_type = 'General Inspection'
WHERE u.email = 'employee@usedcars.test'
  AND NOT EXISTS (
      SELECT 1
      FROM activity_log al
      WHERE al.user_id = u.user_id
        AND al.action = 'Created starter service request'
        AND al.entity_type = 'service_request'
        AND al.entity_id = sr.service_request_id
  );

COMMIT;