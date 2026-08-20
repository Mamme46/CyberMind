const pool = require("../config/database").pool;

class Alert {

    static async create(alert){

        const query = `

        INSERT INTO alerts(

            upload_id,
            title,
            description,
            severity,
            source_ip,
            username

        )

        VALUES($1,$2,$3,$4,$5,$6)

        RETURNING *;

        `;

        const values=[

            alert.uploadId,
            alert.title,
            alert.description,
            alert.severity,
            alert.sourceIp,
            alert.username

        ];

        const {rows}=await pool.query(query,values);

        return rows[0];

    }

    static async findAll(){

        const {rows}=await pool.query(

            `SELECT *
             FROM alerts
             ORDER BY created_at DESC`

        );

        return rows;

    }

    static async findById(id){

    const { rows } = await pool.query(

        `SELECT *
         FROM alerts
         WHERE id = $1`,

        [id]

    );

    return rows[0];

}

static async updateStatus(id, status) {

    const { rows } = await pool.query(

        `

        UPDATE alerts

        SET status = $1

        WHERE id = $2

        RETURNING *;

        `,

        [

            status,

            id

        ]

    );

    return rows[0];

}

}

module.exports=Alert;