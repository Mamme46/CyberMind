const InvestigationService = require("../services/investigation.service");

class InvestigationController{

    static async investigate(req,res){

        try{

            const result = await InvestigationService.investigate(

                req.params.alertId

            );

            res.json({

                success:true,

                data:result

            });

        }

        catch(error){

            res.status(404).json({

                success:false,

                message:error.message

            });

        }

    }

}

module.exports = InvestigationController;