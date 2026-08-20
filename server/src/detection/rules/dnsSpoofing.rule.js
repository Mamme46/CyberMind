function detect(events) {

    const detections = [];


    /*
     * =========================================================
     * DNS SPOOFING
     * =========================================================
     *
     * The rule works with normalized events.
     *
     * Detection methods:
     *
     * 1. Explicit DNS spoofing / poisoning events
     *
     * 2. Suspicious DNS responses explicitly described as
     *    forged, malicious, altered, tampered, etc.
     *
     * 3. Several different IP responses for the same domain
     *    within a short period of time.
     *
     *    A very short TTL increases the confidence.
     *
     * The rule does NOT depend on specific domains or IPs.
     */


    /*
     * =========================================================
     * 1. EXPLICIT DNS SPOOFING EVENTS
     * =========================================================
     */

    const explicitDnsEvents =
        events.filter(event => {

            const eventType =
                String(
                    event.event_type || ""
                ).toLowerCase();


            const message =
                String(
                    event.message || ""
                ).toLowerCase();


            const source =
                String(
                    event.source || ""
                ).toLowerCase();


            return (

                /*
                 * Normalized event types
                 */

                eventType ===
                "dns_spoofing"

                ||

                eventType ===
                "dns_poisoning"

                ||

                eventType ===
                "dns_cache_poisoning"

                ||

                /*
                 * Explicit messages
                 */

                /\bdns\s+spoof(?:ing)?\b/i.test(
                    message
                )

                ||

                /\bdns\s+poison(?:ing|ed)?\b/i.test(
                    message
                )

                ||

                /\bcache\s+poison(?:ing|ed)?\b/i.test(
                    message
                )

                ||

                /*
                 * DNS source + suspicious action
                 */

                (
                    /\bdns\b/i.test(
                        source
                    )

                    &&

                    /\b(?:spoof|poison|forged|malicious)\b/i.test(
                        message
                    )
                )

            );

        });


    /*
     * =========================================================
     * CREATE EXPLICIT DNS DETECTIONS
     * =========================================================
     */

    for (
        const event
        of explicitDnsEvents
    ) {

        detections.push({

            title:
                "DNS Spoofing",

            description:
                event.source_ip

                    ? `Explicit DNS spoofing or poisoning activity detected from ${event.source_ip}.`

                    : "Explicit DNS spoofing or poisoning activity detected.",

            severity:
                "high",

            sourceIp:
                event.source_ip ||
                null,

            username:
                event.username ||
                null,

            eventIds:
                event.id
                    ? [event.id]
                    : []

        });

    }


    /*
     * =========================================================
     * 2. SUSPICIOUS DNS RESPONSES
     * =========================================================
     *
     * Some logs do not explicitly use "DNS spoofing" as the
     * event type but indicate that a response was suspicious.
     *
     * Examples:
     *
     * - forged response
     * - malicious response
     * - altered response
     * - tampered response
     * - unexpected DNS response
     */

    const suspiciousDnsEvents =
        events.filter(event => {

            const eventType =
                String(
                    event.event_type || ""
                ).toLowerCase();


            const message =
                String(
                    event.message || ""
                ).toLowerCase();


            const isDns =
                eventType.includes(
                    "dns"
                )

                ||

                Boolean(
                    event.query
                );


            const isSuspicious =
                /\b(?:forged|malicious|tampered|altered|spoofed|unexpected)\b/i.test(
                    message
                );


            return (

                isDns

                &&

                isSuspicious

            );

        });


    for (
        const event
        of suspiciousDnsEvents
    ) {

        /*
         * Avoid duplicate detection if this event
         * was already detected as an explicit event.
         */

        if (
            explicitDnsEvents.includes(
                event
            )
        ) {

            continue;

        }


        detections.push({

            title:
                "DNS Spoofing",

            description:
                event.query

                    ? `Suspicious DNS response detected for "${event.query}".`

                    : "Suspicious or manipulated DNS response detected.",

            severity:
                "high",

            sourceIp:
                event.source_ip ||
                null,

            username:
                event.username ||
                null,

            eventIds:
                event.id
                    ? [event.id]
                    : []

        });

    }


    /*
     * =========================================================
     * 3. DNS RESPONSE ANOMALY
     * =========================================================
     *
     * Detect several different response IPs for the same
     * DNS query within one minute.
     *
     * This is NOT automatically considered malicious.
     *
     * Therefore:
     *
     * - multiple IPs alone = suspicious anomaly
     * - multiple IPs + very short TTL = stronger indication
     *
     * No specific domain or IP is hard-coded.
     */


    const dnsQueries =
        events.filter(event => {

            const eventType =
                String(
                    event.event_type || ""
                ).toLowerCase();


            return (

                (
                    eventType ===
                    "dns_query"

                    ||

                    eventType ===
                    "dns_response"

                    ||

                    eventType ===
                    "dns_lookup"

                    ||

                    eventType.includes(
                        "dns"
                    )
                )

                &&

                event.query

                &&

                event.response_ip

                &&

                event.event_time

            );

        });


    /*
     * =========================================================
     * GROUP BY DOMAIN
     * =========================================================
     */

    const groupedQueries = {};


    for (
        const event
        of dnsQueries
    ) {

        const query =
            String(
                event.query
            ).trim().toLowerCase();


        if (
            !query
        ) {

            continue;

        }


        if (
            !groupedQueries[query]
        ) {

            groupedQueries[query] = [];

        }


        groupedQueries[query].push(
            event
        );

    }


    /*
     * =========================================================
     * SLIDING ONE-MINUTE WINDOW
     * =========================================================
     */

    for (
        const [
            query,
            queryEvents
        ]
        of Object.entries(
            groupedQueries
        )
    ) {

        const sorted =
            [...queryEvents].sort(
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


            const windowEvents =
                [];


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
                    60 * 1000
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
             * DIFFERENT RESPONSE IPS
             * =================================================
             */

            const responseIps =
                [
                    ...new Set(
                        windowEvents
                            .map(
                                event =>
                                    String(
                                        event.response_ip
                                    )
                            )
                    )
                ];


            /*
             * We need at least two different
             * answers for the same query.
             */

            if (
                responseIps.length < 2
            ) {

                continue;

            }


            /*
             * =================================================
             * CHECK TTL
             * =================================================
             *
             * A very short TTL is not proof of spoofing,
             * but increases the suspicion.
             */

            const hasShortTtl =
                windowEvents.some(
                    event => {

                        const ttl =
                            Number(
                                event.ttl
                            );


                        return (

                            Number.isFinite(
                                ttl
                            )

                            &&

                            ttl > 0

                            &&

                            ttl <= 10

                        );

                    }
                );


            /*
             * =================================================
             * DETECTION
             * =================================================
             *
             * Multiple answers for the same domain in a
             * short window are considered suspicious.
             *
             * Short TTL increases the confidence.
             */

            detections.push({

                title:
                    "DNS Spoofing",

                description:
                    hasShortTtl

                        ? `Multiple DNS responses detected for "${query}" within one minute with an unusually short TTL. Responses: ${responseIps.join(", ")}.`

                        : `Multiple different DNS responses detected for "${query}" within one minute. Responses: ${responseIps.join(", ")}.`,

                severity:
                    hasShortTtl
                        ? "high"
                        : "medium",

                sourceIp:
                    windowEvents[0]
                        .source_ip ||
                    null,

                username:
                    windowEvents[0]
                        .username ||
                    null,

                eventIds:
                    windowEvents
                        .map(
                            event =>
                                event.id
                        )
                        .filter(Boolean)

            });


            /*
             * One detection per domain.
             */

            break;

        }

    }


    return detections;

}


module.exports = {

    name:
        "DNS Spoofing",

    description:
        "Detects explicit DNS spoofing or poisoning and suspicious DNS response anomalies.",

    severity:
        "high",

    mitre:
        "T1557.002",

    detect

};