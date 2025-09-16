import express from "express"
import dotenv from "dotenv"
import ConnectDB from "./db/indexdb.js"
import cookieparser from "cookie-parser"
import authUser from "./routes/auth.routes.js"
import messageRouter from "./routes/message.routes.js"
import path from "path"
import cors from "cors"



dotenv.config()
const app=express()
const __dirname=path.resolve()
app.use(cookieparser())
app.use(express.json())
app.use(express.urlencoded({extended:true}))

app.get('/', (req, res) => {
  res.send('Hello World!')
})
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "DELETE", "OPTIONS", "PUT"],
    allowedHeaders: ["Content-Type", "Authorization", "Accept"],
    exposedHeaders: ["Set-Cookie", "*"],
  })
);
app.use("/api/v1/auth",authUser)
app.use("/api/v1/message",messageRouter)
// make ready for deployment
if(process.env.NODE_ENV==="production"){
  app.use(express.static(path.join(__dirname,"..frontend/dist")))
  app.get("*",(req,res)=>{
    res.sendFile(path.join(__dirname,"..frontend","dist","index.html"))
  })

}
const port=process.env.PORT||3000

ConnectDB()
app.listen(port,()=>{console.log(`app is running on port ${port}`);
})