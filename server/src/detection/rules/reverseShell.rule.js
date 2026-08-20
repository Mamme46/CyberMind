function detect(events) {

    const detections = [];


    /*
     * =========================================================
     * REVERSE SHELL
     * =========================================================
     *
     * The rule detects:
     *
     * 1. Explicit reverse-shell events
     *
     * 2. Suspicious reverse-shell mechanisms
     *
     * 3. Shell execution followed by a network connection
     *
     * Multiple events belonging to the same incident are
     * grouped into ONE detection.
     *
     * Example:
     *
     * process_exec
     * +
     * network_connect
     *
     * => ONE Reverse Shell alert
     */


    /*
     * =========================================================
     * HELPERS
     * =========================================================
     */

    const getText = event => {

        return [

            event.message,
            event.command,
            event.command_line,
            event.raw_log,
            event.rawLog

        ]
            .filter(Boolean)
            .join(" ")
            .toLowerCase();

    };


    const getEventType = event => {

        return String(
            event.event_type ||
            event.eventType ||
            ""
        )
            .toLowerCase()
            .trim();

    };


    const getSourceIp = event => {

        return (
            event.source_ip ||
            event.sourceIp ||
            event.src_ip ||
            null
        );

    };


    const getDestinationIp = event => {

        return (
            event.destination_ip ||
            event.destinationIp ||
            event.dst_ip ||
            null
        );

    };


    const getDestinationPort = event => {

        return (
            event.destination_port ||
            event.destinationPort ||
            event.dst_port ||
            null
        );

    };


    const getUsername = event => {

        return (
            event.username ||
            event.user ||
            null
        );

    };


    const getEventTime = event => {

        return (
            event.event_time ||
            event.eventTime ||
            null
        );

    };


    /*
     * =========================================================
     * INCIDENT CANDIDATES
     * =========================================================
     *
     * Instead of creating an alert immediately for every
     * suspicious event, we first collect evidence.
     */

    const candidates = [];


    /*
     * =========================================================
     * 1. EXPLICIT REVERSE SHELL EVENTS
     * =========================================================
     */

    for (
        const event
        of events
    ) {

        const eventType =
            getEventType(event);


        const text =
            getText(event);


        if (

            eventType ===
            "reverse_shell"

            ||

            eventType ===
            "reverse-shell"

            ||

            eventType ===
            "reverse shell"

            ||

            /\breverse\s+shell\b/i.test(
                text
            )

        ) {

            candidates.push({

                event,

                reason:
                    "Explicit reverse shell indicator",

                confidence:
                    "high"

            });

        }

    }


    /*
     * =========================================================
     * 2. SUSPICIOUS REVERSE-SHELL MECHANISMS
     * =========================================================
     */

    for (
        const event
        of events
    ) {

        const text =
            getText(event);


        const eventType =
            getEventType(event);


        const isCommandExecution =

            eventType.includes(
                "command"
            )

            ||

            eventType.includes(
                "exec"
            )

            ||

            Boolean(
                event.command
            )

            ||

            Boolean(
                event.command_line
            );


        if (
            !isCommandExecution
        ) {

            continue;

        }


        /*
         * Generic reverse-shell mechanisms.
         */

        const hasReverseShellMechanism =

            /\b(?:nc|ncat|netcat)\b/i.test(
                text
            )

            ||

            /\bsocat\b/i.test(
                text
            )

            ||

            /\/dev\/tcp\//i.test(
                text
            )

            ||

            /\bmkfifo\b/i.test(
                text
            )

            ||

            /\b(?:bash|sh)\b[^;\n]{0,200}(?:nc\b|ncat\b|netcat\b|socat\b|\/dev\/tcp)/i.test(
                text
            )

            ||

            /\b(?:nc|ncat|netcat|socat)\b[^;\n]{0,200}\b(?:bash|sh)\b/i.test(
                text
            );


        if (
            hasReverseShellMechanism
        ) {

            candidates.push({

                event,

                reason:
                    "Suspicious reverse shell mechanism",

                confidence:
                    "high"

            });

        }

    }


    /*
     * =========================================================
     * 3. SHELL + NETWORK CONNECTION
     * =========================================================
     *
     * A shell/process execution followed by a network
     * connection from the same source is suspicious.
     */


    const shellEvents =
        events.filter(event => {

            const text =
                getText(event);


            const eventType =
                getEventType(event);


            const isShell =
                /\b(?:bash|sh|zsh|cmd(?:\.exe)?|powershell|pwsh)\b/i.test(
                    text
                );


            const isCommand =

                eventType.includes(
                    "command"
                )

                ||

                eventType.includes(
                    "exec"
                )

                ||

                Boolean(
                    event.command
                )

                ||

                Boolean(
                    event.command_line
                );


            return (

                isShell

                &&

                isCommand

            );

        });


    const networkEvents =
        events.filter(event => {

            const eventType =
                getEventType(event);


            const destinationIp =
                getDestinationIp(event);


            const destinationPort =
                getDestinationPort(event);


            const text =
                getText(event);


            const isConnection =

                eventType.includes(
                    "connect"
                )

                ||

                eventType.includes(
                    "connection"
                )

                ||

                /\bconnection\b/i.test(
                    text
                );


            return (

                isConnection

                &&

                (
                    destinationIp

                    ||

                    destinationPort
                )

            );

        });


    /*
     * =========================================================
     * CORRELATE SHELL + NETWORK
     * =========================================================
     */

    for (
        const shellEvent
        of shellEvents
    ) {

        const shellTimeValue =
            getEventTime(
                shellEvent
            );


        if (
            !shellTimeValue
        ) {

            continue;

        }


        const shellTime =
            new Date(
                shellTimeValue
            );


        if (
            isNaN(
                shellTime.getTime()
            )
        ) {

            continue;

        }


        const sourceIp =
            getSourceIp(
                shellEvent
            );


        const username =
            getUsername(
                shellEvent
            );


        const relatedConnection =
            networkEvents.find(
                networkEvent => {

                    const connectionTimeValue =
                        getEventTime(
                            networkEvent
                        );


                    if (
                        !connectionTimeValue
                    ) {

                        return false;

                    }


                    const connectionTime =
                        new Date(
                            connectionTimeValue
                        );


                    if (
                        isNaN(
                            connectionTime.getTime()
                        )
                    ) {

                        return false;

                    }


                    const difference =
                        connectionTime -
                        shellTime;


                    /*
                     * Connection must occur within
                     * two minutes.
                     */

                    if (

                        difference < 0

                        ||

                        difference >
                        2 * 60 * 1000

                    ) {

                        return false;

                    }


                    const connectionSourceIp =
                        getSourceIp(
                            networkEvent
                        );


                    /*
                     * Prefer same source IP.
                     */

                    if (

                        sourceIp

                        &&

                        connectionSourceIp

                        &&

                        sourceIp !==
                        connectionSourceIp

                    ) {

                        return false;

                    }


                    return true;

                }
            );


        if (
            relatedConnection
        ) {

            candidates.push({

                event:
                    shellEvent,

                relatedEvent:
                    relatedConnection,

                reason:
                    "Shell execution followed by network connection",

                confidence:
                    "high"

            });

        }

    }


    /*
     * =========================================================
     * 4. GROUP CANDIDATES INTO INCIDENTS
     * =========================================================
     *
     * This is the important part.
     *
     * process_exec + network_connect
     * belonging to the same source/user/time window
     * become ONE detection.
     */

    const incidents = [];


    for (
        const candidate
        of candidates
    ) {

        const event =
            candidate.event;


        const sourceIp =
            getSourceIp(
                event
            );


        const username =
            getUsername(
                event
            );


        const timeValue =
            getEventTime(
                event
            );


        const eventTime =
            timeValue
                ? new Date(
                    timeValue
                )
                : null;


        let existingIncident =
            null;


        /*
         * Search for an existing incident from the
         * same source/user within two minutes.
         */

        for (
            const incident
            of incidents
        ) {

            if (
                sourceIp
                &&
                incident.sourceIp
                &&
                sourceIp !==
                incident.sourceIp
            ) {

                continue;

            }


            if (
                username
                &&
                incident.username
                &&
                username !==
                incident.username
            ) {

                continue;

            }


            if (
                eventTime
                &&
                incident.firstTime
            ) {

                const difference =
                    Math.abs(
                        eventTime -
                        incident.firstTime
                    );


                if (
                    difference >
                    2 * 60 * 1000
                ) {

                    continue;

                }

            }


            existingIncident =
                incident;

            break;

        }


        /*
         * Add evidence to existing incident.
         */

        if (
            existingIncident
        ) {

            existingIncident.events.push(
                event
            );


            if (
                candidate.relatedEvent
            ) {

                existingIncident.events.push(
                    candidate.relatedEvent
                );

            }


            existingIncident.reasons.push(
                candidate.reason
            );


            continue;

        }


        /*
         * Create a new incident.
         */

        const incident = {

            sourceIp:
                sourceIp,

            username:
                username,

            firstTime:
                eventTime,

            events: [
                event
            ],

            reasons: [
                candidate.reason
            ]

        };


        if (
            candidate.relatedEvent
        ) {

            incident.events.push(
                candidate.relatedEvent
            );

        }


        incidents.push(
            incident
        );

    }


    /*
     * =========================================================
     * 5. CREATE ONE ALERT PER INCIDENT
     * =========================================================
     */

    for (
        const incident
        of incidents
    ) {

        /*
         * Remove duplicate events.
         */

        const uniqueEvents = [];


        const seenIds =
            new Set();


        for (
            const event
            of incident.events
        ) {

            const id =
                event.id;


            if (
                id !== undefined
                &&
                id !== null
            ) {

                if (
                    seenIds.has(id)
                ) {

                    continue;

                }


                seenIds.add(id);

            }


            uniqueEvents.push(
                event
            );

        }


        /*
         * Determine severity.
         */

        const hasExplicitReverseShell =
            incident.reasons.some(
                reason =>
                    reason ===
                    "Explicit reverse shell indicator"
            );


        const hasMechanism =
            incident.reasons.some(
                reason =>
                    reason ===
                    "Suspicious reverse shell mechanism"
            );


        const hasCorrelation =
            incident.reasons.some(
                reason =>
                    reason ===
                    "Shell execution followed by network connection"
            );


        let severity =
            "high";


        if (
            hasExplicitReverseShell
            ||
            hasMechanism
        ) {

            severity =
                "high";

        }

        else if (
            hasCorrelation
        ) {

            severity =
                "high";

        }


        /*
         * Build description.
         */

        let description =
            "Suspicious reverse shell activity detected.";


        if (
            hasMechanism
        ) {

            description =
                "A command containing a reverse-shell mechanism was detected.";

        }

        else if (
            hasCorrelation
        ) {

            description =
                "Shell execution was followed by a network connection from the same source within two minutes.";

        }


        detections.push({

            title:
                "Reverse Shell",

            description,

            severity,

            sourceIp:
                incident.sourceIp ||
                null,

            username:
                incident.username ||
                null,

            eventIds:
                uniqueEvents
                    .map(
                        event =>
                            event.id
                    )
                    .filter(Boolean)

        });

    }


    return detections;

}


module.exports = {

    name:
        "Reverse Shell",

    description:
        "Detects reverse shell activity through suspicious shell mechanisms and correlation between shell execution and network connections, while grouping related events into a single incident.",

    severity:
        "high",

    mitre:
        "T1059",

    detect

};