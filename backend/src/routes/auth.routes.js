import {Router} from "express"
import {  checkUser, login, logout, signup, updateprofilePic } from "../controllers/auth.controller.js"
import { isloggedin } from "../middleware/auth.middleware.js"




const route=Router()
route.post("/singup",signup)
 route.post("/login",login)
 route.get("/logout",isloggedin,logout)
 route.put("/updatepic",isloggedin,updateprofilePic)
 route.get("/check",isloggedin,checkUser)



export default route