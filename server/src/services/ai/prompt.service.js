class PromptService {


    /*
     * =========================================================
     * EXPLAIN ALERT
     * =========================================================
     */

    static explainAlert(investigation) {

        return `

You are a Senior SOC Analyst.

Analyze this cybersecurity incident.

Alert:
${JSON.stringify(
    investigation.alert,
    null,
    2
)}

Summary:
${JSON.stringify(
    investigation.summary,
    null,
    2
)}

Timeline:
${JSON.stringify(
    investigation.timeline,
    null,
    2
)}

Respond ONLY in JSON.

{
    "executiveSummary": "",
    "technicalAnalysis": "",
    "riskAssessment": "",
    "recommendations": [
        ""
    ],
    "mitreTechniques": [
        {
            "id": "",
            "name": ""
        }
    ]
}

`;

    }


    /*
     * =========================================================
     * GENERATE INCIDENT REPORT
     * =========================================================
     */

    static generateReport(reportData) {

        return `

You are a Senior SOC Analyst specialized in cybersecurity
incident investigation.

Your task is to analyze the security alert and its associated
events and produce a professional incident report.

IMPORTANT RULES:

1. Use ONLY the information provided below.
2. Do NOT invent IP addresses, usernames, commands, events,
   timestamps or other facts.
3. Do NOT assume that an event occurred if it is not present.
4. Clearly distinguish observed facts from your assessment.
5. Keep the report concise and technically accurate.
6. Return ONLY valid JSON.
7. Do not use Markdown.
8. Do not add explanations outside the JSON object.

============================================================
ALERT
============================================================

${JSON.stringify(
    reportData.alert,
    null,
    2
)}

============================================================
DETECTION
============================================================

${JSON.stringify(
    reportData.detection,
    null,
    2
)}

============================================================
RELATED EVENTS
============================================================

${JSON.stringify(
    reportData.events,
    null,
    2
)}

============================================================
REPORT FORMAT
============================================================

Return exactly this JSON structure:

{
    "assessment": {
        "summary": "",
        "attack_type": "",
        "confidence": "",
        "severity": "",
        "impact": ""
    },

    "findings": [
        {
            "title": "",
            "description": "",
            "evidence": [],
            "severity": ""
        }
    ],

    "timeline": [
        {
            "time": "",
            "event": "",
            "description": ""
        }
    ],

    "mitre": [
        {
            "id": "",
            "name": "",
            "reason": ""
        }
    ],

    "indicators": {
        "source_ips": [],
        "destination_ips": [],
        "usernames": [],
        "hostnames": [],
        "domains": [],
        "ports": [],
        "commands": []
    },

    "recommendations": [
        {
            "priority": "",
            "action": "",
            "reason": ""
        }
    ],

    "conclusion": ""
}

============================================================
REPORT QUALITY
============================================================

The assessment must explain:

- What happened
- Why the detection was triggered
- What evidence supports the detection
- Which systems or accounts are involved
- What the potential impact is
- What should be done next

The findings must be based on actual events.

The timeline must use the timestamps from the events.

MITRE ATT&CK techniques must only be included when they
reasonably correspond to the observed behavior.

Indicators of compromise must contain only observable values
present in the alert or events.

Recommendations must be practical and relevant to the
detected incident.

Return ONLY the JSON object.

`;

    }


    /*
     * =========================================================
     * CHAT
     * =========================================================
     */

    static chat(
        investigation,
        question
    ) {

        return `

You are CyberMind AI, an expert SOC analyst.

Answer the user's question based ONLY on the following
investigation data.

Alert:

${JSON.stringify(
    investigation.alert,
    null,
    2
)}

Summary:

${JSON.stringify(
    investigation.summary,
    null,
    2
)}

Timeline:

${JSON.stringify(
    investigation.timeline,
    null,
    2
)}

Question:

${question}

Give a concise and professional answer.

`;

    }

}


module.exports = PromptService;