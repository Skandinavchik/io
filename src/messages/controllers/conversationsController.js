import { Conversation } from '../models/conversationModel.js';



const getConversations = async (req, res) => {
    try {
        const conversations = await Conversation.find({
            members: { $in: [req.params.id] },
        });

        res.status(201).json({
            status: 'success',
            results: conversations.length,
            data: {
                conversations,
            },
        });

    } catch (error) {
        res.status(500).json({
            status: 'failed',
            message: error.message,
        });
    }
};

const createConversation = async (req, res) => {
    try {
        const { senderId, recieverId } = req.body;

        const newConversation = await Conversation.create({
            members: [senderId, recieverId],
        });

        res.status(201).json({
            status: 'success',
            data: {
                conversation: newConversation,
            },
        });

    } catch (error) {
        res.status(500).json({
            status: 'failed',
            message: error.message,
        });
    }
};

export { getConversations, createConversation };