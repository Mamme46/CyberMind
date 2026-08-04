const UploadService=require("../services/upload.service");

class UploadController{

    static async upload(req,res){

        try{

            const upload=await UploadService.upload(

                req.user.id,

                req.file

            );

            res.status(201).json({

                success:true,

                data:upload

            });

        }

        catch(error){

            res.status(400).json({

                success:false,

                message:error.message

            });

        }

    }

}

module.exports=UploadController;