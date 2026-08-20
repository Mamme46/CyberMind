function isFailedAuthentication(event) {

    const eventType =
        String(
            event.event_type || ""
        ).toLowerCase();


    const authenticationStatus =
        String(
            event.authentication_status || ""
        ).toLowerCase();


    const message =
        String(
            event.message || ""
        );


    /*
     * =========================================================
     * 1. Strong normalized indicator
     * =========================================================
     *
     * If the normalizer explicitly identified a failed
     * authentication, this is the most reliable indicator.
     */

    if (
        authenticationStatus === "failed"
    ) {

        return true;

    }


    /*
     * =========================================================
     * 2. Common normalized event types
     * =========================================================
     */

    if (

        eventType === "login_failed"

        ||

        eventType === "authentication_failed"

        ||

        eventType === "auth_failed"

        ||

        eventType === "failed_login"

    ) {

        return true;

    }


    /*
     * =========================================================
     * 3. Fallback for logs that were not completely normalized
     * =========================================================
     *
     * We do NOT simply search for "failed".
     *
     * The message must contain BOTH:
     *
     * - authentication context
     * - failure context
     */

    const authenticationContext =
        /\b(login|logon|authentication|auth|password|credential|credentials|sign.?in)\b/i
            .test(message);


    const failureContext =
        /\b(failed|failure|invalid|denied|rejected|unsuccessful|incorrect)\b/i
            .test(message);


    if (
        authenticationContext &&
        failureContext
    ) {

        return true;

    }


    return false;

}


function detect(events) {

    const detections = [];


    /*
     * =========================================================
     * Find failed authentication events
     * =========================================================
     */

    const failedLogins =
        events.filter(event => {

            return (

                isFailedAuthentication(event)

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
     * Group by source IP + username
     * =========================================================
     */

    const grouped = {};


    for (
        const event
        of failedLogins
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
     * Sliding five-minute window
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
             * Detection threshold
             *
             * 5 or more failed authentications
             * within 5 minutes
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


                detections.push({

                    title:
                        "Multiple Failed Logins",

                    description:
                        `${windowEvents.length} failed authentication attempts detected for user "${username}" from ${sourceIp} within 5 minutes.`,

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
                 * One detection per source/user.
                 */

                break;

            }

        }

    }


    return detections;

}


module.exports = {

    name:
        "Multiple Failed Logins",

    description:
        "Detects repeated failed authentication attempts against the same user from the same source IP within five minutes.",

    severity:
        "high",

    mitre:
        "T1110",

    detect

};