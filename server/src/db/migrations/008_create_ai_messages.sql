CREATE TABLE ai_messages (

    id SERIAL PRIMARY KEY,

    conversation_id INTEGER NOT NULL
        REFERENCES ai_conversations(id)
        ON DELETE CASCADE,

    role VARCHAR(20) NOT NULL,

    content TEXT NOT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP

);