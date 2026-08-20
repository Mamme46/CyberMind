class EventNormalizer {

    static normalize(event) {

        const normalized = {

            ...event,

            eventTime:
                event.eventTime || null,

            hostname:
                event.hostname || null,

            source:
                event.source || "unknown",

            sourceIp:
                event.sourceIp || null,

            sourcePort:
                EventNormalizer.normalizePort(
                    event.sourcePort
                ),

            destinationIp:
                event.destinationIp || null,

            destinationPort:
                EventNormalizer.normalizePort(
                    event.destinationPort
                ),

            username:
                event.username || null,

            service:
                event.service || null,

            protocol:
                event.protocol || null,

            eventType:
                event.eventType || "unknown",

            severity:
                event.severity || "info",

            authenticationStatus:
                event.authenticationStatus || null,

            message:
                event.message || "",

            rawLog:
                event.rawLog ||
                event.message ||
                ""

        };


        /*
         * =====================================================
         * TEXT
         * =====================================================
         */

        const message =
            String(
                normalized.message
            );


        const eventType =
            String(
                normalized.eventType
            );


        const source =
            String(
                normalized.source
            );


        const eventName =
            String(
                event.event || ""
            );


        const status =
            String(
                event.status || ""
            );


        const reason =
            String(
                event.reason || ""
            );


        const text =
            `${eventType} ${eventName} ${status} ${reason} ${message} ${source}`;


        const lowerText =
            text.toLowerCase();


        /*
         * =====================================================
         * DNS CONTEXT
         * =====================================================
         *
         * IMPORTANT:
         *
         * DNS classification has priority over generic
         * authentication detection.
         *
         * Example:
         *
         * login.microsoftonline.com
         *
         * contains the word "login", but this is a DNS query,
         * NOT an authentication event.
         *
         * We therefore use the structured DNS fields and
         * explicit DNS event types instead of keywords alone.
         */

        const hasDnsQuery =
            Boolean(
                event.query ||
                normalized.query
            );


        const hasDnsResponse =
            Boolean(
                event.responseIp ||
                event.response_ip ||
                normalized.responseIp ||
                normalized.response_ip
            );


        const explicitDnsEvent =
            /^(dns|dns_)/i.test(
                eventType
            );


        const dnsService =
            String(
                normalized.service || ""
            ).toLowerCase() === "dns";


        const isDnsEvent =
            explicitDnsEvent
            ||
            (
                hasDnsQuery
                &&
                (
                    hasDnsResponse
                    ||
                    dnsService
                    ||
                    /\bdns\b|\bnamed\b/i.test(
                        lowerText
                    )
                )
            )
            ||
            (
                dnsService
                &&
                hasDnsQuery
            );


        /*
         * =====================================================
         * DNS NORMALIZATION
         * =====================================================
         */

        if (
            isDnsEvent
        ) {

            normalized.service =
                "dns";


            normalized.source =
                event.source &&
                event.source !== "unknown"

                    ? event.source

                    : "dns";


            /*
             * Preserve DNS structured fields.
             *
             * Support both camelCase and snake_case input.
             */

            normalized.query =
                event.query ||
                event.query_name ||
                event.domain ||
                null;


            normalized.queryType =
                event.queryType ||
                event.query_type ||
                null;


            normalized.responseIp =
                event.responseIp ||
                event.response_ip ||
                null;


            normalized.ttl =
                event.ttl !== undefined &&
                event.ttl !== null

                    ? Number(event.ttl)

                    : null;


            normalized.dnsServer =
                event.dnsServer ||
                event.dns_server ||
                null;


            normalized.rcode =
                event.rcode !== undefined &&
                event.rcode !== null

                    ? Number(event.rcode)

                    : null;


            /*
             * Determine DNS event type.
             */

            if (
                normalized.responseIp
            ) {

                normalized.eventType =
                    "dns_response";

            }

            else if (
                normalized.query
            ) {

                normalized.eventType =
                    "dns_query";

            }


            /*
             * DNS events must NOT be reclassified
             * as authentication events later.
             */

        }


        /*
         * =====================================================
         * GENERIC SERVICE DETECTION
         * =====================================================
         */

        if (
            !normalized.service
        ) {

            if (
                /\bssh\b|\bsshd\b/
                    .test(lowerText)
            ) {

                normalized.service =
                    "ssh";

            }

            else if (
                /\bhttp\b|\bhttps\b|\bapache\b|\bnginx\b/
                    .test(lowerText)
            ) {

                normalized.service =
                    "http";

            }

            else if (
                /\bdns\b|\bnamed\b/
                    .test(lowerText)
            ) {

                normalized.service =
                    "dns";

            }

            else if (
                /\bftp\b|\bvsftpd\b/
                    .test(lowerText)
            ) {

                normalized.service =
                    "ftp";

            }

            else if (
                /\bsmtp\b|\bpostfix\b|\bsendmail\b/
                    .test(lowerText)
            ) {

                normalized.service =
                    "smtp";

            }

        }


        /*
         * =====================================================
         * GENERIC USERNAME EXTRACTION
         * =====================================================
         */

        if (
            !normalized.username
        ) {

            const usernamePatterns = [

                /username\s*[=:]\s*["']?([^,\s"']+)/i,

                /\buser\s*[=:]\s*["']?([^,\s"']+)/i,

                /\bfor\s+(?:invalid user\s+)?([^\s]+)\s+from\b/i,

                /\baccount\s*[=:]\s*["']?([^,\s"']+)/i

            ];


            for (
                const pattern
                of usernamePatterns
            ) {

                const match =
                    message.match(
                        pattern
                    );


                if (
                    match
                ) {

                    normalized.username =
                        match[1].trim();

                    break;

                }

            }

        }


        /*
         * =====================================================
         * GENERIC TIMESTAMP EXTRACTION
         * =====================================================
         */

        if (
            !normalized.eventTime
        ) {

            const timestampMatch =
                message.match(

                    /^\s*(\d{4}-\d{2}-\d{2}[T\s]\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:\d{2})?)/i

                );


            if (
                timestampMatch
            ) {

                const parsedDate =
                    new Date(
                        timestampMatch[1]
                    );


                if (
                    !isNaN(
                        parsedDate.getTime()
                    )
                ) {

                    normalized.eventTime =
                        parsedDate;

                }

            }

        }


        /*
         * =====================================================
         * GENERIC IP EXTRACTION
         * =====================================================
         */

        const ips =
            EventNormalizer.extractIPv4(
                message
            );


        if (
            !normalized.sourceIp &&
            ips.length > 0
        ) {

            normalized.sourceIp =
                ips[0];

        }


        if (
            !normalized.destinationIp &&
            ips.length > 1
        ) {

            normalized.destinationIp =
                ips[1];

        }


        /*
         * =====================================================
         * GENERIC IP:PORT EXTRACTION
         * =====================================================
         */

        const endpoints =
            EventNormalizer.extractEndpoints(
                message
            );


        if (
            endpoints.length >= 1
        ) {

            if (
                !normalized.sourceIp
            ) {

                normalized.sourceIp =
                    endpoints[0].ip;

            }


            if (
                !normalized.sourcePort
            ) {

                normalized.sourcePort =
                    endpoints[0].port;

            }

        }


        if (
            endpoints.length >= 2
        ) {

            if (
                !normalized.destinationIp
            ) {

                normalized.destinationIp =
                    endpoints[1].ip;

            }


            if (
                !normalized.destinationPort
            ) {

                normalized.destinationPort =
                    endpoints[1].port;

            }

        }


        /*
         * =====================================================
         * GENERIC SOURCE PORT EXTRACTION
         * =====================================================
         */

        if (
            !normalized.sourcePort
        ) {

            const sourcePortMatch =
                message.match(

                    /\b(?:source[_\s-]?port|src[_\s-]?port|from\s+port)\s*[=:]?\s*(\d{1,5})\b/i

                );


            if (
                sourcePortMatch
            ) {

                normalized.sourcePort =
                    EventNormalizer.normalizePort(
                        sourcePortMatch[1]
                    );

            }

        }


        /*
         * =====================================================
         * GENERIC DESTINATION PORT EXTRACTION
         * =====================================================
         */

        if (
            !normalized.destinationPort
        ) {

            const destinationPortMatch =
                message.match(

                    /\b(?:destination[_\s-]?port|dest[_\s-]?port|dst[_\s-]?port|to\s+port)\s*[=:]?\s*(\d{1,5})\b/i

                );


            if (
                destinationPortMatch
            ) {

                normalized.destinationPort =
                    EventNormalizer.normalizePort(
                        destinationPortMatch[1]
                    );

            }

        }


        /*
         * =====================================================
         * GENERIC AUTHENTICATION STATUS
         * =====================================================
         *
         * DNS events are deliberately excluded.
         */

        if (
            !normalized.authenticationStatus
            &&
            !isDnsEvent
        ) {

            const normalizedStatus =
                String(
                    event.status || ""
                ).toLowerCase();


            const authenticationContext =
                /\b(login|logon|authentication|auth|sign.?in|credential|password)\b/i
                    .test(text);


            /*
             * STRUCTURED FAILED STATUS
             */

            if (
                normalizedStatus === "failed"
                &&
                authenticationContext
            ) {

                normalized.authenticationStatus =
                    "failed";

            }


            /*
             * STRUCTURED SUCCESS STATUS
             */

            else if (
                normalizedStatus === "success"
                &&
                authenticationContext
            ) {

                normalized.authenticationStatus =
                    "success";

            }


            /*
             * GENERIC TEXTUAL FAILURE
             */

            else if (
                authenticationContext
                &&
                /\b(failed|failure|denied|rejected|invalid|unsuccessful|incorrect)\b/i
                    .test(text)
            ) {

                normalized.authenticationStatus =
                    "failed";

            }


            /*
             * GENERIC TEXTUAL SUCCESS
             */

            else if (
                authenticationContext
                &&
                /\b(accepted|successful|success|authenticated|approved|granted)\b/i
                    .test(text)
            ) {

                normalized.authenticationStatus =
                    "success";

            }

        }


        /*
         * =====================================================
         * PRIVILEGE ESCALATION
         * =====================================================
         */

        const normalizedEventType =
            String(
                event.eventType || ""
            ).toLowerCase();


        const privilegeEscalationDetected =

            /\bprivilege\s+escalat(?:ion|ed|ing)\b/i.test(text)

            ||

            /\bprivileges?\s+(?:elevated|elevation)\b/i.test(text)

            ||

            /\bsudo(?:[_\s-]?exec)?\b/i.test(text)

            ||

            /\broot\s+access\b/i.test(text)

            ||

            /\b(?:switched|changed)\s+to\s+root\b/i.test(text)

            ||

            /\badded_to\s*=\s*(?:domain\s+admins?|enterprise\s+admins?)\b/i.test(text)

            ||

            /\brole\s*=\s*(?:administrator|admin|root)\b/i.test(text)

            ||

            normalizedEventType ===
                "privilege_escalation"

            ||

            normalizedEventType ===
                "privilege_change"

            ||

            (
                normalizedEventType ===
                "role_change"

                &&

                /\b(?:administrator|admin|root)\b/i.test(text)
            );


        if (
            privilegeEscalationDetected
        ) {

            normalized.eventType =
                "privilege_escalation";

            normalized.severity =
                "high";

        }


        /*
         * =====================================================
         * GENERIC AUTHENTICATION EVENT TYPE
         * =====================================================
         *
         * IMPORTANT:
         *
         * DNS events are excluded here.
         *
         * This prevents:
         *
         * login.microsoftonline.com
         *
         * from becoming:
         *
         * authentication_attempt
         *
         * simply because the domain contains "login".
         */

        const authenticationContext =
            /\b(login|logon|authentication|auth|sign.?in|credential|password)\b/i
                .test(text);


        if (
            !isDnsEvent
            &&
            authenticationContext
        ) {

            /*
             * Explicit failure
             */

            if (
                normalized.authenticationStatus ===
                "failed"
            ) {

                normalized.eventType =
                    "authentication_failed";

            }


            /*
             * Explicit success
             */

            else if (
                normalized.authenticationStatus ===
                "success"
            ) {

                normalized.eventType =
                    "authentication_success";

            }


            /*
             * No explicit result
             */

            else {

                normalized.eventType =
                    "authentication_attempt";

                normalized.authenticationStatus =
                    "attempt";

            }

        }


        return normalized;

    }


    /*
     * =========================================================
     * PORT NORMALIZATION
     * =========================================================
     */

    static normalizePort(port) {

        if (
            port === null ||
            port === undefined ||
            port === ""
        ) {

            return null;

        }


        const value =
            Number(port);


        if (
            !Number.isInteger(value) ||
            value < 0 ||
            value > 65535
        ) {

            return null;

        }


        return value;

    }


    /*
     * =========================================================
     * IPv4 EXTRACTION
     * =========================================================
     */

    static extractIPv4(text) {

        return (

            String(text)
                .match(
                    /\b(?:\d{1,3}\.){3}\d{1,3}\b/g
                )

            || []

        );

    }


    /*
     * =========================================================
     * IP:PORT ENDPOINT EXTRACTION
     * =========================================================
     */

    static extractEndpoints(text) {

        const matches =
            String(text).match(

                /\b((?:\d{1,3}\.){3}\d{1,3}):(\d{1,5})\b/g

            )
            || [];


        return matches

            .map(value => {

                const match =
                    value.match(

                        /^((?:\d{1,3}\.){3}\d{1,3}):(\d{1,5})$/

                    );


                if (
                    !match
                ) {

                    return null;

                }


                return {

                    ip:
                        match[1],

                    port:
                        EventNormalizer.normalizePort(
                            match[2]
                        )

                };

            })

            .filter(Boolean);

    }

}


module.exports = EventNormalizer;