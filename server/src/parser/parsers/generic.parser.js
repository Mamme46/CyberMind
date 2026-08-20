class GenericParser {

    static parseLine(line) {

        const event = {

            eventTime: null,

            hostname: null,

            source: "generic",

            sourceIp: null,

            destinationIp: null,

            username: null,

            eventType: "unknown",

            severity: "info",

            message: line,

            rawLog: line

        };

        /*
         * Detect IPv4 / IPv6-like addresses
         */

        const ips = line.match(

            /\b(?:\d{1,3}\.){3}\d{1,3}\b/g

        );

        if (ips && ips.length > 0) {

            event.sourceIp = ips[0];

        }

        if (ips && ips.length > 1) {

            event.destinationIp = ips[1];

        }

        /*
         * Failed authentication
         */

        if (

            /(failed login|login failed|authentication failure|failed password|invalid password|authentication failed)/i
                .test(line)

        ) {

            event.eventType = "login_failed";

            event.severity = "high";

        }

        /*
         * Successful authentication
         */

        else if (

            /(successful login|login successful|login success|accepted password|authentication successful)/i
                .test(line)

        ) {

            event.eventType = "login_success";

        }

        /*
         * Port scan
         */

        else if (

            /(port scan|port scanning|nmap|masscan)/i
                .test(line)

        ) {

            event.eventType = "port_scan";

            event.severity = "high";

        }

        /*
         * Malware
         */

        else if (

            /(malware|trojan|ransomware|virus|worm)/i
                .test(line)

        ) {

            event.eventType = "malware_detected";

            event.severity = "critical";

        }

        /*
         * PowerShell
         */

        else if (

            /(powershell|encodedcommand|invoke-expression)/i
                .test(line)

        ) {

            event.eventType = "suspicious_powershell";

            event.severity = "high";

        }

        /*
         * DNS spoofing
         */

        else if (

            /(dns spoof|dns poisoning)/i
                .test(line)

        ) {

            event.eventType = "dns_spoofing";

            event.severity = "high";

        }

        /*
         * ARP spoofing
         */

        else if (

            /(arp spoof|arp poisoning)/i
                .test(line)

        ) {

            event.eventType = "arp_spoofing";

            event.severity = "high";

        }

        /*
         * Reverse shell
         */

        else if (

            /(reverse shell|bind shell|nc -e|bash -i)/i
                .test(line)

        ) {

            event.eventType = "reverse_shell";

            event.severity = "critical";

        }

        /*
         * New user
         */

        else if (

            /(useradd|new user|user created|account created)/i
                .test(line)

        ) {

            event.eventType = "user_created";

            event.severity = "medium";

        }

        /*
         * Password change
         */

        else if (

            /(password changed|password updated|passwd)/i
                .test(line)

        ) {

            event.eventType = "password_changed";

            event.severity = "medium";

        }

        /*
         * Privilege escalation
         */

        else if (

            /(privilege escalation|sudo|administrator|root privilege)/i
                .test(line)

        ) {

            event.eventType = "privilege_escalation";

            event.severity = "high";

        }

        return event;

    }

}

module.exports = GenericParser;