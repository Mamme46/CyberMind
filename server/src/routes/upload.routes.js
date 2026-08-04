const express=require("express");

const router=express.Router();

const UploadController=require("../controllers/upload.controller");

const auth=require("../middleware/auth.middleware");

const upload=require("../middleware/upload.middleware");

router.post(

    "/",

    auth,

    upload.single("log"),

    UploadController.upload

);

module.exports=router;