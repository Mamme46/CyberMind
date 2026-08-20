const pool = require("../config/database").pool;

class AIConversation {

    static async create(userId, title = "New Conversation") {

        const { rows } = await pool.query(

            `

            INSERT INTO ai_conversations(

                user_id,

                title

            )

            VALUES($1,$2)

            RETURNING *

            `,

            [

                userId,

                title

            ]

        );

        return rows[0];

    }

    static async findAllByUser(userId) {

        const { rows } = await pool.query(

            `

            SELECT *

            FROM ai_conversations

            WHERE user_id=$1

            ORDER BY updated_at DESC

            `,

            [

                userId

            ]

        );

        return rows;

    }

    static async findById(id) {

        const { rows } = await pool.query(

            `

            SELECT *

            FROM ai_conversations

            WHERE id=$1

            `,

            [

                id

            ]

        );

        return rows[0];

    }

    static async updateTitle(id, title) {

        const { rows } = await pool.query(

            `

            UPDATE ai_conversations

            SET

                title=$1,

                updated_at=CURRENT_TIMESTAMP

            WHERE id=$2

            RETURNING *

            `,

            [

                title,

                id

            ]

        );

        return rows[0];

    }

    static async touch(id) {

        await pool.query(

            `

            UPDATE ai_conversations

            SET updated_at=CURRENT_TIMESTAMP

            WHERE id=$1

            `,

            [

                id

            ]

        );

    }

    static async delete(id) {

        await pool.query(

            `

            DELETE

            FROM ai_conversations

            WHERE id=$1

            `,

            [

                id

            ]

        );

    }

}

module.exports = AIConversation;