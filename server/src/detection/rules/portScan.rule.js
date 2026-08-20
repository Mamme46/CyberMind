const rule = {

    name: "Port Scan",

    description:
        "Detects network scanning behavior by identifying a source contacting many different ports or destinations.",

    severity: "high",

    mitre: "T1046",

    detect(events) {

        const networkEvents = events.filter(event => {

            return (

                event.source_ip &&

                (
                    event.destination_port ||
                    event.destination_ip
                )

            );

        });


        if (networkEvents.length === 0) {

            return [];

        }


        /*
         * =====================================================
         * PORT-BASED SCANNING
         *
         * Same source
         *      +
         * same destination
         *      +
         * many different destination ports
         *
         * Example:
         *
         * 10.0.0.5 -> 192.168.1.10:21
         * 10.0.0.5 -> 192.168.1.10:22
         * 10.0.0.5 -> 192.168.1.10:23
         * ...
         * =====================================================
         */

        const hostGroups = {};


        for (const event of networkEvents) {

            if (
                !event.destination_ip ||
                !event.destination_port
            ) {

                continue;

            }


            const key =
                `${event.source_ip}|${event.destination_ip}`;


            if (!hostGroups[key]) {

                hostGroups[key] = [];

            }


            hostGroups[key].push(event);

        }


        const detections = [];


        for (
            const [
                key,
                sourceEvents
            ]
            of Object.entries(hostGroups)
        ) {

            const uniquePorts =
                new Set(

                    sourceEvents
                        .map(
                            event =>
                                Number(
                                    event.destination_port
                                )
                        )
                        .filter(
                            port =>
                                Number.isInteger(port)
                        )

                );


            /*
             * 10 or more different ports
             * against the same host.
             */

            if (
                uniquePorts.size >= 10
            ) {

                const sourceIp =
                    sourceEvents[0].source_ip;


                const destinationIp =
                    sourceEvents[0].destination_ip;


                detections.push({

                    title:
                        "Port Scan",

                    description:
                        `Possible port scan detected from ${sourceIp} against ${destinationIp}: ${uniquePorts.size} different destination ports were contacted.`,

                    severity:
                        "high",

                    sourceIp,

                    username: null,

                    eventIds:
                        sourceEvents.map(
                            event => event.id
                        )

                });

            }

        }


        /*
         * =====================================================
         * HORIZONTAL SCANNING
         *
         * Same source
         *      +
         * same destination port
         *      +
         * many different destination hosts
         *
         * Example:
         *
         * attacker -> 10.0.0.1:445
         * attacker -> 10.0.0.2:445
         * attacker -> 10.0.0.3:445
         * ...
         * =====================================================
         */

        const portGroups = {};


        for (const event of networkEvents) {

            if (
                !event.destination_ip ||
                !event.destination_port
            ) {

                continue;

            }


            const key =
                `${event.source_ip}|${event.destination_port}`;


            if (!portGroups[key]) {

                portGroups[key] = [];

            }


            portGroups[key].push(event);

        }


        for (
            const [
                key,
                sourceEvents
            ]
            of Object.entries(portGroups)
        ) {

            const uniqueHosts =
                new Set(

                    sourceEvents
                        .map(
                            event =>
                                event.destination_ip
                        )
                        .filter(Boolean)

                );


            /*
             * 10 or more different destination hosts.
             */

            if (
                uniqueHosts.size >= 10
            ) {

                const sourceIp =
                    sourceEvents[0].source_ip;


                const destinationPort =
                    sourceEvents[0]
                        .destination_port;


                detections.push({

                    title:
                        "Port Scan",

                    description:
                        `Possible network scan detected from ${sourceIp}: ${uniqueHosts.size} different hosts were contacted on destination port ${destinationPort}.`,

                    severity:
                        "high",

                    sourceIp,

                    username: null,

                    eventIds:
                        sourceEvents.map(
                            event => event.id
                        )

                });

            }

        }


        return detections;

    }

};


module.exports = rule;