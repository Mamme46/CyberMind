CREATE TABLE chat_sessions (

    id SERIAL PRIMARY KEY,

    user_id INTEGER REFERENCES users(id),

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP

);