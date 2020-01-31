CREATE TABLE IF NOT EXISTS
    users(
        id UUID PRIMARY KEY,
        name VARCHAR(128) UNIQUE NOT NULL,
        username VARCHAR(128) UNIQUE NOT NULL,
        email VARCHAR(128) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        is_active boolean, 
        created_date TIMESTAMP,
        modified_date TIMESTAMP
    )