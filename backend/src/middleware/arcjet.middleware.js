import aj from "../lib/Arcj.js";
import { isSpoofedBot } from "@arcjet/inspect";

export const arjProtection = async (req, res, next) => {
    try {
        const decision = await aj.protect(req)
        if (decision.isDenied()) {
            if (decision.reason.isRateLimit()) {
                return res.status(429).json({
                    message: "rate limit exited,please try agan later"
                })
            }
            else if (decision.reason.isBot()) {
                return res.status(403).json({
                    message: "Bot access denied"
                })

            } else {
                return res.status(403).json({
                    message: "aceess denied by security policy"
                })

            }
        }
        //check for spoof bots
        if(decision.results.some(isSpoofedBot)){
            return res.status(403).json({
                error:"spoofed bot detected",
                message:"Malacias bot activly detected"
            })
        }
        next()
        
    } catch (error) {
        console.log("arject protection error", error);
        next()
    }
}