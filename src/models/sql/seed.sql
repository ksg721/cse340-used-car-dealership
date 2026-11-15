BEGIN;

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

COMMIT;