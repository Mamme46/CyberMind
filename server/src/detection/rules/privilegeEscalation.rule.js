function detect(events) {

    const detections = [];

    const privilegeEvents =
        events.filter(event => {

            const eventType =
                String(
                    event.event_type || ""
                ).toLowerCase();


            return (

                eventType ===
                "privilege_escalation"

                ||

                eventType ===
                "privilege_change"

                ||

                eventType ===
                "role_changed"

                ||

                eventType ===
                "admin_granted"

                ||

                eventType ===
                "root_access"

            );

        });

    for (
        const event
        of privilegeEvents
    ) {

        detections.push({

            title:
                "Privilege Escalation",

            description:
                event.username
                    ? `Privilege escalation detected for user "${event.username}".`
                    : "Privilege escalation activity detected.",

            severity:
                "high",

            sourceIp:
                event.source_ip ||
                null,

            username:
                event.username ||
                null,

            eventIds: [

                event.id

            ]

        });

    }


    return detections;

}


module.exports = {

    name:
        "Privilege Escalation",

    description:
        "Detects events indicating that a user or process obtained higher privileges.",

    severity:
        "high",

    mitre:
        "T1548",

    detect

};