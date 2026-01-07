import { Server } from "socket.io"
import http from "http"
import express from "express"
import dotenv from "dotenv"
import cors from "cors"

import { socketAuthMiddleWare } from "../middleware/socket.auth.middleware.js"
dotenv.config()

const app = express()


const server = http.createServer(app)

const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        credentials: true,

    }

})

// apply authentication middleware

io.use(socketAuthMiddleWare)

// it will will use to check if user is online or offline
export function getReciveersockedId(userId){
    return usersocketMap[userId] || null
}

const usersocketMap={}; //{userId:socket.ID} key value store online useer
// handel online and offline users
io.on("connection",(socket)=>{
    console.log("A user connected",socket.user.username);
    const userId=socket.userId
    usersocketMap[userId]=socket.id
    // io.emit use too send events to all connected clients
    io.emit("getOnlineUsers",Object.keys(usersocketMap))

    socket.on("disconnect",()=>{
        console.log("A user disconnected",socket.user.username);
        delete usersocketMap[userId]
        // inform all the clients a user has disconnected
        io.emit("getOnlineUsers",Object.keys(usersocketMap))



    })
    
})

export {io,app,server}
