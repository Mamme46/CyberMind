const GenericParser = require("./generic.parser");

class SyslogParser {

    static parseLine(line) {

        const event = {

            eventTime: null,

            hostname: null,

            source: "syslog",

            service: null,

            sourceIp: null,

            destinationIp: null,

            sourcePort: null,

            destinationPort: null,

            username: null,

            eventType: "unknown",

            severity: "info",

            message: line,

            rawLog: line,

            /*
             * DNS fields
             */

            query: null,

            queryType: null,

            responseIp: null,

            ttl: null,

            dnsServer: null,

            rcode: null

        };


        /*
         * =====================================================
         * PARSE SYSLOG HEADER
         * =====================================================
         *
         * Supports:
         *
         * 1. Traditional syslog:
         *
         * Aug 18 19:42:11 dns-gateway named[1842]: message
         *
         * 2. ISO timestamp:
         *
         * 2026-08-17T09:00:05+00:00 auth-server sshd[3101]: message
         */

        let message = line;

        let match;


        /*
         * =====================================================
         * ISO SYSLOG FORMAT
         * =====================================================
         */

        const isoMatch = line.match(
            /^(\d{4}-\d{2}-\d{2}T[^\s]+)\s+(\S+)\s+(.*)$/
        );


        if (isoMatch) {

            const parsedDate =
                new Date(
                    isoMatch[1]
                );


            if (
                !isNaN(
                    parsedDate.getTime()
                )
            ) {

                event.eventTime =
                    parsedDate;

            }


            event.hostname =
                isoMatch[2];


            message =
                isoMatch[3];

        }


        /*
         * =====================================================
         * TRADITIONAL SYSLOG FORMAT
         * =====================================================
         */

        else {

            match = line.match(

                /^(\w{3})\s+(\d{1,2})\s+(\d{2}:\d{2}:\d{2})\s+(\S+)\s+(.*)$/

            );


            if (match) {

                const month =
                    match[1];

                const day =
                    match[2];

                const time =
                    match[3];


                event.hostname =
                    match[4];


                message =
                    match[5];


                const currentYear =
                    new Date().getFullYear();


                const parsedDate =
                    new Date(

                        `${month} ${day}, ${currentYear} ${time}`

                    );


                if (
                    !isNaN(
                        parsedDate.getTime()
                    )
                ) {

                    event.eventTime =
                        parsedDate;

                }

            }

        }


        /*
         * =====================================================
         * GENERIC HOST EXTRACTION
         * =====================================================
         *
         * Supports:
         *
         * host=SERVER01
         * hostname=SERVER01
         * target=SERVER01
         * target_host=SERVER01
         * destination_host=SERVER01
         */

        const hostMatch =
            message.match(

                /\b(?:host|hostname|target|target_host|destination_host)\s*[=:]\s*([^\s,;]+)/i

            );


        if (hostMatch) {

            event.hostname =
                hostMatch[1];

        }


        /*
         * =====================================================
         * GENERIC USER EXTRACTION
         * =====================================================
         */

        const usernameMatch =
            message.match(

                /\b(?:user|username)\s*[=:]\s*([^\s,;]+)/i

            );


        if (usernameMatch) {

            event.username =
                usernameMatch[1];

        }


        /*
         * =====================================================
         * GENERIC SOURCE IP EXTRACTION
         * =====================================================
         *
         * Supports:
         *
         * ip=192.168.1.10
         */

        const ipMatch =
            message.match(

                /\bip\s*[=:]\s*((?:\d{1,3}\.){3}\d{1,3})\b/i

            );


        if (ipMatch) {

            event.sourceIp =
                ipMatch[1];

        }


        /*
         * =====================================================
         * DNS QUERY
         * =====================================================
         *
         * Example:
         *
         * client 192.168.10.24#53142 query:
         * login.microsoftonline.com IN A +E(0)K
         *
         * Normalized result:
         *
         * eventType  = dns_query
         * source     = dns
         * service    = dns
         * sourceIp   = 192.168.10.24
         * sourcePort = 53142
         * query      = login.microsoftonline.com
         * queryType  = A
         */

        let dnsMatch =
            message.match(

                /client\s+([0-9a-fA-F:.]+)#(\d+)\s+query:\s+(\S+)\s+IN\s+([A-Z0-9]+)\b/i

            );


        if (dnsMatch) {

            event.sourceIp =
                dnsMatch[1];


            event.sourcePort =
                Number(
                    dnsMatch[2]
                );


            event.query =
                dnsMatch[3];


            event.queryType =
                dnsMatch[4];


            event.eventType =
                "dns_query";


            event.source =
                "dns";


            event.service =
                "dns";


            event.severity =
                "info";


            event.message =
                message;


            return event;

        }


        dnsMatch =
            message.match(

                /client\s+([0-9a-fA-F:.]+)#(\d+)\s+response:\s+(\S+)\s+([A-Z0-9]+)\s+([0-9a-fA-F:.]+)\s+TTL=(\d+)/i

            );


        if (dnsMatch) {

            event.sourceIp =
                dnsMatch[1];


            event.sourcePort =
                Number(
                    dnsMatch[2]
                );


            event.query =
                dnsMatch[3];


            event.queryType =
                dnsMatch[4];


            event.responseIp =
                dnsMatch[5];


            event.ttl =
                Number(
                    dnsMatch[6]
                );


            event.eventType =
                "dns_response";


            event.source =
                "dns";


            event.service =
                "dns";


            event.severity =
                "info";


            event.message =
                message;


            return event;

        }


        /*
         * =====================================================
         * FAILED LOGIN
         * =====================================================
         */

        match =
            message.match(

                /Failed password for (?:invalid user )?(\S+) from ([0-9a-fA-F:.]+)/i

            );


        if (match) {

            event.username =
                match[1];


            event.sourceIp =
                match[2];


            event.eventType =
                "login_failed";


            event.severity =
                "high";


            event.source =
                "ssh";


            event.service =
                "ssh";


            event.message =
                message;


            return event;

        }


        /*
         * =====================================================
         * SUCCESSFUL LOGIN
         * =====================================================
         */

        match =
            message.match(

                /Accepted (?:password|publickey) for (\S+) from ([0-9a-fA-F:.]+)/i

            );


        if (match) {

            event.username =
                match[1];


            event.sourceIp =
                match[2];


            event.eventType =
                "login_success";


            event.severity =
                "info";


            event.source =
                "ssh";


            event.service =
                "ssh";


            event.message =
                message;


            return event;

        }


        /*
         * =====================================================
         * CONNECTION CLOSED
         * =====================================================
         */

        match =
            message.match(

                /Connection closed by ([0-9a-fA-F:.]+)/i

            );


        if (match) {

            event.sourceIp =
                match[1];


            event.eventType =
                "connection_closed";


            event.source =
                "ssh";


            event.service =
                "ssh";


            event.message =
                message;


            return event;

        }


        /*
         * =====================================================
         * SSH INVALID USER
         * =====================================================
         */

        match =
            message.match(

                /Invalid user (\S+) from ([0-9a-fA-F:.]+)/i

            );


        if (match) {

            event.username =
                match[1];


            event.sourceIp =
                match[2];


            event.eventType =
                "login_failed";


            event.severity =
                "high";


            event.source =
                "ssh";


            event.service =
                "ssh";


            event.message =
                message;


            return event;

        }


        /*
         * =====================================================
         * SUDO / PRIVILEGE ESCALATION
         * =====================================================
         */

        if (

            /sudo/i.test(message)

            &&

            /(session opened|COMMAND=)/i.test(message)

        ) {

            event.eventType =
                "privilege_escalation";


            event.severity =
                "high";


            event.source =
                "linux";


            event.service =
                "sudo";


            event.message =
                message;


            return event;

        }


        /*
         * =====================================================
         * USER CREATION
         * =====================================================
         */

        if (

            /(useradd|new user|user created)/i.test(message)

        ) {

            event.eventType =
                "user_created";


            event.severity =
                "medium";


            event.source =
                "linux";


            event.message =
                message;


            return event;

        }


        /*
         * =====================================================
         * PASSWORD MODIFICATION
         * =====================================================
         */

        if (

            /(passwd|password changed|password updated)/i.test(message)

        ) {

            event.eventType =
                "password_changed";


            event.severity =
                "medium";


            event.source =
                "linux";


            event.message =
                message;


            return event;

        }


        /*
         * =====================================================
         * GENERIC FALLBACK
         * =====================================================
         *
         * If SyslogParser does not recognize the event,
         * GenericParser tries to classify it.
         *
         * We preserve all fields already extracted by
         * SyslogParser whenever they exist.
         */

        const genericEvent =
            GenericParser.parseLine(
                message
            );


        return {

            ...genericEvent,


            /*
             * Preserve SyslogParser fields
             */

            hostname:
                event.hostname ||
                genericEvent.hostname,


            eventTime:
                event.eventTime ||
                genericEvent.eventTime,


            username:
                event.username ||
                genericEvent.username,


            sourceIp:
                event.sourceIp ||
                genericEvent.sourceIp,


            destinationIp:
                event.destinationIp ||
                genericEvent.destinationIp,


            sourcePort:
                event.sourcePort ||
                genericEvent.sourcePort,


            destinationPort:
                event.destinationPort ||
                genericEvent.destinationPort,


            source:
                genericEvent.source !== "generic"
                    ? genericEvent.source
                    : event.source,


            service:
                event.service ||
                genericEvent.service ||
                null,


            severity:
                event.severity !== "info"
                    ? event.severity
                    : genericEvent.severity,


            eventType:
                genericEvent.eventType !== "unknown"
                    ? genericEvent.eventType
                    : event.eventType,


            message:
                event.message !== line
                    ? event.message
                    : genericEvent.message,


            /*
             * Preserve DNS fields
             */

            query:
                event.query ||
                genericEvent.query ||
                null,


            queryType:
                event.queryType ||
                genericEvent.queryType ||
                null,


            responseIp:
                event.responseIp ||
                genericEvent.responseIp ||
                null,


            ttl:
                event.ttl ??
                genericEvent.ttl ??
                null,


            dnsServer:
                event.dnsServer ||
                genericEvent.dnsServer ||
                null,


            rcode:
                event.rcode ??
                genericEvent.rcode ??
                null,


            rawLog:
                line

        };

    }

}


module.exports = SyslogParser;