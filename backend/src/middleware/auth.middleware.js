import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const isloggedin = async (req, res, next) => {
  try {
    // Get token from cookies - only look for the correct cookie name
    const token = req.cookies?.accessToken;
    
    console.log("🔍 Checking authentication...");
    console.log("📄 Available cookies:", req.cookies);
    console.log("🎫 Access token:", token ? "Found" : "Not found");

    // If no token found, return 401
    if (!token) {
      console.log("❌ No access token found");
      return res.status(401).json({
        message: "Authentication required - No token found",
        success: false,
      });
    }

    // Verify the token
    const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
    console.log("✅ Token verified successfully");
    console.log("👤 User ID:", decoded._id);

    // Attach user info to request
    req.user = decoded;
    next();

  } catch (error) {
    console.log("❌ Authentication middleware error:", error.message);
    
    // Handle specific JWT errors
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: "Token expired - Please login again"
      });
    }
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: "Invalid token - Please login again"
      });
    }

    // Generic error
    return res.status(500).json({
      success: false,
      message: "Authentication error"
    });
  }
};