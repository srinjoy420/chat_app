import {Router} from "express"
import { isloggedin } from "../middleware/auth.middleware.js"
import { getmessages, messageSidebar } from "../controllers/message.controller.js"
const messageRouter=Router()
messageRouter.get("/users",isloggedin,messageSidebar)
messageRouter.get("/:id",isloggedin,getmessages)
export default messageRouter