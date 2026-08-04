CREATE TABLE alerts (

    id SERIAL PRIMARY KEY,

    log_event_id INTEGER REFERENCES log_events(id),

    title VARCHAR(255),

    description TEXT,

    severity VARCHAR(20),

    status VARCHAR(20) DEFAULT 'Open',

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP

);