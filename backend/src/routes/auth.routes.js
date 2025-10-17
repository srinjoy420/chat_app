import {Router} from "express"
import {  checkUser, login, logout, signup, updateprofilePic,deleteaccount ,deleteallaccount} from "../controllers/auth.controller.js"
import { isloggedin } from "../middleware/auth.middleware.js"
import { arjProtection } from "../middleware/arcjet.middleware.js"





const route=Router()
route.get("/test",arjProtection,(req,res)=>{
    res.status(200).json({message:"test for the rate limiting"})
})
// route.use(arjProtection)
route.post("/signup",signup)
 route.post("/login",login)
 route.get("/logout",isloggedin,logout)
 route.put("/updatepic",isloggedin,updateprofilePic)
 route.get("/check",isloggedin,checkUser)
 route.get("/deletaccount",isloggedin,deleteaccount)
 route.get("/deletall",deleteallaccount)



export default route