const { Router } = require("express");

const router = Router();

const authMiddleware = require("../middleware/auth.middleware");

const InvestigationController = require("../controllers/investigation.controller");

router.get(

    "/:alertId",

    authMiddleware,

    InvestigationController.investigate

);

module.exports = router;