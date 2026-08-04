const { pool } = require("../config/database");

class ChatSession {

    static async create(userId) {

        const { rows } = await pool.query(

            `
                INSERT INTO chat_sessions(user_id)
                VALUES($1)
                RETURNING *
            `,

            [userId]

        );

        return rows[0];

    }

    static async findByUser(userId) {

        const { rows } = await pool.query(

            `
                SELECT *
                FROM chat_sessions
                WHERE user_id=$1
                ORDER BY created_at DESC
            `,

            [userId]

        );

        return rows;

    }

}

module.exports = ChatSession;