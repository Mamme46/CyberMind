const AIConversation = require("../models/aiConversation.model");

const AIMessage = require("../models/aiMessage.model");

class AIConversationService {

    static async createConversation(userId) {

        return await AIConversation.create(

            userId

        );

    }

    static async getConversations(userId) {

        return await AIConversation.findAllByUser(

            userId

        );

    }

    static async getConversation(id) {

        const conversation =

            await AIConversation.findById(id);

        const messages =

            await AIMessage.findByConversation(id);

        return {

            conversation,

            messages

        };

    }

    static async addMessage(

        conversationId,

        role,

        content

    ) {

        const message =

            await AIMessage.create(

                conversationId,

                role,

                content

            );

        await AIConversation.touch(

            conversationId

        );

        return message;

    }

    static async renameConversation(

        conversationId,

        title

    ) {

        return await AIConversation.updateTitle(

            conversationId,

            title

        );

    }

    static async deleteConversation(id) {

        await AIConversation.delete(id);

    }

}

module.exports = AIConversationService;