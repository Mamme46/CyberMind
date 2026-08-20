const {Router}=require("express");

const router=Router();

const auth=require("../middleware/auth.middleware");

const AlertController=require("../controllers/alert.controller");

router.get(

    "/",

    auth,

    AlertController.getAlerts

);

router.put(
    "/:id/status",
    auth,
    AlertController.updateStatus
);

module.exports=router;