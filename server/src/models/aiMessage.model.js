const pool = require("../config/database").pool;

class AIMessage {

    static async create(

        conversationId,

        role,

        content

    ) {

        const { rows } = await pool.query(

            `

            INSERT INTO ai_messages(

                conversation_id,

                role,

                content

            )

            VALUES($1,$2,$3)

            RETURNING *

            `,

            [

                conversationId,

                role,

                content

            ]

        );

        return rows[0];

    }

    static async findByConversation(

        conversationId

    ) {

        const { rows } = await pool.query(

            `

            SELECT *

            FROM ai_messages

            WHERE conversation_id=$1

            ORDER BY created_at ASC

            `,

            [

                conversationId

            ]

        );

        return rows;

    }

}

module.exports = AIMessage;