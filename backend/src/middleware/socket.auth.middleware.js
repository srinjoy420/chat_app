import jwt from "jsonwebtoken"
import User from "../model/User.model.js"
import dotenv from "dotenv"

dotenv.config()

export const socketAuthMiddleWare = async (socket, next) => {
    try {
        // Extract token from cookies from http only cookie
        const token = socket.handshake.headers.cookie 
                     ?.split("; ")
                     .find((row)=>row.startsWith("accessToken"))
                     ?.split("=")[1];
        // console.log(token);
        
        
        if(!token){
            console.log("socket connection rejected no token peovided");
            return next(new Error("unauthorized-No token provided"))
            
        }
        // verify the token
        const decode=jwt.verify(token,process.env.TOKEN_SECRET)
        if(!decode){
            console.log("socket connection rejected unable tokaen");
            return next(new Error("unauthorized-invalid token"))
            
        }
        // find the user
        const user=await User.findById(decode._id).select("-password")
        if(!user){
            console.log("User not found");
              return next(new Error("User not found"))
            
        }
        // attach user info to socket
        socket.user=user
        socket.userId=user._id.toString()
        console.log(`socket authenticated for the user ${user.username} and ${user._id}`);
        

        next()
        
        

    } catch (error) {
        console.log("error in socket authentication",error.message);
        next(new Error("Unauthorized - Authentication failed"))
        
       
    }
}