import {validationResult} from "express-validator";

export const validate=(req,res,next)=>{
    const errors=validationResult(req)
    if(errors.isEmpty()){
        return next()
    }
    const extractedError=[]
     errors.array().map((err)=>extractedError.push({
        [err.path]:err.msg
    }))
    return res.status(422).json({
        message:"recived data not validate",
        extractedError
    })
}