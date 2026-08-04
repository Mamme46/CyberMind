CREATE TABLE log_events (

    id SERIAL PRIMARY KEY,

    upload_id INTEGER REFERENCES uploads(id) ON DELETE CASCADE,

    timestamp TIMESTAMP,

    hostname VARCHAR(255),

    source_ip VARCHAR(50),

    destination_ip VARCHAR(50),

    event_type VARCHAR(100),

    severity VARCHAR(20),

    message TEXT,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP

);