import React, { useState } from 'react';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';

function Login({ onLogin, switchToRegister }) {
  const [username, setUsername] = useState('');
  const [pass, setPass] = useState('');
  const [showPass, setShowPass] = useState(false);

  // Validation function
  const validateForm = () => {
    const usernameRegex = /^[a-zA-Z0-9]{5,20}$/; // Alphanumeric, 5-20 chars
    if (!usernameRegex.test(username)) {
      alert('Username must be 5-20 characters and alphanumeric only.');
      return false;
    }
    if (pass.length < 6) {
      alert('Password must be at least 6 characters.');
      return false;
    }
    return true;
  };

  const handleLogin = () => {
    if (validateForm()) {
      onLogin(username, pass);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center text-gray-100 radial-bg">
      <div className="p-8 rounded-lg shadow-lg w-full max-w-md bg-opacity-80 backdrop-blur-md mt-auto">
        <h2 className="text-2xl font-bold mb-2 text-center">Welcome Back</h2>
        <p className="text-center text-gray-400 mb-6">Sign in to continue</p>

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
            type={showPass ? 'text' : 'password'}
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
            {showPass ? <AiOutlineEyeInvisible size={22} /> : <AiOutlineEye size={22} />}
          </span>
        </div>

        {/* Submit Button */}
        <button
          onClick={handleLogin}
          className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white py-2 rounded-3xl transition duration-200"
        >
          Sign In
        </button>

        {/* Switch to Register */}
        <p className="mt-4 text-center">
          Don't have an account?{' '}
          <span
            onClick={switchToRegister}
            className="text-purple-500 hover:underline cursor-pointer"
          >
            Register
          </span>
        </p>
      </div>
    </div>
  );
}

export default Login;
