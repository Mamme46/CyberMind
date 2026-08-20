const AIConversationService = require("../services/aiConversation.service");

class AIConversationController {

    static async create(req,res){

        try{

            const conversation =

                await AIConversationService.createConversation(

                    req.user.id

                );

            res.status(201).json({

                success:true,

                data:conversation

            });

        }

        catch(error){

            res.status(500).json({

                success:false,

                message:error.message

            });

        }

    }

    static async getAll(req,res){

        try{

            const conversations =

                await AIConversationService.getConversations(

                    req.user.id

                );

            res.json({

                success:true,

                data:conversations

            });

        }

        catch(error){

            res.status(500).json({

                success:false,

                message:error.message

            });

        }

    }

    static async getOne(req,res){

        try{

            const conversation =

                await AIConversationService.getConversation(

                    req.params.id

                );

            res.json({

                success:true,

                data:conversation

            });

        }

        catch(error){

            res.status(500).json({

                success:false,

                message:error.message

            });

        }

    }

    static async delete(req,res){

        try{

            await AIConversationService.deleteConversation(

                req.params.id

            );

            res.json({

                success:true,

                message:"Conversation deleted."

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

module.exports = AIConversationController;