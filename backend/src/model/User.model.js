import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import dotenv from "dotenv"
dotenv.config()
const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
       
        trim: true
    },
    profilepic: {
        type: String,
        default: ""
    },
     refreshToken:{
        type:String
    }

}, { timestamps: true })
userSchema.pre('save',async function (next) {
    if(!this.isModified("password") )return next();
    this.password=await bcrypt.hash(this.password,10)
    next()

    
})
userSchema.methods.ispasswordCorrect=async function (password) {
    return await bcrypt.compare(password,this.password)
    
}

userSchema.methods.generateacessToken=function(){
    return jwt.sign(
        {
            _id:this._id,
            email:this.email,
            
        },
         process.env.TOKEN_SECRET,
        {expiresIn:process.env.TOKEN_EXPIRY}
    )
    
}

userSchema.methods.generateRefeshToken=function(){
    return jwt.sign(
        {
            _id:this._id,
            email:this.email,
            
        },
        process.env.TOKEN_SECRET,
        {expiresIn:process.env.TOKEN_EXPIRY}
    )
    
}

const User = mongoose.model("User", userSchema)
export default User