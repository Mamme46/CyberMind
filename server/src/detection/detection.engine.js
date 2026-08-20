const bruteForceRule = require("./rules/bruteForce.rule");
const failedThenSuccessRule = require("./rules/failedThenSuccess.rule");
const dnsSpoofing = require("./rules/dnsSpoofing.rule");
const portScanRule = require("./rules/portScan.rule");

const reverseShellRule =
    require("./rules/reverseShell.rule");

const multipleHostsSameUserRule =
    require("./rules/multipleHostsSameUser.rule");

const privilegeEscalationRule =
    require("./rules/privilegeEscalation.rule");


const rules = [

    bruteForceRule,

    failedThenSuccessRule,

    dnsSpoofing,

    portScanRule,

    multipleHostsSameUserRule,

    reverseShellRule,

    privilegeEscalationRule

];

class DetectionEngine {

    static run(events) {

    console.log("ENGINE STARTED");

    console.log(
        "Number of events:",
        events.length
    );

    console.log(
        "Rules:",
        rules.map(rule => rule.name)
    );

    const detections = [];

    for (const rule of rules) {

        console.log(
            "Running rule:",
            rule.name
        );

        try {

            const results = rule.detect(events);

            console.log(
                "Results:",
                results
            );

            for (const result of results) {

                detections.push({

                    rule,

                    ...result

                });

            }

        }

        catch (error) {

            console.error(

                `Detection rule failed: ${rule.name}`,

                error

            );

        }

    }

    console.log(
        "Total detections:",
        detections.length
    );

    return detections;

}

}

module.exports = DetectionEngine;