import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { getUserByEmail, updateUser } from "../api/usersApi";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [toast, setToast] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) return setToast("Enter email and password");

    try {
      const users = await getUserByEmail(email);
      if (!users.length) return setToast("Email not found");

      const user = users[0];
      if (user.password !== password) return setToast("Incorrect password");
      if (!user.active) return setToast("Account blocked. Contact support.");

      login(user);
      navigate(user.role === "admin" ? "/dashboard" : "/");
    } catch (err) {
      console.error(err);
      setToast("Something went wrong!");
    }
  };

  const handleResetPassword = async () => {
    if (!email) return setToast("Enter your email to reset password");
    try {
      const users = await getUserByEmail(email);
      if (!users.length) return setToast("Email not found");
      const user = users[0];

      const newPass = prompt("Enter new password (min 6 chars):");
      if (!newPass || newPass.length < 6) return setToast("Password too short");

      await updateUser(user.id, { password: newPass });
      setToast("Password reset successfully!");
    } catch (err) {
      console.error(err);
      setToast("Something went wrong!");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-xl space-y-6">
        <h2 className="text-3xl font-bold text-center text-gray-900">Login</h2>

        {toast && <p className="text-center text-red-500">{toast}</p>}

        <form onSubmit={handleLogin} className="space-y-4">
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
          <div className="text-right"><span
            className="text-indigo-500 text-xs cursor-pointer font-medium hover:underline text-right"
            onClick={handleResetPassword}
          >
            Forgot password?
          </span></div>
          

          <button
            type="submit"
            className="w-full py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition font-semibold"
          >
            Log In
          </button>
        </form>

        <div className="flex justify-center items-center text-sm mt-2">
          <span
            className="text-gray-600 "
            
          >
            Don't have an account?{" "} <span className="text-blue-600 cursor-pointer text-sm"> <Link to={"/signup"}>Sign Up</Link></span>
          </span>
        </div>
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

export default Login;
