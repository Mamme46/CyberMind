const { Router } = require("express");

const LogController = require("../controllers/log.controller");

const authMiddleware = require("../middleware/auth.middleware");

const router = Router();

router.get(
    "/:uploadId",
    authMiddleware,
    LogController.getLogs
);

module.exports = router;