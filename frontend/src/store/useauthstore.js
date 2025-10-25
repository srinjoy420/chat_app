import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";

export const useAuthstore = create((set, get) => ({
  authUser: null,
  isCheckingAuth: true,
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfilepic:false,
  error: null,

  // Clear error
  clearError: () => set({ error: null }),

  // Check authentication status
  checkAuth: async () => {
    set({ isCheckingAuth: true, error: null });
    
    try {
      const res = await axiosInstance.get("/api/v1/auth/check");
      
      if (res.data.success) {
        set({ 
          authUser: res.data.user,
          error: null 
        });
        console.log("✅ User authenticated:", res.data.user.username);
      } else {
        set({ authUser: null });
      }
    } catch (error) {
      console.log("❌ Authentication check failed:", error.response?.data?.message || error.message);
      set({ 
        authUser: null,
        error: error.response?.data?.message || "Authentication failed"
      });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  // Sign up function
  signup: async (data) => {
    set({ isSigningUp: true, error: null });
    
    try {
      const res = await axiosInstance.post("/api/v1/auth/signup", data);
      
      if (res.data.success) {
        set({ 
          authUser: res.data.user,
          error: null 
        });
        toast.success("account created succesfully")
        console.log("✅ User signed up successfully:", res.data.user.username);
        return { success: true, user: res.data.user };
      } else {
        set({ error: res.data.message });
        return { success: false, error: res.data.message };
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Signup failed";
      set({ error: errorMessage });
      console.log("❌ Signup failed:", errorMessage);
      toast.error(errorMessage)
      return { success: false, error: errorMessage };
    } finally {
      set({ isSigningUp: false });
    }
  },

  // Login function
  login: async (data) => {
    set({ isLoggingIn: true, error: null });
    
    try {
      const res = await axiosInstance.post("/api/v1/auth/login", data);
      
      if (res.data.success) {
        set({ 
          authUser: res.data.user,
          error: null 
        });
        toast.success("logged in succesfully")
        console.log("✅ User logged in successfully:", res.data.user.username);
        return { success: true, user: res.data.user };
      } else {
        set({ error: res.data.message });
        return { success: false, error: res.data.message };
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Login failed";
      set({ error: errorMessage });
      console.log("❌ Login failed:", errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      set({ isLoggingIn: false });
    }
  },

  // Logout function
  logout: async () => {
    try {
      await axiosInstance.get("/api/v1/auth/logout");
      set({ authUser: null, error: null });
      console.log("✅ User logged out successfully");
    } catch (error) {
      console.log("❌ Logout error:", error.response?.data?.message || error.message);
      // Even if logout fails on server, clear local state
      set({ authUser: null, error: null });
    }
  },

  // Update profile picture
  updateProfilePic: async (profilepic) => {
    set({ isUpdatingProfilepic: true, error: null });
    
    try {
      const res = await axiosInstance.put("/api/v1/auth/updatepic", { profilepic });
      
      if (res.data.success) {
        set(state => ({
          authUser: {
            ...state.authUser,
            profilepic: res.data.profilepic
          },
          error: null
        }));
        toast.success("Profile picture uploaded successfully");
        console.log("✅ Profile picture updated successfully");
        return { success: true, profilepic: res.data.profilepic };
      } else {
        set({ error: res.data.message, isUpdatingProfilepic: false });
        toast.error(res.data.message);
        return { success: false, error: res.data.message };
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Profile picture update failed";
      set({ error: errorMessage, isUpdatingProfilepic: false });
      console.log("❌ Profile picture update failed:", errorMessage);
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      set({ isUpdatingProfilepic: false });
    }
    
  },

  // Delete account
  deleteAccount: async () => {
    try {
      const res = await axiosInstance.get("/api/v1/auth/deletaccount");
      
      if (res.data.success) {
        set({ authUser: null, error: null });
        console.log("✅ Account deleted successfully");
        return { success: true };
      } else {
        set({ error: res.data.message });
        return { success: false, error: res.data.message };
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Account deletion failed";
      set({ error: errorMessage });
      console.log("❌ Account deletion failed:", errorMessage);
      return { success: false, error: errorMessage };
    }
  }
}));