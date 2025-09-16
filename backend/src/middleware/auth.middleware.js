import jwt from "jsonwebtoken"
import dotenv from "dotenv"

dotenv.config()
export const isloggedin=async(req,res,next)=>{
   try {
     const token=req.cookies?.acessToken
     console.log(token);
     if(!token){
        return res.status(400).json({
            message:"cant find token",
            success:false
        })
     }
     const decode=jwt.verify(token,process.env.TOKEN_SECRET)
     console.log("decoded data",decode);
     req.user=decode
     return next()
     
   } catch (error) {
     console.log("auth middlewere failure");
        return res.status(500).json({
            success:false,
            message:"internal server error"
        })

    
   }
   
    
}