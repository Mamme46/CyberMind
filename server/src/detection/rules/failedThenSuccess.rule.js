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
     * Strong normalized indicator
     */

    if (
        authenticationStatus ===
        "failed"
    ) {

        return true;

    }


    /*
     * Common normalized event types
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
     * Fallback for logs that were not completely normalized.
     *
     * We require both authentication context
     * and failure context.
     */

    const authenticationContext =
        /\b(login|logon|authentication|auth|password|credential|credentials|sign.?in)\b/i
            .test(message);


    const failureContext =
        /\b(failed|failure|invalid|denied|rejected|unsuccessful|incorrect)\b/i
            .test(message);


    return (
        authenticationContext &&
        failureContext
    );

}


function isSuccessfulAuthentication(event) {

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
     * Strong normalized indicator
     */

    if (
        authenticationStatus ===
        "success"
    ) {

        return true;

    }


    /*
     * Common normalized event types
     */

    if (

        eventType === "login_success"

        ||

        eventType === "authentication_success"

        ||

        eventType === "auth_success"

        ||

        eventType === "successful_login"

    ) {

        return true;

    }


    /*
     * Generic fallback
     */

    const authenticationContext =
        /\b(login|logon|authentication|auth|password|credential|credentials|sign.?in)\b/i
            .test(message);


    const successContext =
        /\b(success|successful|accepted|authenticated|approved|granted)\b/i
            .test(message);


    return (
        authenticationContext &&
        successContext
    );

}


function detect(events) {

    const detections = [];


    /*
     * =========================================================
     * Keep only events with the information required to
     * establish a relationship between authentication attempts.
     * =========================================================
     */

    const authenticationEvents =
        events.filter(event => {

            return (

                event.source_ip

                &&

                event.username

                &&

                event.event_time

                &&

                (
                    isFailedAuthentication(event)

                    ||

                    isSuccessfulAuthentication(event)
                )

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
        of authenticationEvents
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
     * Analyze each source/user combination
     * =========================================================
     */

    for (
        const [
            key,
            userEvents
        ]
        of Object.entries(grouped)
    ) {

        const sorted =
            [...userEvents].sort(
                (a, b) =>
                    new Date(
                        a.event_time
                    ) -
                    new Date(
                        b.event_time
                    )
            );


        /*
         * Look for a successful authentication.
         */

        for (
            let i = 0;
            i < sorted.length;
            i++
        ) {

            const successEvent =
                sorted[i];


            if (
                !isSuccessfulAuthentication(
                    successEvent
                )
            ) {

                continue;

            }


            const successTime =
                new Date(
                    successEvent.event_time
                );


            /*
             * =================================================
             * Look backwards five minutes from the success.
             * =================================================
             */

            const previousEvents =
                sorted.filter(event => {

                    const eventTime =
                        new Date(
                            event.event_time
                        );


                    const difference =
                        successTime -
                        eventTime;


                    return (

                        difference >= 0

                        &&

                        difference <=
                        3 * 60 * 1000

                    );

                });


            /*
             * Count failed authentications.
             */

            const failedEvents =
                previousEvents.filter(
                    event =>
                        isFailedAuthentication(
                            event
                        )
                );


            /*
             * =================================================
             * Detection threshold:
             *
             * 3 or more failures
             * followed by
             * successful authentication
             * within 5 minutes.
             * =================================================
             */

            if (
                failedEvents.length >= 3
            ) {

                const sourceIp =
                    successEvent.source_ip;


                const username =
                    successEvent.username;


                const eventIds = [

                    ...failedEvents.map(
                        event => event.id
                    ),

                    successEvent.id

                ];


                detections.push({

                    title:
                        "Failed Logins Followed by Success",

                    description:
                        `${failedEvents.length} failed authentication attempts were followed by a successful login for user "${username}" from ${sourceIp} within 3 minutes.`,

                    severity:
                        "high",

                    sourceIp,

                    username,

                    eventIds:
                        [...new Set(eventIds)]

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
        "Failed Logins Followed by Success",

    description:
        "Detects multiple failed authentication attempts followed by a successful authentication for the same user and source IP within three minutes.",

    severity:
        "high",

    mitre:
        "T1110",

    detect

};