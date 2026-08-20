CREATE TABLE reports (

    id SERIAL PRIMARY KEY,

    alert_id INTEGER NOT NULL
        REFERENCES alerts(id)
        ON DELETE CASCADE,

    title VARCHAR(255),

    content TEXT NOT NULL,

    model VARCHAR(100),

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP

);