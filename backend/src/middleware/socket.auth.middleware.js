import jwt from "jsonwebtoken"
import User from "../model/User.model.js"
import dotenv from "dotenv"

dotenv.config()

export const socketAuthMiddleWare = async (socket, next) => {
    try {
        // Extract token from cookies
        const cookies = socket.handshake.headers.cookie || ""
        
        // Parse cookies string into an object for easier access
        const cookiesObj = {}
        cookies.split(";").forEach(cookie => {
            const [key, ...valueParts] = cookie.trim().split("=")
            if (key && valueParts.length > 0) {
                cookiesObj[key] = valueParts.join("=") // Rejoin in case value contains "="
            }
        })

        const token = cookiesObj.accessToken

        if (!token) {
            console.log("❌ Socket authentication failed: No access token found")
            console.log("📄 Available cookies:", Object.keys(cookiesObj))
            return next(new Error("Authentication required - No token found"))
        }

        // Verify the token
        const decoded = jwt.verify(token, process.env.TOKEN_SECRET)

        // Find user in database
        const user = await User.findById(decoded._id).select("-password -refreshToken")

        if (!user) {
            console.log("❌ Socket authentication failed: User not found")
            return next(new Error("Authentication failed - User not found"))
        }

        // Attach user info to socket (similar to req.user in HTTP middleware)
        // socket.user = {
        //     _id: user._id,
        //     username: user.username,
        //     email: user.email,
        //     profilepic: user.profilepic
        // }
        // attach user info to socket
        socket.user=user
        socket.userId=user.id.toString()

        console.log("✅ Socket authenticated successfully for user:", user._id)

        // Call next() to allow the connection
        next()

    } catch (error) {
        console.log("❌ Socket authentication middleware error:", error.message)

        // Handle specific JWT errors
        if (error.name === 'TokenExpiredError') {
            return next(new Error("Token expired - Please login again"))
        }

        if (error.name === 'JsonWebTokenError') {
            return next(new Error("Invalid token - Please login again"))
        }

        // Generic error
        return next(new Error("Authentication failed"))
    }
}