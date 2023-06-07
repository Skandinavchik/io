import mongoose from 'mongoose';


const conversationSchema = new mongoose.Schema({
    members: {
        type: [String],
    },
}, { timestamps: true });

const Conversation = mongoose.model('Conversation', conversationSchema);

export { Conversation };