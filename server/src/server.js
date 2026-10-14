const app = require("./app");
const { connectDatabase } = require("./config/database");
const env = require("./config/env");
const AIService = require("./services/ai/ai.service");

const PORT = env.PORT || 3000;

async function start() {
  await connectDatabase();

  app.listen(PORT, () => {
    console.log(` CyberMind API running on port ${PORT}`);

    AIService.warmUp();
  });
}

start();