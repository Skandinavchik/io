import { Message } from "../models/messageModel.js";



const getMessages = async (req, res) => {
    try {
        const messages = await Message.find({
            conversationId: req.params.id,
        });

        res.status(200).json({
            status: 'success',
            results: messages.length,
            data: {
                messages,
            },
        });

    } catch (error) {
        res.status(500).json({
            status: 'failed',
            message: error.message,
        });
    }
};

const createMessage = async (req, res) => {
    try {
        const newMessage = await Message.create(req.body);

        res.status(201).json({
            status: 'success',
            data: {
                message: newMessage,
            },
        });

    } catch (error) {
        res.status(500).json({
            status: 'failed',
            message: error.message,
        });
    }
};

export { getMessages, createMessage };