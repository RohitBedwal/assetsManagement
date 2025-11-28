import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Lock, Mail } from "lucide-react";
import { useUser } from "../context/UserContext";

const API_URL = import.meta.env.VITE_BACKEND_URL; // ⬅ Using ENV

const Login = () => {
  const navigate = useNavigate();
  const { login } = useUser();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Use the UserContext login function
        login(data);
        navigate("/");
      } else {
        setError(data.message || "Invalid credentials");
      }
    } catch (err) {
      console.error("Login Error:", err);
      setError("Server error. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-100 overflow-hidden">
      <div className="absolute top-20 left-32 w-72 h-72 bg-blue-200 mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
      <div className="absolute bottom-20 right-32 w-72 h-72 bg-indigo-200 mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>

      <div className="relative z-10 w-full max-w-md bg-white/80 backdrop-blur-xl border border-slate-100 shadow-2xl p-8 space-y-8">
        <div className="text-center">
          <div className="flex items-center w-full justify-center mb-3">
            <img src="src/assets/logo.jpg" className="w-[100px]" alt="Logo" />
          </div>
          <h1 className="text-3xl font-bold text-blue-700 font-poppins">
            SOS Asset Management
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Sign in to continue to your dashboard
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <div className="relative">
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full border border-slate-200 bg-white/80 pl-10 pr-3 py-2.5 text-sm shadow-sm placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition"
                placeholder="you@example.com"
              />
            </div>
          </div>

          <div className="relative">
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full border border-slate-200 bg-white/80 pl-10 pr-3 py-2.5 text-sm shadow-sm placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition"
                placeholder="••••••••"
              />
            </div>
          </div>

          {error && (
            <div className="text-red-500 text-sm text-center font-medium bg-red-50 py-2">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className={`w-full mt-2 bg-blue-600 text-white text-base font-semibold py-2.5 shadow-md transition ${
              loading
                ? "opacity-70 cursor-not-allowed"
                : "hover:bg-blue-700 focus:ring-2 focus:ring-blue-300 focus:ring-offset-1"
            }`}
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-4">
          © {new Date().getFullYear()} SOS Asset Management
        </p>
      </div>
    </div>
  );
};

export default Login;
