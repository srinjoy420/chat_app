import {Router} from "express"
import {  login, logout, signup, updateprofilePic } from "../controllers/auth.controller.js"
import { isloggedin } from "../middleware/auth.middleware.js"




const route=Router()
route.post("/singup",signup)
 route.post("/login",login)
 route.get("/logout",isloggedin,logout)
 route.put("/updatepic",isloggedin,updateprofilePic)



export default route