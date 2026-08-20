const { Router } = require("express");

const router = Router();

const authMiddleware = require("../middleware/auth.middleware");

const ReportController = require("../controllers/report.controller");

router.get(

    "/",

    authMiddleware,

    ReportController.getReports

);

router.get(

    "/:id",

    authMiddleware,

    ReportController.getReport

);

router.delete(

    "/:id",

    authMiddleware,

    ReportController.deleteReport

);

router.get(

    "/:id/pdf",

    authMiddleware,

    ReportController.downloadPDF

);

module.exports = router;