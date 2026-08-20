function detect(events) {

    const detections = [];


    /*
     * =========================================================
     * SSH AUTHENTICATION ATTEMPTS
     * =========================================================
     *
     * The normalizer converts different log formats into
     * generic authentication events:
     *
     * - authentication_attempt
     * - authentication_failed
     *
     * We accept both.
     *
     * Why?
     *
     * Some logs explicitly say that authentication failed.
     * Other logs, especially honeypots, simply record that
     * a username/password was submitted without saying
     * "failed".
     *
     * The repeated authentication behavior is what matters
     * for brute-force detection.
     * =========================================================
     */

    const sshAttempts =
        events.filter(event => {

            const isAuthenticationEvent =

                event.event_type ===
                "authentication_attempt"

                ||

                event.event_type ===
                "authentication_failed"

                ||

                event.event_type ===
                "ssh_auth_attempt"

                ||

                event.event_type ===
                "ssh_auth_failed"

                ||

                (
                    event.event_type ===
                    "login_failed"

                    &&
                    event.service ===
                    "ssh"
                );


            return (

                isAuthenticationEvent

                &&

                event.service ===
                "ssh"

                &&

                event.source_ip

                &&

                event.username

                &&

                event.event_time

            );

        });


    /*
     * =========================================================
     * GROUP BY SOURCE IP + USERNAME
     * =========================================================
     *
     * Example:
     *
     * 85.208.253.189 | root
     *
     * Different users or different source IPs are treated
     * separately.
     * =========================================================
     */

    const grouped = {};


    for (
        const event
        of sshAttempts
    ) {

        const key =
            `${event.source_ip}|${event.username}`;


        if (
            !grouped[key]
        ) {

            grouped[key] = [];

        }


        grouped[key].push(
            event
        );

    }


    /*
     * =========================================================
     * SLIDING FIVE-MINUTE WINDOW
     * =========================================================
     */

    for (
        const [
            key,
            attempts
        ]
        of Object.entries(grouped)
    ) {

        const sorted =
            [...attempts].sort(
                (a, b) =>
                    new Date(
                        a.event_time
                    ) -
                    new Date(
                        b.event_time
                    )
            );


        for (
            let i = 0;
            i < sorted.length;
            i++
        ) {

            const startTime =
                new Date(
                    sorted[i].event_time
                );


            const windowEvents = [];


            for (
                let j = i;
                j < sorted.length;
                j++
            ) {

                const currentTime =
                    new Date(
                        sorted[j].event_time
                    );


                const difference =
                    currentTime -
                    startTime;


                if (
                    difference <=
                    5 * 60 * 1000
                ) {

                    windowEvents.push(
                        sorted[j]
                    );

                }

                else {

                    break;

                }

            }


            /*
             * =================================================
             * BRUTE FORCE THRESHOLD
             * =================================================
             *
             * 5 authentication attempts
             * within 5 minutes.
             * =================================================
             */

            if (
                windowEvents.length >= 5
            ) {

                const sourceIp =
                    windowEvents[0]
                        .source_ip;


                const username =
                    windowEvents[0]
                        .username;


                const failedCount =
                    windowEvents.filter(
                        event =>

                            event.event_type ===
                            "authentication_failed"

                            ||

                            event.event_type ===
                            "ssh_auth_failed"

                            ||

                            event.event_type ===
                            "login_failed"

                    ).length;


                detections.push({

                    title:
                        "SSH Brute Force",

                    description:
                        `${windowEvents.length} SSH authentication attempts detected for user "${username}" from ${sourceIp} within 5 minutes (${failedCount} explicit failures).`,

                    severity:
                        "high",

                    sourceIp,

                    username,

                    eventIds:
                        windowEvents.map(
                            event => event.id
                        )

                });


                /*
                 * One detection per IP/user.
                 */

                break;

            }

        }

    }


    return detections;

}


module.exports = {

    name:
        "SSH Brute Force",

    description:
        "Detects repeated SSH authentication attempts against the same user from the same source IP within five minutes.",

    severity:
        "high",

    mitre:
        "T1110",

    detect

};