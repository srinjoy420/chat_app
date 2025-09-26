import {create} from "zustand"

export const useAuthstore=create((set,get)=>({
    authUser:{name:"john",_id:123,age:25},
    isLoading:false,
    isLoggedIn:false,

    Login:()=>{
        console.log("we just login");
        set({isLoggedIn:true,isLoading:true})
        
    }
}))