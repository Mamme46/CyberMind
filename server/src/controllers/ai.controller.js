const AIService = require("../services/ai/ai.service");
const AIConversationService = require("../services/aiConversation.service");
const AIReportService = require("../services/ai/aiReport.service");

class AIController {

    static async explainAlert(req,res){

        try{

            const response = await AIService.explainAlert(

                req.params.alertId

            );

            res.json({

                success:true,

                response

            });

        }

        catch(error){

            res.status(500).json({

                success:false,

                message:error.message

            });

        }

    }

    static async chat(req, res) {

    try {

        let {

            conversationId,

            alertId,

            message

        } = req.body;

        if (!conversationId) {

            const conversation =

                await AIConversationService.createConversation(

                    req.user.id

                );

            conversationId = conversation.id;

        }

        await AIConversationService.addMessage(

            conversationId,

            "user",

            message

        );

        const ollamaResponse = await AIService.chat(

            alertId,

            message

        );

        res.setHeader(

            "Content-Type",

            "text/plain"

        );

        let assistantMessage = "";

        ollamaResponse.data.on(

            "data",

            chunk => {

                assistantMessage += chunk.toString();

                res.write(chunk);

            }

        );

        ollamaResponse.data.on(

            "end",

            async () => {

                try {

                    let finalResponse = "";

                    const lines = assistantMessage
                        .split("\n")
                        .filter(line => line.trim());

                    for (const line of lines) {

                        const json = JSON.parse(line);

                        if (json.response) {

                            finalResponse += json.response;

                        }

                    }

                    await AIConversationService.addMessage(

                        conversationId,

                        "assistant",

                        finalResponse

                    );

                    const title = message.length > 40

                        ? message.substring(0, 40) + "..."

                        : message;

                    await AIConversationService.renameConversation(

                        conversationId,

                        title

                    );

                }

                catch (err) {

                    console.error(err);

                }

                res.end();

            }

        );

    }

    catch (error) {

    console.error("===== AI CHAT ERROR =====");
    console.error(error);

    res.status(500).json({

        success: false,

        message: error.message

    });

}

}

static async generateReport(req, res) {

    try {

        const report = await AIReportService.generate(

            req.params.alertId

        );

        res.json({

            success: true,

            report

        });

    }

    catch (error) {

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

}

}

module.exports = AIController;