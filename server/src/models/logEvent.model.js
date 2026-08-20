const pool = require("../config/database").pool;

class LogEvent {

    static async create(event) {

        const query = `
        INSERT INTO log_events (

            upload_id,
            event_time,
            hostname,
            source,
            service,
            source_ip,
            destination_ip,
            username,
            event_type,
            severity,
            message,
            raw_log,
            source_port,
            destination_port,
            query,
            query_type,
            response_ip,
            ttl,
            dns_server,
            rcode

        )

        VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20)

        RETURNING *;
        `;

        const values = [

            event.uploadId,
            event.eventTime,
            event.hostname,
            event.source,
            event.service,
            event.sourceIp,
            event.destinationIp,
            event.username,
            event.eventType,
            event.severity,
            event.message,
            event.rawLog,
            event.sourcePort,
            event.destinationPort,
            event.query,
            event.queryType,
            event.responseIp,
            event.ttl,
            event.dnsServer,
            event.rcode

        ];

        const { rows } =
            await pool.query(
                query,
                values
            );

        return rows[0];

    }


    static async findByUploadId(uploadId) {

        const { rows } =
            await pool.query(

                `SELECT *
                 FROM log_events
                 WHERE upload_id = $1
                 ORDER BY id ASC`,

                [uploadId]

            );

        return rows;

    }

}

module.exports = LogEvent;