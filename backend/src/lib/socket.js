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

const usersocketMap={}
