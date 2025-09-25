import {Router} from "express"
import { isloggedin } from "../middleware/auth.middleware.js"
import { arjProtection } from "../middleware/arcjet.middleware.js"
import { getChatPartners, getmessages, messageSidebar, SendMessage } from "../controllers/message.controller.js"
const messageRouter=Router()
messageRouter.get("/contacts",isloggedin,messageSidebar)
messageRouter.get("/chats",isloggedin,getChatPartners)
messageRouter.get("/:id",isloggedin,getmessages)
messageRouter.post("/send/:id",isloggedin,SendMessage)
export default messageRouter