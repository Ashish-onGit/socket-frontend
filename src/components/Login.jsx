import React, { useState } from "react";
import {
  AiOutlineEye,
  AiOutlineEyeInvisible,
  AiOutlineLoading3Quarters,
} from "react-icons/ai";
import { toast } from "react-toastify";

function Login({ onLogin, switchToRegister }) {
  const [username, setUsername] = useState("");
  const [pass, setPass] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
// console.log(onLogin)

  const handleLogin = async () => {
    setError(""); // Clear previous error
    if (!username || !pass) {
      // setError("Please enter both username and password.");
      toast.error("Please enter both username and password",{ autoClose: 2000 });
      return;
    }

    setLoading(true);
    try {
      // Simulate login delay
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const success = await onLogin(username, pass); // Assume onLogin returns true/false
            if(success){
        toast.success("Login successful")
      }
      else {
        toast.error("Invalid credentials");
      }

      
    } catch (err) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center text-gray-100 radial-bg">
      <div className="p-8 rounded-lg shadow-lg w-full max-w-md bg-opacity-80 backdrop-blur-md mt-auto">
        <h2 className="text-2xl font-bold mb-2 text-center">Welcome Back</h2>
        <p className="text-center text-gray-400 mb-6">Sign in to continue</p>

        {/* Error Message */}
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        {/* Username Input */}
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Enter your username"
          className="w-full p-3 pl-6 mb-4 border border-gray-900 rounded-3xl bg-gray-50 dark:bg-[#4242424e] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
        />

        {/* Password Input with Eye Toggle */}
        <div className="relative mb-6">
          <input
            type={showPass ? "text" : "password"}
            value={pass}
            onChange={(e) => setPass(e.target.value)}
            placeholder="Enter your password"
            autoComplete="current-password"
            className="w-full p-3 pl-6 border border-gray-900 rounded-3xl bg-[#4242424e] dark:bg-[#4242424e] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <span
            onClick={() => setShowPass(!showPass)}
            className="absolute right-4 top-3 cursor-pointer text-gray-400"
          >
            {showPass ? (
              <AiOutlineEyeInvisible size={22} />
            ) : (
              <AiOutlineEye size={22} />
            )}
          </span>
        </div>

        {/* Submit Button */}
        <button
          onClick={handleLogin}
          disabled={loading}
          className={`w-full flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white py-2 rounded-3xl transition duration-200 ${
            loading ? "animate-pulse cursor-not-allowed" : ""
          }`}
        >
          {loading ? (
            <>
              <AiOutlineLoading3Quarters className="animate-spin" size={20} />
              Logging in...
            </>
          ) : (
            "Continue"
          )}
        </button>

        {/* Switch to Register */}
        <p className="mt-4 text-center">
          Don't have an account?{" "}
          <span
            onClick={switchToRegister}
            className="text-purple-500 hover:underline cursor-pointer"
          >
            Register
          </span>
        </p>
      </div>
      {/* <button onClick={handleToastDemo}>hehe</button> */}
    </div>
  );
}

export default Login;
