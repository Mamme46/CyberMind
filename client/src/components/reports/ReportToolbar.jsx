const response = await axios.post(

    `${env.OLLAMA_URL}/api/generate`,

    {

        model: env.OLLAMA_MODEL,

        prompt,

        stream: false

    }

);

const report = response.data.response;

await Report.create({

    alertId: alert.id,

    title: alert.title,

    content: report,

    model: env.OLLAMA_MODEL

});

return report;