const pool = require("../config/database").pool;

class Investigation {

    static async getAlert(alertId){

        const { rows } = await pool.query(

            `
            SELECT *
            FROM alerts
            WHERE id = $1
            `,

            [alertId]

        );

        return rows[0];

    }

    static async getEvents(alertId){

        const { rows } = await pool.query(

            `

            SELECT

                le.*

            FROM alert_events ae

            JOIN log_events le

                ON ae.log_event_id = le.id

            WHERE ae.alert_id = $1

            ORDER BY le.id ASC

            `,

            [alertId]

        );

        return rows;

    }

}

module.exports = Investigation;