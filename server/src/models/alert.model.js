const { pool } = require("../config/database");

class Alert {

    static async create(alert) {

        const query = `
            INSERT INTO alerts(
                log_event_id,
                title,
                description,
                severity,
                status
            )

            VALUES($1,$2,$3,$4,$5)

            RETURNING *;
        `;

        const values = [

            alert.log_event_id,
            alert.title,
            alert.description,
            alert.severity,
            alert.status

        ];

        const { rows } = await pool.query(query, values);

        return rows[0];

    }

    static async findAll() {

        const { rows } = await pool.query(

            "SELECT * FROM alerts ORDER BY created_at DESC"

        );

        return rows;

    }

    static async updateStatus(id, status) {

        const { rows } = await pool.query(

            `
                UPDATE alerts
                SET status=$1
                WHERE id=$2
                RETURNING *
            `,

            [status, id]

        );

        return rows[0];

    }

}

module.exports = Alert;