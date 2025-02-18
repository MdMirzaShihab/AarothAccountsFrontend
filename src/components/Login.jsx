import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "../assets/mpi.png";
import Clock from "./Clock";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Hardcoded credentials
  const validUsername = "admin";
  const validPassword = "admin123";

  // Check if the user is already logged in
  useEffect(() => {
    const isLoggedIn = sessionStorage.getItem("isLoggedIn");
    if (isLoggedIn === "true") {
      navigate("/dashboard");
    }
  }, [navigate]);

  const handleLogin = (e) => {
    e.preventDefault();

    if (username === validUsername && password === validPassword) {
      // Save login state in sessionStorage
      sessionStorage.setItem("isLoggedIn", "true");
      navigate("/dashboard");
    } else {
      setError("Invalid username or password.");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-sm transition-transform duration-300 transform hover:scale-105">
        <div className="flex flex-col items-center mb-6">
          <img src={Logo} alt="Logo" className="w-24 h-24 mb-4" />
          <h1 className="text-2xl font-semibold text-purple-900">
            Welcome Back!
          </h1>
          <p className="text-gray-600">Please log in to your account</p>
        </div>

        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label
              htmlFor="username"
              className="block text-gray-700 font-medium mb-2">
              Username
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Enter your username"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="password"
              className="block text-gray-700 font-medium mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Enter your password"
            />
          </div>
          {error && <p className="text-red-600 text-sm mb-4">{error}</p>}
          <button
            type="submit"
            className="w-full bg-purple-900 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition duration-300">
            Login
          </button>
        </form>

        <div className="mt-6 text-center">
          <a
            href="#"
            className="text-purple-900 hover:underline"
            onClick={(e) => e.preventDefault()}>
            Forgot Password?
          </a>
          <br />
          <a
            href="#"
            className="text-purple-900 hover:underline"
            onClick={(e) => e.preventDefault()}>
            Sign Up
          </a>
        </div>
      </div>
    </div>
  );
};

export default Login;
