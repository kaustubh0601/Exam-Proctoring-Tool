import React, { useState } from 'react';
import logo from '../logo.svg';

const LoginPage = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!username.trim()) {
      setError('Username is required');
      return;
    }
    setError('');
    onLogin(username);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <div className="bg-white border border-blue-200 shadow-xl rounded-xl px-8 py-10 w-full max-w-md flex flex-col items-center">
        <img src={logo} alt="React Logo" className="w-16 h-16 mb-4 animate-spin-slow" />
        <h2 className="text-2xl font-bold text-blue-700 mb-1 font-mono">Welcome!</h2>
        <p className="text-blue-500 mb-6 text-center">Ready to check your React knowledge? Please log in to begin your exam.</p>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full">
          <label className="block">
            <span className="text-gray-700 font-medium">Username</span>
            <input
              type="text"
              className="mt-1 block w-full rounded-lg border-blue-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 px-3 py-2 text-lg"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
            />
          </label>
          {error && <div className="text-red-500 text-sm">{error}</div>}
          <button
            type="submit"
            className="bg-gradient-to-r from-blue-500 to-blue-700 text-white py-2 px-4 rounded-lg font-semibold text-lg shadow hover:scale-105 hover:from-blue-600 hover:to-blue-800 transition-all duration-200"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage; 