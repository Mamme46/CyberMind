const axios = require("axios");

const env = require("../../config/env");

const PromptService = require("./prompt.service");

const InvestigationService =
    require("../investigation.service");


class AIService {


    /*
     * =========================================================
     * EXPLAIN ALERT
     * =========================================================
     *
     * Used for the existing alert explanation feature.
     *
     * This method keeps the existing behavior.
     */

    static async explainAlert(alertId) {

        const investigation =
            await InvestigationService.investigate(
                alertId
            );


        const prompt =
            PromptService.explainAlert(
                investigation
            );


        return axios({

            method: "post",

            url:
                `${env.OLLAMA_URL}/api/generate`,

            responseType: "stream",

            data: {

                model:
                    env.OLLAMA_MODEL,

                prompt,

                stream: true

            }

        });

    }


    /*
     * =========================================================
     * GENERATE REPORT
     * =========================================================
     *
     * Dedicated method for AI incident reports.
     *
     * The prompt is already prepared by AIReportService /
     * PromptService.
     *
     * The model is explicitly asked to return JSON.
     */

    static async generateReport(prompt) {

        const response =
            await axios.post(

                `${env.OLLAMA_URL}/api/generate`,

                {

                    model:
                        env.OLLAMA_MODEL,

                    prompt,

                    stream: false,

                    /*
                     * Ollama should return JSON whenever
                     * possible.
                     *
                     * This is useful for structured reports.
                     */

                    format:
                        "json"

                }

            );


        const content =
            response.data?.response;


        if (
            !content
        ) {

            throw new Error(
                "AI returned an empty response"
            );

        }


        /*
         * =====================================================
         * PARSE JSON RESPONSE
         * =====================================================
         *
         * Qwen should return JSON because the report prompt
         * explicitly requires it.
         *
         * We still validate the response here instead of
         * trusting the model blindly.
         */

        let report;


        try {

            report =
                typeof content === "string"

                    ? JSON.parse(content)

                    : content;

        }

        catch (error) {

            console.error(
                "Invalid JSON returned by AI:",
                content
            );


            throw new Error(
                "AI returned an invalid JSON report"
            );

        }


        /*
         * =====================================================
         * BASIC VALIDATION
         * =====================================================
         *
         * Make sure the response is actually an object.
         */

        if (
            !report
            ||
            typeof report !== "object"
            ||
            Array.isArray(report)
        ) {

            throw new Error(
                "AI report has an invalid structure"
            );

        }


        return report;

    }


    /*
     * =========================================================
     * GENERATE CONVERSATION TITLE
     * =========================================================
     *
     * Produces a short, human-readable title summarizing the
     * intent of the first message of a conversation, similar
     * to how ChatGPT/Claude name new chats.
     */

    static async generateTitle(message) {

        const prompt =
            "Summarize the topic of the following user message " +
            "into a short conversation title.\n\n" +
            "Rules:\n" +
            "- 3 to 6 words\n" +
            "- No quotation marks\n" +
            "- No trailing punctuation\n" +
            "- Reply with only the title, nothing else\n\n" +
            `Message: ${message}\n\n` +
            "Title:";

        try {

            const response =
                await axios.post(

                    `${env.OLLAMA_URL}/api/generate`,

                    {

                        model:
                            env.OLLAMA_MODEL,

                        prompt,

                        stream: false

                    }

                );

            let title =
                (response.data?.response || "")
                    .trim()
                    .replace(/^["'“”]+|["'“”]+$/g, "")
                    .replace(/[.!?]+$/, "");

            if (!title) {

                throw new Error("Empty title generated");

            }

            if (title.length > 60) {

                title = title.slice(0, 60).trim() + "...";

            }

            return title;

        }

        catch (error) {

            console.error(
                "Title generation failed, falling back:",
                error.message
            );

            return message.length > 40
                ? message.substring(0, 40) + "..."
                : message;

        }

    }


    /*
     * =========================================================
     * CHAT
     * =========================================================
     *
     * Existing conversational AI functionality.
     *
     * This is intentionally kept separate from report
     * generation.
     */

    static async chat(
        alertId,
        question
    ) {

        let prompt;


        if (
            alertId
        ) {

            const investigation =
                await InvestigationService.investigate(
                    alertId
                );


            prompt =
                PromptService.chat(

                    investigation,

                    question

                );

        }

        else {

            prompt =
                question;

        }


        return axios({

            method: "post",

            url:
                `${env.OLLAMA_URL}/api/generate`,

            responseType: "stream",

            data: {

                model:
                    env.OLLAMA_MODEL,

                prompt,

                stream: true

            }

        });

    }

}


module.exports = AIService;