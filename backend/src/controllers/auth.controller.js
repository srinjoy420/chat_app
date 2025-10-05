// import { sendWelcomeEmail } from "../email/emailHandeler.js";
import cloudinary from "../lib/cloudnary.js";

import User from "../model/User.model.js"
import { AsyncHandeler } from "../utils/AsyncHandeler.js"
import dotenv from "dotenv"
dotenv.config()


// No AsyncHandeler here!
export const getAccesstokenrefreshToken = async (userId) => {
    try {
        const user = await User.findById(userId)
        if (!user) {
            console.log("cant find user");

        }
        const acessToken = user.generateacessToken()
        const refreshToken = user.generateRefeshToken()
        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false })
        return { acessToken, refreshToken }
    } catch (error) {
        console.log("erreo in tokens");




    }
}
export const signup = AsyncHandeler(async (req, res) => {
    const { username, email, password, profilepic = "" } = req.body
    if (!username || !email || !password) {
        return res.status(401).json({
            message: "please fill following credintials",
            success: false
        })


    }

    const existUser = await User.findOne({ email })
    if (existUser) {
        return res.status(400).json({
            message: "user avalible already",
            success: false
        })

    }
    const user = await User.create({
        username,
        email,
        password,
        profilepic
    })
    //    await sendWelcomeEmail(user.email,user.username,process.env.CLIENT_URL)
    const { refreshToken, acessToken } = await getAccesstokenrefreshToken(user._id)
    user.refreshToken = refreshToken
    await user.save()
    const cookeOptions = {
        httpOnly: true,
        secure: false,      // keep false locally, true in production with https
        sameSite: "None",   // important for cross-site cookies
        maxAge: 7 * 24 * 60 * 60 * 1000,
    }

    res.cookie("acessToken", acessToken, cookeOptions)
    res.cookie("refreshToken", refreshToken, cookeOptions)
    res.status(200).json({
        message: "user registred successfully",
        success: true,
        acessToken,
        refreshToken,
        user: {
            id: user._id,
            username: user.username,
            email: user.email,
            profilepic: user.profilepic
        }
    })
})

export const login = AsyncHandeler(async (req, res) => {
    const { email, password } = req.body
    if (!email || !password) {
        return res.status(400).json({
            message: "please field all condition",
            success: false
        })
    }
    const user = await User.findOne({ email })
    if (!user) {
        return res.status(400).json({
            message: "cant find user",
            success: false
        })
    }
    const ispasswordCorrect = await user.ispasswordCorrect(password)
    if (!ispasswordCorrect) {
        res.status(404).json({
            message: "wrong password ",
            success: false
        })

    }
    const { refreshToken, acessToken } = await getAccesstokenrefreshToken(user._id)
    user.refreshToken = refreshToken
    await user.save()
    const cookeOptions = {
        httpOnly: true,
        secure: false,      // keep false locally, true in production with https
        sameSite: "None",   // important for cross-site cookies
        maxAge: 7 * 24 * 60 * 60 * 1000,
    }

    res.cookie("acessToken", acessToken, cookeOptions)
    res.cookie("refreshToken", refreshToken, cookeOptions)
    res.status(200).json({
        message: "loggedin succesfully",
        success: true,
        acessToken,
        refreshToken,
        user: {
            id: user._id,
            username: user.username,
            email: user.email,
            profilepic: user.profilepic

        }

    })

})
export const logout = AsyncHandeler(async (req, res) => {
    const cookeOptions = {
        httpOnly: true,
        secure: false,      // keep false locally, true in production with https
        sameSite: "None",   // important for cross-site cookies
        maxAge: 7 * 24 * 60 * 60 * 1000,
    }

    res.cookie("acessToken", "", cookeOptions)
    res.cookie("refreshToken", "", cookeOptions)
    res.status(200).json({
        message: "succesfully loggedout",
        success: true
    })

})

export const updateprofilePic = AsyncHandeler(async (req, res) => {
    try {
        const { profilepic } = req.body
        if (!profilepic) {
            return res.status(400).json({
                message: "please select an image",
                success: false
            })
        }
        const user = await User.findById(req.user._id)
        if (!user) {
            return res.status(404).json({
                message: "user not found or not login ",
                success: false
            })
        }
        const uploadResponse = await cloudinary.uploader.upload(profilepic)
        user.profilepic = uploadResponse.secure_url
        await user.save()
        res.status(200).json({
            message: "profile pic uploaded succesfulluy",
            success: true,
            profilepic: user.profilepic
        })
    } catch (error) {

    }

})

export const checkUser = AsyncHandeler(async (req, res) => {
    const userId = req.user._id
    const user = await User.findById(userId)
    if (!user) {
        return res.status(404).json({
            message: "user is not exist or logout",
            success: false
        })
    }
    res.status(200).json({
        message: "user find succesfully",
        success: true,
        user: {
            id: user._id,
            username: user.username,
            email: user.email,
            profilepic: user.profilepic


        }
    })
})

export const deleteaccount = AsyncHandeler(async (req, res) => {
    const userId = req.user._id;
    const user = await User.findByIdAndDelete(userId)
    if (!user) {
        return res.status(404).json({
            message: "cant find the user",
            success: false
        })
    }
    res.status(200).json({
        message: "succesfully deleted account",
        success: true
    })
})

export const deleteallaccount = AsyncHandeler(async (req, res) => {
    const result = await User.deleteMany({})
    res.status(200).json({
        message: "delete all users",
        success: true,
        deeleteCount: result.deletedCount

    })
})