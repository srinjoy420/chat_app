import {Router} from "express"
import { isloggedin } from "../middleware/auth.middleware.js"
import { getmessages, messageSidebar, SendMessage } from "../controllers/message.controller.js"
const messageRouter=Router()
messageRouter.get("/users",isloggedin,messageSidebar)
messageRouter.get("/:id",isloggedin,getmessages)
messageRouter.post("/send/:id",isloggedin,SendMessage)
export default messageRouter