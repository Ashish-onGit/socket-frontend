import React, { useState } from 'react';
import { AiOutlineEye, AiOutlineEyeInvisible, AiOutlineLoading3Quarters } from 'react-icons/ai';

function Register({ onRegister, switchToLogin }) {
  const [username, setUsername] = useState('');
  const [pass, setPass] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Validation function
  const validateForm = () => {
    const usernameRegex = /^[a-zA-Z0-9]{5,20}$/; // Alphanumeric, 5-20 chars
    if (!usernameRegex.test(username)) {
      setError('Username must be 5-20 characters and alphanumeric only.');
      return false;
    }
    if (pass.length < 6) {
      setError('Password must be at least 6 characters.');
      return false;
    }
    return true;
  };

  const handleRegister = async () => {
    setError('');
    if (!validateForm()) return;

    setLoading(true);
    try {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const success = await onRegister(username, pass); // Assume returns true/false
      if (!success) {
        setError('Registration failed. Try a different username.');
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center text-gray-100 radial-bg">
      <div className="p-8 rounded-lg shadow-lg w-full max-w-md bg-opacity-80 backdrop-blur-md mt-auto">
        <h2 className="text-2xl font-bold mb-2 text-center">Create Your Account</h2>
        <p className="text-center text-gray-400 mb-6">Sign up to access exclusive features</p>

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
            type={showPass ? 'text' : 'password'}
            value={pass}
            onChange={(e) => setPass(e.target.value)}
            placeholder="Enter your password"
            autoComplete="new-password"
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
          onClick={handleRegister}
          disabled={loading}
          className={`w-full flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white py-2 rounded-3xl transition duration-200 ${
            loading ? 'animate-pulse cursor-not-allowed' : ''
          }`}
        >
          {loading ? (
            <>
              <AiOutlineLoading3Quarters className="animate-spin" size={20} />
              Signing up...
            </>
          ) : (
            'Sign Up'
          )}
        </button>

        {/* Switch to Login */}
        <p className="mt-4 text-center">
          Already have an account?{' '}
          <span
            onClick={switchToLogin}
            className="text-purple-500 hover:underline cursor-pointer"
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
}

export default Register;