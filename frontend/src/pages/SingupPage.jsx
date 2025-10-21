import React, { useState } from 'react'
import { useAuthstore } from '../store/useauthstore.js'
import { Link, useNavigate } from "react-router-dom";
import BorderAnimatedContainer from '../components/BorderAnimatedContainer.jsx'
import {
  MessageCircleIcon,
  LockIcon,
  MailIcon,
  UserIcon,
  LoaderIcon,
  EyeIcon,
  EyeOffIcon
} from "lucide-react";

const SingupPage = () => {
  const [formData, setFormData] = useState({ username: "", email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false); // ✅ Local state for eye toggle

  const { signup, isSigningUp } = useAuthstore();
  const navigate = useNavigate();

  const handelSubmit = async (e) => {
    e.preventDefault();
    const result = await signup(formData);
    if (result.success) {
      navigate("/");
    }
  };

  return (
    <div className="w-full flex items-center justify-center p-4 bg-slate-900">
      <div className="relative w-full max-w-6xl md:h-[800px] h-[650px]">
        <BorderAnimatedContainer>
          <div className="w-full flex flex-col md:flex-row">
            {/* Form (Left side) */}
            <div className="md:w-1/2 p-6 flex items-center justify-center border-b md:border-b-0 md:border-r border-slate-600/30 md:h-[600px] h-[500px]">
              <div className="w-full max-w-md">
                {/* Header */}
                <div className="text-center mb-8">
                  <MessageCircleIcon className="w-12 h-12 mx-auto text-slate-400 mb-4" />
                  <h2 className="text-2xl font-bold text-slate-200 mb-2">Create Account</h2>
                  <p className="text-slate-400">Sign up for a new account</p>
                </div>

                {/* Form */}
                <form onSubmit={handelSubmit} className="space-y-6">
                  {/* Full name */}
                  <div>
                    <label className="auth-input-label">Full name</label>
                    <div className="relative">
                      <UserIcon className="auth-input-icon" />
                      <input
                        type="text"
                        value={formData.username}
                        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                        className="input"
                        placeholder="John Doe"
                        required
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div>
                    <label className="auth-input-label">Email</label>
                    <div className="relative">
                      <MailIcon className="auth-input-icon" />
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="input"
                        placeholder="sg@gmail.com"
                        required
                      />
                    </div>
                  </div>

                  {/* Password */}
                  <div>
                    <label className="auth-input-label">Password</label>
                    <div className="relative">
                      <LockIcon className="auth-input-icon" />
                      <input
                        type={showPassword ? "text" : "password"}
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        className="input"
                        placeholder="****"
                        required
                      />
                      {/* Eye toggle button */}
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOffIcon className="w-5 h-5" />
                        ) : (
                          <EyeIcon className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button className="auth-btn" type="submit" disabled={isSigningUp}>
                    {isSigningUp ? (
                      <LoaderIcon className="w-full h-5 animate-spin text-center" />
                    ) : (
                      "Create Account"
                    )}
                  </button>
                </form>

                {/* Redirect to login */}
                <div className="mt-6 text-center">
                  <Link to="/login" className="auth-link">
                    Already have an account? Go to login page
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* the right side image section */}
          <div className="hidden md:flex md:w-1/2 items-center justify-center p-10 bg-gradient-to-bl from-slate-800/30 to-transparent">
            <div className="flex flex-col items-center justify-center text-center">
              <img
                src="/signup.png"
                alt="People using mobile devices"
                className="w-[85%] max-w-xl h-auto object-contain mx-auto drop-shadow-lg"
              />
              <div className="mt-8">
                <h3 className="text-2xl font-semibold text-cyan-400">Start Your Journey Today</h3>

                <div className="mt-5 flex justify-center gap-5">
                  <span className="auth-badge">Free</span>
                  <span className="auth-badge">Easy Setup</span>
                  <span className="auth-badge">Private</span>
                </div>
              </div>
            </div>
          </div>

        </BorderAnimatedContainer>
      </div>
    </div>
  );
};

export default SingupPage;
