import cloudinary from "../lib/cloudnary.js";
import User from "../model/User.model.js";
import { AsyncHandeler } from "../utils/AsyncHandeler.js";
import dotenv from "dotenv";

dotenv.config();

// ✅ Cookie configuration - consistent across all endpoints
const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production", // true in production (with https)
  sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};

// ✅ Utility function to generate access & refresh tokens
export const getAccessAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }

    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    // Save refresh token to database
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    console.error("❌ Error generating tokens:", error);
    throw error;
  }
};

// 🟢 SIGNUP
export const signup = AsyncHandeler(async (req, res) => {
  const { username, email, password, profilepic = "" } = req.body;

  // Validation
  if (!username || !email || !password) {
    return res.status(400).json({
      message: "Please fill all required credentials",
      success: false,
    });
  }

  // Check if user already exists
  const existingUser = await User.findOne({ 
    $or: [{ email }, { username }] 
  });
  
  if (existingUser) {
    return res.status(400).json({
      message: existingUser.email === email ? "Email already exists" : "Username already exists",
      success: false,
    });
  }

  // Create new user
  const user = await User.create({ username, email, password, profilepic });
  
  // Generate tokens
  const tokens = await getAccessAndRefreshToken(user._id);

  // Set cookies
  res.cookie("accessToken", tokens.accessToken, cookieOptions);
  res.cookie("refreshToken", tokens.refreshToken, cookieOptions);

  // Remove sensitive data from response
  const userResponse = {
    id: user._id,
    username: user.username,
    email: user.email,
    profilepic: user.profilepic,
  };

  console.log("✅ User registered successfully:", userResponse.id);

  res.status(201).json({
    message: "User registered successfully",
    success: true,
    user: userResponse,
  });
});

// 🟢 LOGIN
export const login = AsyncHandeler(async (req, res) => {
  const { email, password } = req.body;

  // Validation
  if (!email || !password) {
    return res.status(400).json({
      message: "Please provide email and password",
      success: false,
    });
  }

  // Find user
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(404).json({
      message: "User not found",
      success: false,
    });
  }

  // Verify password
  const isPasswordCorrect = await user.isPasswordCorrect(password);
  if (!isPasswordCorrect) {
    return res.status(401).json({
      message: "Incorrect password",
      success: false,
    });
  }

  // Generate tokens
  const tokens = await getAccessAndRefreshToken(user._id);

  // Set cookies
  res.cookie("accessToken", tokens.accessToken, cookieOptions);
  res.cookie("refreshToken", tokens.refreshToken, cookieOptions);

  // Remove sensitive data from response
  const userResponse = {
    id: user._id,
    username: user.username,
    email: user.email,
    profilepic: user.profilepic,
  };

  console.log("✅ User logged in successfully:", userResponse.id);

  res.status(200).json({
    message: "Login successful",
    success: true,
    user: userResponse,
  });
});

// 🟢 LOGOUT
export const logout = AsyncHandeler(async (req, res) => {
  // Clear all possible cookie variations (including old typos)
  const cookieNames = ["accessToken", "acessToken", "refreshToken", "refeshToken"];
  
  cookieNames.forEach(cookieName => {
    res.clearCookie(cookieName, {
      ...cookieOptions,
      path: "/",
    });
  });

  // Clear refresh token from database if user is authenticated
  if (req.user && req.user._id) {
    try {
      await User.findByIdAndUpdate(
        req.user._id,
        { $unset: { refreshToken: 1 } },
        { new: true }
      );
      console.log("✅ Refresh token cleared from database for user:", req.user._id);
    } catch (error) {
      console.error("❌ Error clearing refresh token from database:", error);
    }
  }

  console.log("✅ User logged out successfully");

  res.status(200).json({
    message: "Successfully logged out",
    success: true,
  });
});

// 🟢 CHECK USER (used for /auth/check)
export const checkUser = AsyncHandeler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    return res.status(404).json({
      message: "User not found or logged out",
      success: false,
    });
  }

  const userResponse = {
    id: user._id,
    username: user.username,
    email: user.email,
    profilepic: user.profilepic,
  };

  console.log("✅ User verified successfully:", userResponse.id);

  res.status(200).json({
    message: "User verified successfully",
    success: true,
    user: userResponse,
  });
});

// 🟢 UPDATE PROFILE PICTURE
export const updateprofilePic = AsyncHandeler(async (req, res) => {
  const { profilepic } = req.body;

  if (!profilepic) {
    return res.status(400).json({
      message: "Please provide an image",
      success: false,
    });
  }

  const user = await User.findById(req.user._id);
  if (!user) {
    return res.status(404).json({
      message: "User not found",
      success: false,
    });
  }

  try {
    const uploadResponse = await cloudinary.uploader.upload(profilepic);
    user.profilepic = uploadResponse.secure_url;
    await user.save();

    console.log("✅ Profile picture updated for user:", user._id);

    res.status(200).json({
      message: "Profile picture updated successfully",
      success: true,
      profilepic: user.profilepic,
    });
  } catch (error) {
    console.error("❌ Error updating profile picture:", error);
    res.status(500).json({
      message: "Failed to update profile picture",
      success: false,
    });
  }
});

// 🟢 DELETE SINGLE ACCOUNT
export const deleteaccount = AsyncHandeler(async (req, res) => {
  const user = await User.findByIdAndDelete(req.user._id);

  if (!user) {
    return res.status(404).json({
      message: "User not found",
      success: false,
    });
  }

  // Clear cookies after deletion
  const cookieNames = ["accessToken", "acessToken", "refreshToken", "refeshToken"];
  cookieNames.forEach(cookieName => {
    res.clearCookie(cookieName, {
      ...cookieOptions,
      path: "/",
    });
  });

  console.log("✅ Account deleted successfully:", user._id);

  res.status(200).json({
    message: "Account deleted successfully",
    success: true,
  });
});

// 🟢 DELETE ALL USERS (admin use only)
export const deleteallaccount = AsyncHandeler(async (req, res) => {
  const result = await User.deleteMany({});
  
  console.log("✅ All users deleted successfully. Count:", result.deletedCount);

  res.status(200).json({
    message: "All users deleted",
    success: true,
    deleteCount: result.deletedCount,
  });
});