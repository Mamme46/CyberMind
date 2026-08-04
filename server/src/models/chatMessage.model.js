const { pool } = require("../config/database");

class ChatMessage {

    static async create(sessionId, role, content) {

        const { rows } = await pool.query(

            `
                INSERT INTO chat_messages(
                    session_id,
                    role,
                    content
                )

                VALUES($1,$2,$3)

                RETURNING *
            `,

            [sessionId, role, content]

        );

        return rows[0];

    }

    static async findBySession(sessionId) {

        const { rows } = await pool.query(

            `
                SELECT *
                FROM chat_messages
                WHERE session_id=$1
                ORDER BY created_at
            `,

            [sessionId]

        );

        return rows;

    }

}

module.exports = ChatMessage;