const express = require("express");

const router = express.Router();

const SecurityController =
    require("../controllers/security.controller");

const auth =
    require("../middleware/auth.middleware");

router.post(
    "/scan",
    auth,
    SecurityController.scan
);

module.exports = router;