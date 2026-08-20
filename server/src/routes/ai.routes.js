const { Router } = require("express");

const router = Router();

const authMiddleware = require("../middleware/auth.middleware");

const AIController = require("../controllers/ai.controller");

router.post(

    "/explain-alert/:alertId",

    authMiddleware,

    AIController.explainAlert

);

router.post(

    "/chat",

    authMiddleware,

    AIController.chat

);

router.post(

    "/report/:alertId",

    authMiddleware,

    AIController.generateReport

);

module.exports = router;