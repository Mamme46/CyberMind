function detect(events) {

    const detections = [];

    /*
     * =========================================================
     * MULTIPLE HOSTS - SAME USER
     * =========================================================
     *
     * Detects when the same user appears on multiple different
     * hosts within a short period of time.
     *
     * This rule is intentionally generic.
     *
     * It does NOT depend on:
     *
     * - SSH
     * - login_failed
     * - a specific log format
     * - a specific message
     *
     * It works with normalized fields such as:
     *
     * - username
     * - hostname
     * - source_ip
     * - event_time
     *
     * Detection threshold:
     *
     * 3 different hosts
     * within 10 minutes
     * =========================================================
     */


    /*
     * =========================================================
     * FILTER RELEVANT EVENTS
     * =========================================================
     *
     * We need:
     *
     * - username
     * - hostname
     * - event_time
     *
     * Hostname is essential because the rule is specifically
     * looking for the same user accessing different hosts.
     */

    const relevantEvents =
        events.filter(event => {

            return (

                event.username

                &&

                event.hostname

                &&

                event.event_time

            );

        });


    /*
     * =========================================================
     * GROUP EVENTS BY USER
     * =========================================================
     */

    const grouped = {};


    for (
        const event
        of relevantEvents
    ) {

        const username =
            String(
                event.username
            ).toLowerCase();


        if (
            !grouped[username]
        ) {

            grouped[username] = [];

        }


        grouped[username].push(
            event
        );

    }


    /*
     * =========================================================
     * SLIDING TEN-MINUTE WINDOW
     * =========================================================
     */

    for (
        const [
            username,
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
                    10 * 60 * 1000
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
             * COUNT DIFFERENT HOSTS
             * =================================================
             */

            const hosts =
                new Set(
                    windowEvents.map(
                        event =>
                            String(
                                event.hostname
                            ).toLowerCase()
                    )
                );


            /*
             * =================================================
             * DETECTION
             * =================================================
             *
             * Same user
             * +
             * at least 3 different hosts
             * +
             * within 10 minutes
             */

            if (
                hosts.size >= 3
            ) {

                const sourceIps =
                    [
                        ...new Set(
                            windowEvents
                                .map(
                                    event =>
                                        event.source_ip
                                )
                                .filter(Boolean)
                        )
                    ];


                detections.push({

                    title:
                        "Multiple Hosts Same User",

                    description:
                        `User "${username}" was observed on ${hosts.size} different hosts within 10 minutes.`,

                    severity:
                        "medium",

                    username,

                    sourceIp:
                        sourceIps.length === 1
                            ? sourceIps[0]
                            : null,

                    eventIds:
                        windowEvents.map(
                            event =>
                                event.id
                        )

                });


                /*
                 * One detection per user.
                 */

                break;

            }

        }

    }


    return detections;

}


module.exports = {

    name:
        "Multiple Hosts Same User",

    description:
        "Detects the same user accessing multiple different hosts within a short period of time.",

    severity:
        "medium",

    mitre:
        "T1078",

    detect

};