import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { getUserByEmail, createUser } from "../api/usersApi";

const Signup = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [toast, setToast] = useState("");

  const handleSignup = async (e) => {
    e.preventDefault();
    if (!username || username.length < 3) return setToast("Username must be at least 3 characters");
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return setToast("Invalid email");
    if (!password || password.length < 6) return setToast("Password must be at least 6 characters");
    if (password !== confirmPassword) return setToast("Passwords do not match");

    try {
      const existing = await getUserByEmail(email);
      if (existing.length > 0) return setToast("Email already exists");

      const newUser = {
        id: uuidv4(),
        username,
        email,
        password,
        wishlist: [],
        orders: [],
        role: "user",
        active: true,
      };

      await createUser(newUser);
      setToast("Signup successful! Redirecting...");
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      console.error(err);
      setToast("Something went wrong!");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-xl space-y-6">
        <h2 className="text-3xl font-bold text-center text-gray-900">Create Account</h2>

        {toast && <p className="text-center text-red-500">{toast}</p>}

        <form onSubmit={handleSignup} className="space-y-4">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-4 py-2 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full px-4 py-2 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />

          <button
            type="submit"
            className="w-full py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition font-semibold"
          >
            Sign Up
          </button>
        </form>

        <p className="text-center text-gray-600">
          Already have an account?{" "}
          <span
            className="text-indigo-500 cursor-pointer font-medium hover:underline"
            onClick={() => navigate("/login")}
          >
            Login
          </span>
        </p>
      </div>

      <footer className="mt-10 w-full bg-gray-800 text-white py-8">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between px-6 gap-6">
          <div>
            <h3 className="text-xl font-bold">Zeyora</h3>
            <p className="text-gray-300 mt-2">Luxury perfume brand from Kerala, Kozhikode.</p>
            <p className="text-gray-400 text-sm mt-1">Privacy · Terms · Refunds</p>
          </div>
          <div>
            <h4 className="text-lg font-semibold">Contact Us</h4>
            <p className="text-gray-300 mt-1">zeyorafragrance@gmail.com</p>
            <p className="text-gray-300 mt-1">Kerala, Kozhikode</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Signup;
