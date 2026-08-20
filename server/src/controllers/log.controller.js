const LogService = require("../services/log.service");

class LogController {

    static async getLogs(req,res){

        try{

            const uploadId = req.params.uploadId;

            const logs = await LogService.getLogs(uploadId);

            res.json({

                success:true,

                data:logs

            });

        }

        catch(error){

            res.status(500).json({

                success:false,

                message:error.message

            });

        }

    }

}

module.exports = LogController;