const { Router } = require("express");

const DashboardController = require("../controllers/dashboard.controller");

const authMiddleware = require("../middleware/auth.middleware");

const router = Router();

router.get(

    "/stats",

    authMiddleware,

    DashboardController.getStats

);

router.get(

    "/recent-alerts",

    authMiddleware,

    DashboardController.getRecentAlerts

);

module.exports = router;