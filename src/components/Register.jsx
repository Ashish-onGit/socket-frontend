import React, { useState } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible, AiOutlineLoading3Quarters } from "react-icons/ai";
import { FiUser, FiLock } from "react-icons/fi";
import { FaGoogle, FaGithub, FaMicrosoft } from "react-icons/fa";
import { useToast } from "./common/ToastContext";
import ThemeSwitcher from "./common/ThemeSwitcher";

export default function Register({ onRegister, switchToLogin, theme, toggleTheme }) {
  const { showToast } = useToast();
  const [username, setUsername] = useState("");
  const [pass, setPass] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const validateForm = () => {
    const usernameRegex = /^[a-zA-Z0-9]{3,20}$/; // Alphanumeric, 3-20 characters
    if (!usernameRegex.test(username)) {
      setError("Username must be 3-20 characters and alphanumeric only (no special characters/spaces).");
      showToast("Invalid Username", "error");
      return false;
    }
    if (pass.length < 4) {
      setError("Password must be at least 4 characters.");
      showToast("Invalid Password", "error");
      return false;
    }
    return true;
  };

  const handleRegister = async () => {
    setError("");
    if (!validateForm()) return;

    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1200));
      const success = await onRegister(username.trim(), pass.trim());
      if (success) {
        showToast("Registration successful! Please login.", "success");
      } else {
        setError("Username already taken. Please try another one.");
        showToast("Registration failed", "error");
      }
    } catch (err) {
      showToast("Server error during registration", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-screen h-screen relative flex items-center justify-center p-0 md:p-6 bg-brand-bg-light dark:bg-brand-bg-dark overflow-hidden font-sans transition-colors duration-200">
      


      {/* Main split-panel container */}
      <div className="w-full h-full md:max-w-5xl md:h-[80dvh] rounded-none md:rounded-[2.5rem] overflow-hidden glass-panel premium-card flex relative z-10 border border-white/20 dark:border-white/5 shadow-2xl">
        
        {/* Left Side: 3D Illustration Panel (Visible on Desktop) */}
        <div className="hidden md:flex md:w-1/2 flex-col justify-between p-10 bg-gradient-to-tr from-brand-50 to-indigo-100 dark:from-[#1E1B4B]/10 dark:to-zinc-950/30 relative overflow-hidden border-r border-gray-100 dark:border-white/5">
          
          {/* Logo & Theme Switcher Header */}
          <div className="flex justify-between items-center z-10">
            <span className="text-sm font-extrabold tracking-widest text-indigo-600 dark:text-indigo-400 font-sans">⚡ AETHER</span>
            <ThemeSwitcher theme={theme} toggleTheme={toggleTheme} />
          </div>

          {/* Centered Image */}
          <div className="flex-1 flex flex-col justify-center items-center z-10 my-4 select-none pointer-events-none">
            <img 
              src="/login_visual.png" 
              alt="Aether Chat Visual Representation" 
              className="max-h-[300px] object-contain animate-float drop-shadow-2xl" 
            />
          </div>

          {/* Bottom Descriptive Panel */}
          <div className="z-10">
            <h3 className="text-sm font-bold text-gray-800 dark:text-gray-100 font-sans">Connecting People Instantly</h3>
            <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-1 leading-relaxed font-sans">
              Experience latency-free private messaging built with absolute glassmorphism style and modern architecture.
            </p>
          </div>
        </div>

        {/* Right Side: Form Panel */}
        <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center bg-white/80 dark:bg-zinc-900/70 backdrop-blur-md relative z-10">
          
          {/* Mobile-only Logo & Theme Switcher Header */}
          <div className="md:hidden flex justify-between items-center mb-8">
            <span className="text-sm font-extrabold tracking-widest text-indigo-600 dark:text-indigo-400 font-sans">⚡ AETHER</span>
            <ThemeSwitcher theme={theme} toggleTheme={toggleTheme} />
          </div>

          <div className="text-left mb-6">
            <h2 className="text-2xl font-extrabold tracking-tight font-sans text-gray-900 dark:text-white">Create account</h2>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1.5 font-sans">
              Register now to set up your encrypted chat profile.
            </p>
          </div>

          {error && (
            <div className="p-3 mb-5 text-xs font-semibold text-red-600 dark:text-red-400 bg-red-500/10 border border-red-500/15 rounded-2xl text-center font-sans">
              {error}
            </div>
          )}

          <div className="space-y-4 font-sans">
            <div>
              <label className="text-[10px] font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-wider block mb-1.5 pl-1">
                Username
              </label>
              <div className="relative flex items-center">
                <FiUser className="absolute left-4 text-gray-400 dark:text-zinc-500" size={14} />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Min 3 chars, Alphanumeric"
                  className="w-full pl-11 pr-4 py-3 text-xs rounded-2xl bg-gray-200/50 dark:bg-white/5 border border-transparent focus:border-indigo-500 dark:focus:border-indigo-500 focus:bg-white dark:focus:bg-zinc-950/40 focus:outline-none text-gray-900 dark:text-white transition-all duration-200 font-sans"
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-wider block mb-1.5 pl-1">
                Password
              </label>
              <div className="relative flex items-center">
                <FiLock className="absolute left-4 text-gray-400 dark:text-zinc-500" size={14} />
                <input
                  type={showPass ? "text" : "password"}
                  value={pass}
                  onChange={(e) => setPass(e.target.value)}
                  placeholder="Min 4 characters"
                  autoComplete="new-password"
                  className="w-full pl-11 pr-11 py-3 text-xs rounded-2xl bg-gray-200/50 dark:bg-white/5 border border-transparent focus:border-indigo-500 dark:focus:border-indigo-500 focus:bg-white dark:focus:bg-zinc-950/40 focus:outline-none text-gray-900 dark:text-white transition-all duration-200 font-sans"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 cursor-pointer"
                >
                  {showPass ? <AiOutlineEyeInvisible size={16} /> : <AiOutlineEye size={16} />}
                </button>
              </div>
            </div>

            <button
              onClick={handleRegister}
              disabled={loading}
              className="w-full py-3.5 mt-3 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white rounded-2xl font-bold text-xs tracking-wide shadow-lg shadow-indigo-600/20 hover:shadow-indigo-500/30 hover:scale-[1.01] active:scale-[0.99] transition-all duration-250 flex items-center justify-center gap-2 cursor-pointer"
            >
              {loading ? (
                <>
                  <AiOutlineLoading3Quarters className="animate-spin" size={14} />
                  Creating profile...
                </>
              ) : (
                "Sign Up"
              )}
            </button>
          </div>

          {/* Social Sign-in Splitter */}
          <div className="relative my-6 flex items-center justify-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-100 dark:border-white/5"></div>
            </div>
            <span className="relative px-3 bg-white dark:bg-zinc-900 text-[9px] uppercase font-bold text-gray-400 dark:text-zinc-500 tracking-wider font-sans">
              or sign up with
            </span>
          </div>

          {/* Social Badges */}
          <div className="flex justify-center gap-3">
            <button className="w-10 h-10 rounded-full border border-gray-200 dark:border-white/10 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-white/5 transition-colors cursor-pointer text-gray-600 dark:text-gray-300">
              <FaGoogle size={14} />
            </button>
            <button className="w-10 h-10 rounded-full border border-gray-200 dark:border-white/10 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-white/5 transition-colors cursor-pointer text-gray-600 dark:text-gray-300">
              <FaMicrosoft size={14} />
            </button>
            <button className="w-10 h-10 rounded-full border border-gray-200 dark:border-white/10 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-white/5 transition-colors cursor-pointer text-gray-600 dark:text-gray-300">
              <FaGithub size={15} />
            </button>
          </div>

          {/* Terms Footer */}
          <p className="text-[10px] text-center text-gray-400 dark:text-zinc-500 mt-6 leading-relaxed font-sans">
            By registering you agree to our <span className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline cursor-pointer">Terms of Service</span> and <span className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline cursor-pointer">Privacy Policy</span>.
          </p>

          <p className="mt-6 text-center text-xs text-gray-500 dark:text-gray-400 pl-1 font-sans">
            Already have an account?{" "}
            <button
              onClick={switchToLogin}
              className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline cursor-pointer transition-colors duration-150"
            >
              Login here
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}