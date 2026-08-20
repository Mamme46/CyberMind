const Alert=require("../models/alert.model");

class AlertController{

    static async getAlerts(req,res){

        try{

            const alerts=await Alert.findAll();

            res.json({

                success:true,

                data:alerts

            });

        }

        catch(error){

            res.status(500).json({

                success:false,

                message:error.message

            });

        }

    }

    static async updateStatus(req, res) {

    try {

        const alert = await Alert.updateStatus(

            req.params.id,

            req.body.status

        );

        res.json({

            success: true,

            data: alert

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

module.exports=AlertController;