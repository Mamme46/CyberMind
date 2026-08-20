const pool = require("../config/database").pool;

class AlertEvent {

    static async create(alertId, logEventId) {

        const query = `

        INSERT INTO alert_events(

            alert_id,
            log_event_id

        )

        VALUES($1,$2)

        RETURNING *;

        `;

        const { rows } = await pool.query(

            query,

            [alertId, logEventId]

        );

        return rows[0];

    }

    static async findEvents(alertId){

        const query = `

        SELECT

            le.*

        FROM alert_events ae

        JOIN log_events le

            ON ae.log_event_id = le.id

        WHERE ae.alert_id = $1

        ORDER BY le.id;

        `;

        const { rows } = await pool.query(

            query,

            [alertId]

        );

        return rows;

    }

}

module.exports = AlertEvent;