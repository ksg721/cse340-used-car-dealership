BEGIN;

CREATE TABLE IF NOT EXISTS users (
    user_id SERIAL PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'user',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT users_role_check
        CHECK (role IN ('owner', 'employee', 'user'))
);

CREATE TABLE IF NOT EXISTS categories (
    category_id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS vehicles (
    vehicle_id SERIAL PRIMARY KEY,
    category_id INTEGER NOT NULL,
    year INTEGER NOT NULL,
    make VARCHAR(100) NOT NULL,
    model VARCHAR(100) NOT NULL,
    price NUMERIC(12, 2) NOT NULL,
    mileage INTEGER NOT NULL,
    color VARCHAR(50),
    description TEXT,
    is_available BOOLEAN NOT NULL DEFAULT TRUE,
    is_featured BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT vehicles_category_fk
        FOREIGN KEY (category_id)
        REFERENCES categories(category_id)
        ON DELETE RESTRICT,

    CONSTRAINT vehicles_year_check
        CHECK (year >= 1886),

    CONSTRAINT vehicles_price_check
        CHECK (price >= 0),

    CONSTRAINT vehicles_mileage_check
        CHECK (mileage >= 0)
);

CREATE TABLE IF NOT EXISTS vehicle_images (
    image_id SERIAL PRIMARY KEY,
    vehicle_id INTEGER NOT NULL,
    image_url TEXT NOT NULL,
    alt_text VARCHAR(255),
    display_order INTEGER NOT NULL DEFAULT 1,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT vehicle_images_vehicle_fk
        FOREIGN KEY (vehicle_id)
        REFERENCES vehicles(vehicle_id)
        ON DELETE CASCADE,

    CONSTRAINT vehicle_images_display_order_check
        CHECK (display_order > 0)
);

CREATE TABLE IF NOT EXISTS reviews (
    review_id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    vehicle_id INTEGER NOT NULL,
    rating INTEGER NOT NULL,
    review_text TEXT NOT NULL,
    is_approved BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT reviews_user_fk
        FOREIGN KEY (user_id)
        REFERENCES users(user_id)
        ON DELETE CASCADE,

    CONSTRAINT reviews_vehicle_fk
        FOREIGN KEY (vehicle_id)
        REFERENCES vehicles(vehicle_id)
        ON DELETE CASCADE,

    CONSTRAINT reviews_rating_check
        CHECK (rating BETWEEN 1 AND 5),

    CONSTRAINT reviews_text_check
        CHECK (LENGTH(TRIM(review_text)) > 0),

    CONSTRAINT reviews_user_vehicle_unique
        UNIQUE (user_id, vehicle_id)
);

CREATE TABLE IF NOT EXISTS service_requests (
    service_request_id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    vehicle_id INTEGER,
    service_type VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'Submitted',
    employee_notes TEXT,
    submitted_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP,

    CONSTRAINT service_requests_user_fk
        FOREIGN KEY (user_id)
        REFERENCES users(user_id)
        ON DELETE CASCADE,

    CONSTRAINT service_requests_vehicle_fk
        FOREIGN KEY (vehicle_id)
        REFERENCES vehicles(vehicle_id)
        ON DELETE SET NULL,

    CONSTRAINT service_requests_status_check
        CHECK (status IN ('Submitted', 'In Progress', 'Completed')),

    CONSTRAINT service_requests_type_check
        CHECK (LENGTH(TRIM(service_type)) > 0)
);

CREATE TABLE IF NOT EXISTS service_request_history (
    history_id SERIAL PRIMARY KEY,
    service_request_id INTEGER NOT NULL,
    changed_by_user_id INTEGER,
    old_status VARCHAR(30),
    new_status VARCHAR(30) NOT NULL,
    note TEXT,
    changed_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT service_history_request_fk
        FOREIGN KEY (service_request_id)
        REFERENCES service_requests(service_request_id)
        ON DELETE CASCADE,

    CONSTRAINT service_history_user_fk
        FOREIGN KEY (changed_by_user_id)
        REFERENCES users(user_id)
        ON DELETE SET NULL,

    CONSTRAINT service_history_new_status_check
        CHECK (new_status IN ('Submitted', 'In Progress', 'Completed')),

    CONSTRAINT service_history_old_status_check
        CHECK (
            old_status IS NULL
            OR old_status IN ('Submitted', 'In Progress', 'Completed')
        )
);

CREATE TABLE IF NOT EXISTS contact_messages (
    contact_message_id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    email VARCHAR(255) NOT NULL,
    subject VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'Received',
    response TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT contact_messages_status_check
        CHECK (status IN ('Received', 'Replied', 'Closed'))
);

CREATE TABLE IF NOT EXISTS activity_log (
    activity_id SERIAL PRIMARY KEY,
    user_id INTEGER,
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(100),
    entity_id INTEGER,
    details TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT activity_log_user_fk
        FOREIGN KEY (user_id)
        REFERENCES users(user_id)
        ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS vehicles_category_id_index
    ON vehicles(category_id);

CREATE INDEX IF NOT EXISTS vehicle_images_vehicle_id_index
    ON vehicle_images(vehicle_id);

CREATE INDEX IF NOT EXISTS reviews_vehicle_id_index
    ON reviews(vehicle_id);

CREATE INDEX IF NOT EXISTS service_requests_user_id_index
    ON service_requests(user_id);

CREATE INDEX IF NOT EXISTS service_requests_vehicle_id_index
    ON service_requests(vehicle_id);

CREATE INDEX IF NOT EXISTS service_requests_status_index
    ON service_requests(status);

CREATE INDEX IF NOT EXISTS activity_log_user_id_index
    ON activity_log(user_id);

COMMIT;