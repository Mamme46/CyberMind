CREATE TABLE log_events (

    id SERIAL PRIMARY KEY,

    upload_id INTEGER NOT NULL
        REFERENCES uploads(id)
        ON DELETE CASCADE,

    event_time TIMESTAMP,

    hostname VARCHAR(255),

    source VARCHAR(100),

    source_ip VARCHAR(50),

    destination_ip VARCHAR(50),

    username VARCHAR(100),

    event_type VARCHAR(100),

    severity VARCHAR(20),

    message TEXT,

    raw_log TEXT NOT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    service VARCHAR(50)

);