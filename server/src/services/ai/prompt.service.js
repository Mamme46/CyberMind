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

You are a Senior SOC Analyst writing an official incident
report for a security team. Your audience is other analysts
and management who were not present during the investigation,
so every statement must be self-contained, specific and
grounded in the data below.

IMPORTANT RULES:

1. Use ONLY the information provided below.
2. Do NOT invent IP addresses, usernames, commands, events,
   timestamps or other facts.
3. Do NOT assume that an event occurred if it is not present.
4. Clearly distinguish observed facts from your assessment.
5. Reference the actual hosts, usernames, IPs, ports, commands
   and timestamps from the DETECTION and RELATED EVENTS
   sections wherever relevant, instead of speaking in
   generalities.
6. Every field below must contain real, substantive analysis.
   Never return an empty string, "N/A", "-", "unknown" or any
   other placeholder. If a data point is genuinely absent from
   the evidence, say so explicitly in a full sentence (for
   example "No destination IP was captured for this event.").
7. Write in clear, professional, technical English, the way a
   real SOC report reads — full sentences, no bullet-only
   fragments, no Markdown.
8. Return ONLY valid JSON, matching the structure below
   exactly. No explanations outside the JSON object.

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

    "technical_analysis": {
        "what_happened": "",
        "detection_reason": "",
        "evidence_analysis": "",
        "affected_entities": ""
    },

    "risk_assessment": {
        "level": "",
        "impact": "",
        "uncertainties": ""
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
FIELD-BY-FIELD GUIDANCE
============================================================

assessment.summary: 2-3 sentences giving a management-level
overview of the incident: what was detected, on which system,
and why it matters.

assessment.attack_type: the short technical name of the
attack or technique observed (e.g. "Reverse Shell",
"Brute Force Authentication", "DNS Spoofing").

assessment.confidence: "Low", "Medium" or "High", based on how
directly the evidence supports the conclusion.

assessment.impact: one sentence stating the concrete
consequence if the activity is not contained.

technical_analysis.what_happened: 2-4 sentences narrating the
sequence of events in the order they occurred, naming the
specific host(s), user(s), IP(s) and command(s) involved.

technical_analysis.detection_reason: explain precisely which
behavior or pattern in the events triggered this detection
rule (e.g. a specific process, command syntax, connection
pattern, or repeated failure count).

technical_analysis.evidence_analysis: interpret what the
observed commands or network activity indicate about the
attacker's technique or intent, referencing the actual
evidence.

technical_analysis.affected_entities: list, in prose, the
hosts, accounts and services impacted by this incident.

risk_assessment.level: "Critical", "High", "Medium" or "Low".

risk_assessment.impact: 1-2 sentences on the potential
business or technical impact if this incident is left
unaddressed.

risk_assessment.uncertainties: state what is NOT yet known
from the available evidence and would require further
investigation to confirm (e.g. whether the attacker achieved
persistence, scope of data accessed). If the evidence is
conclusive, say so explicitly instead of leaving this blank.

recommendations: 2-4 concrete, prioritized actions a SOC
analyst should take next, each with a "priority" of
"Critical", "High", "Medium" or "Low", a short imperative
"action", and a "reason" explaining why it matters for this
specific incident.

conclusion: 2-3 sentences summarizing the incident and the
overall recommended posture (contain, monitor, or escalate).

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