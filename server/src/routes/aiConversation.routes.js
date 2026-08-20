const { Router } = require("express");

const router = Router();

const authMiddleware = require("../middleware/auth.middleware");

const AIConversationController = require("../controllers/aiConversation.controller");

router.get(

    "/",

    authMiddleware,

    AIConversationController.getAll

);

router.post(

    "/",

    authMiddleware,

    AIConversationController.create

);

router.get(

    "/:id",

    authMiddleware,

    AIConversationController.getOne

);

router.delete(

    "/:id",

    authMiddleware,

    AIConversationController.delete

);

module.exports = router;