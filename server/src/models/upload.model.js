const pool = require("../config/database").pool;

class Upload {

    static async create(upload) {

        const query = `
        INSERT INTO uploads(
            user_id,
            original_name,
            stored_name,
            mime_type,
            file_size
        )

        VALUES($1,$2,$3,$4,$5)

        RETURNING *;
        `;

        const values = [

            upload.userId,
            upload.originalName,
            upload.storedName,
            upload.mimeType,
            upload.fileSize

        ];

        const { rows } = await pool.query(query, values);

        return rows[0];

    }

    static async findAll() {

    const { rows } = await pool.query(

        `

        SELECT

            id,

            original_name,

            uploaded_at,

            mime_type,

            file_size

        FROM uploads

        ORDER BY uploaded_at DESC

        `

    );

    return rows;

}

static async findById(id) {

    const { rows } = await pool.query(

        `

        SELECT *

        FROM uploads

        WHERE id=$1

        `,

        [id]

    );

    return rows[0];

}

}

module.exports = Upload;