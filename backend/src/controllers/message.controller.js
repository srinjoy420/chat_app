import Message from "../model/Message.model.js";
import User from "../model/User.model.js";

import { AsyncHandeler } from "../utils/AsyncHandeler.js"

export const messageSidebar=AsyncHandeler(async(req,res)=>{
    const loggedinuser=req.User._id
    const users=await User.find({_id: {$ne:loggedinuser}}).select("-password")
    if(users.length===0){
        return res.status(404).json({
            message:"No user found",
            success:false
        })
    }
    res.status(200).json({
        message:"Useres found succesfully",
        users
    })
})
export const getmessages=AsyncHandeler(async(req,res)=>{
    const {id:userToChatId}=req.params;
    const myId=req.user._id
    const messages=await Message.find({
        $or:[
            {senderId:myId,reciverId:userToChatId},
            {senderId:userToChatId,reciverId:myId}
        ]
    })
    res.status(200).json({
        message:"find all messages succesfully",
        messages
    })
})