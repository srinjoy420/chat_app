import {create} from "zustand"
import { axiosInstance } from "../lib/axios.js"

export const useAuthstore=create((set,get)=>({
  authUser:null,
  isCheackingAuth:true,
  issSingingUp:false,

  checkAuth:async() =>{
    try {
        const res=await axiosInstance.get("/api/v1/auth/check")
        set({authUser:res.data})
    } catch (error) {
        console.log("something went wrong to fetch the user",error);
        set({authUser:null})
        
        
    }
    finally{
        set({isCheackingAuth:false})
    }
  },
  singup:async(data)=>{
    set({issSingingUp:true})
    try {
      
    } catch (error) {
      
    }
    finally{
      set({issSingingUp:false})
    }


  }
}))