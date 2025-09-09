import express from "express"
import dotenv from "dotenv"
import ConnectDB from "./db/indexdb.js"
import cookieparser from "cookie-parser"
import authUser from "./routes/auth.routes.js"
import messageRouter from "./routes/message.routes.js"



dotenv.config()
const app=express()
app.use(cookieparser())
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use("/api/v1/auth",authUser)
app.use("/api/v1/message",messageRouter)
const port=process.env.PORT||3000

ConnectDB()
app.listen(port,()=>{console.log(`app is running on port ${port}`);
})