import express from "express"
import dotenv from "dotenv"
import ConnectDB from "./db/indexdb.js"
import cookieParser from "cookie-parser"
import authUser from "./routes/auth.routes.js"
import messageRouter from "./routes/message.routes.js"
import path from "path"
import { fileURLToPath } from "url"
import cors from "cors"

// Fix __dirname for ESM


dotenv.config()
const app = express()

// middlewares
app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// test route
app.get("/", (req, res) => {
  res.send("Hello World!")
})

// cors setup
app.use(
  cors({
    origin: "http://localhost:5173", // frontend dev URL
    credentials: true,
    methods: ["GET", "POST", "DELETE", "OPTIONS", "PUT"],
    allowedHeaders: ["Content-Type", "Authorization", "Accept"],
    exposedHeaders: ["Set-Cookie", "*"],
  })
)

// api routes
app.use("/api/v1/auth", authUser)
app.use("/api/v1/message", messageRouter)

// deployment setup


const port = process.env.PORT || 3000
ConnectDB()
app.listen(port, () => {
  console.log(`✅ App is running on port ${port}`)
})
