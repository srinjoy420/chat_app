import mongoose from "mongoose"
import dotenv from "dotenv"

dotenv.config()

const ConnectDB=async()=>{
    try {
        await mongoose.connect(process.env.MONGO_URI)
        console.log("succesfully connected to the database");
        
    } catch (error) {
        console.log("error to connect in database",error);
        process.exit(1)
        
        
    }
}

export default ConnectDB
