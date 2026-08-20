const pool = require("../config/database").pool;

class Report {

    static async create(report) {

        const { rows } = await pool.query(

            `

            INSERT INTO reports(

                alert_id,

                title,

                content,

                model

            )

            VALUES($1,$2,$3,$4)

            RETURNING *;

            `,

            [

                report.alertId,

                report.title,

                report.content,

                report.model

            ]

        );

        return rows[0];

    }

    static async findAll() {

        const { rows } = await pool.query(

            `

            SELECT

                reports.*,

                alerts.severity,

                alerts.status

            FROM reports

            JOIN alerts

            ON reports.alert_id = alerts.id

            ORDER BY reports.created_at DESC

            `

        );

        return rows;

    }

    static async findById(id) {

        const { rows } = await pool.query(

            `

            SELECT *

            FROM reports

            WHERE id=$1

            `,

            [id]

        );

        return rows[0];

    }

    static async delete(id) {

        await pool.query(

            `

            DELETE FROM reports

            WHERE id=$1

            `,

            [id]

        );

    }

}

module.exports = Report;