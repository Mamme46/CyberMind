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

    static async getUploads(req, res) {

    try {

        const uploads = await UploadService.getUploads();

        res.json({

            success: true,

            data: uploads

        });

    }

    catch (error) {

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

}

static async getUpload(req, res) {

    try {

        const upload = await UploadService.getUpload(

            req.params.id

        );

        res.json({

            success: true,

            data: upload

        });

    }

    catch (error) {

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

}

}

module.exports=UploadController;