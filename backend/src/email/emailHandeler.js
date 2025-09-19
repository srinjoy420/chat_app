import { resendClient,sender } from "../../lib/resend.js"
import { createWelcomeEmailTemplate } from "./EmailTemplate.js"




export const sendWelcomeEmail =async (email,username,clientUrl)=>{
    const {data,error}=await resendClient.emails.send({
        from:`${sender.name} <${sender.email}>`,
        to:email,
        subject: 'welcome to the chatify',
        html:createWelcomeEmailTemplate(username,clientUrl)
    })
    if(error){
        console.log("failed to send email",error);
        throw new Error("something went wrong")
        
    }
    else{
        console.log("Welcome email send succesfully",data);
        
    }
}