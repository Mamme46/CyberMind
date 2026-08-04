CREATE TABLE chat_messages (

    id SERIAL PRIMARY KEY,

    session_id INTEGER REFERENCES chat_sessions(id) ON DELETE CASCADE,

    role VARCHAR(20),

    content TEXT,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP

);