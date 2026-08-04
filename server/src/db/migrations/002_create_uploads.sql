CREATE TABLE uploads (

    id SERIAL PRIMARY KEY,

    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,

    original_name VARCHAR(255) NOT NULL,

    stored_name VARCHAR(255) NOT NULL,

    mime_type VARCHAR(100) NOT NULL,

    file_size BIGINT NOT NULL,

    file_hash VARCHAR(64),

    parser_status VARCHAR(30) DEFAULT 'pending',

    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP

);