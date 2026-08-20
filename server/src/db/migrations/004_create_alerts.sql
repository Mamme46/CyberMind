CREATE TABLE alerts (

    id SERIAL PRIMARY KEY,

    upload_id INTEGER
        REFERENCES uploads(id)
        ON DELETE CASCADE,

    title VARCHAR(255) NOT NULL,

    description TEXT,

    severity VARCHAR(20),

    source_ip VARCHAR(50),

    username VARCHAR(100),

    status VARCHAR(20) DEFAULT 'Open',

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP

);