const { Router } = require("express");

const AuthController = require("../controllers/auth.controller");
const authMiddleware = require("../middleware/auth.middleware");

const router = Router();

/*
    POST /api/auth/register
*/
router.post("/register", AuthController.register);

/*
    POST /api/auth/login
*/
router.post("/login", AuthController.login);

router.get(
    "/profile",
    authMiddleware,
    (req, res) => {

        res.json({
            success: true,
            user: req.user
        });

    }
);

module.exports = router;