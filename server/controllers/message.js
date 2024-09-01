import Message from '../models/Message.js'
import User from "../models/User.js";
import Chat from "../models/Chat.js";


export const allMessages = async (req, res) => {
    try {
        const messages = await Message.find({ chat: req.params.chatId })
            .populate("sender", "firstName picturePath email")
            .populate({ path: "chat", select: "user" });
        res.json(messages);
       
    } catch (error) {
        res.status(400);
        throw new Error(error.message);
    }
};

export const sendMessage = async (req, res) => {

    const { content, chatId, sender } = req.body;
    if (!content || !chatId || !sender) {
        return res.sendStatus(400);
    }

    var newMessage = {
        sender: sender,
        content: content,
        chat: chatId,
    };


    try {
        var message = await Message.create(newMessage);

        message = await message.populate({
            path: "sender",
            select: "firstName lastName picturePath"
        });
        message = await message.populate({
            path: "chat",
            select: 'users'
        });

        message = await User.populate(message, {
            path: "chat.users",
            select: "firstName lastName email",
        });


        await Chat.findByIdAndUpdate(req.body.chatId, { latestMessage: message });

        res.json(message);
    } catch (error) {
        res.status(400);
        throw new Error(error.message);
    }
};

