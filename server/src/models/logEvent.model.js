const { pool } = require("../config/database");

class LogEvent {

    static async create(log) {

        const query = `
            INSERT INTO log_events(
                upload_id,
                timestamp,
                hostname,
                source_ip,
                destination_ip,
                event_type,
                severity,
                message
            )

            VALUES($1,$2,$3,$4,$5,$6,$7,$8)

            RETURNING *;
        `;

        const values = [

            log.upload_id,
            log.timestamp,
            log.hostname,
            log.source_ip,
            log.destination_ip,
            log.event_type,
            log.severity,
            log.message

        ];

        const { rows } = await pool.query(query, values);

        return rows[0];

    }

    static async findByUpload(uploadId) {

        const { rows } = await pool.query(
            "SELECT * FROM log_events WHERE upload_id=$1",
            [uploadId]
        );

        return rows;
    }

}

module.exports = LogEvent;