import cloudinary from "../lib/cloudnary.js";
import Message from "../model/Message.model.js";
import User from "../model/User.model.js";

import { AsyncHandeler } from "../utils/AsyncHandeler.js"

export const messageSidebar = AsyncHandeler(async (req, res) => {
    const loggedinuser = req.user._id
    const users = await User.find({ _id: { $ne: loggedinuser } }).select("-password")
    if (users.length === 0) {
        return res.status(404).json({
            message: "No user found",
            success: false
        })
    }
    res.status(200).json({
        message: "Useres found succesfully",
        success: true,
        users
    })
})
export const getmessages = AsyncHandeler(async (req, res) => {
    const { id: userToChatId } = req.params;
    const myId = req.user._id
    const messages = await Message.find({
        $or: [
            { senderId: myId, reciverId: userToChatId },
            { senderId: userToChatId, reciverId: myId }
        ]
    }).sort({ createdAt: 1 })
    res.status(200).json({
        message: "find all messages succesfully",
        success: true,
        messages
    })
})
export const SendMessage = AsyncHandeler(async (req, res) => {
    const { text, image } = req.body
    if (!text && !image) {
        return res.status(400).json({
            message: "please provide image or text"
        })
    }
    const { id: reciverId } = req.params
    const senderId = req.user._id
    if (senderId?.toString() === reciverId?.toString()) {
        return res.status(400).json({
            message: "you cant send message to yourself",
            success: false
        })
    }
    const reciverIdexist = await User.exists({ _id: reciverId });
    if (!reciverIdexist) {
        return res.status(400).json({
            message: "reciver not found ",
            success: false
        })
    }
    let imageurl;
    if (image) {
        const uploadResponse = await cloudinary.uploader.upload(image)
        imageurl = uploadResponse.secure_url
    }
    const newMessage = new Message({
        senderId,
        reciverId,
        text,
        image: imageurl || null
    })
    await newMessage.save()
    // todo:realtime funcanility ges here =>socket.io
    res.status(201).json({
        message: "succefully sned message",
        success: true,
        newMessage
    })

})
export const getChatPartners = AsyncHandeler(async (req, res) => {
    const loggedinUserId = req.user._id
    // find all the messages where the logged in user is sender or reciver
    const messages = await Message.find({
        $or: [{ senderId: loggedinUserId }, { reciverId: loggedinUserId }]
    })

    const chatPartnerIds = [
        ...new Set(
            messages.map((msg) =>
                msg.senderId.toString() === loggedinUserId.toString()
                    ? msg.reciverId.toString()
                    : msg.senderId.toString()
            )
        ),
    ];
    const chatpatners = await User.find({ _id: { $in: chatPartnerIds } }).select('-password')
    res.status(200).json({
        message: "fetch all chatpatners succesfully",
        success: true,
        chatpatners
    })

})