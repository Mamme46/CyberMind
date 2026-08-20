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