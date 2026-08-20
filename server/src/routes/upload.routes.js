const express=require("express");

const router=express.Router();

const UploadController=require("../controllers/upload.controller");

const auth=require("../middleware/auth.middleware");

const upload=require("../middleware/upload.middleware");

router.get(
    "/",
    auth,
    UploadController.getUploads
);

router.get(
    "/:id",
    auth,
    UploadController.getUpload
);

router.post(

    "/",

    auth,

    upload.single("log"),

    UploadController.upload

);

module.exports=router;