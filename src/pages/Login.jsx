import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();

    // Static credentials for now
    if (email === "admin@example.com" && password === "admin123") {
      localStorage.setItem("authToken", "static_token");
      navigate("/"); // redirect to dashboard
    } else {
      setError("Invalid email or password");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-cables relative">
      {/* Background Overlay */}
      <div className="absolute inset-0 bg-white/60 backdrop-blur-sm"></div>

      {/* Login Card */}
      <div className="relative z-10 w-full max-w-md space-y-8 rounded-xl bg-white/90 p-8 shadow-2xl backdrop-blur-lg">
        <div className="text-center">
          <h1 className="text-3xl font-poppins font-bold text-[var(--text-primary)]">
            Asset Management
          </h1>
          <p className="mt-2 text-[var(--text-secondary)]">
            Sign in to access your dashboard
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          {/* Username / Email */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-[var(--text-secondary)]"
            >
              Username or Email
            </label>
            <div className="mt-1">
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="block w-full rounded-lg border border-gray-300 bg-white/70 px-3 py-2 shadow-sm placeholder-[var(--text-secondary)] focus:border-[var(--primary-color)] focus:ring-[var(--primary-color)] sm:text-sm"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-[var(--text-secondary)]"
            >
              Password
            </label>
            <div className="mt-1">
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="block w-full rounded-lg border border-gray-300 bg-white/70 px-3 py-2 shadow-sm placeholder-[var(--text-secondary)] focus:border-[var(--primary-color)] focus:ring-[var(--primary-color)] sm:text-sm"
              />
            </div>
          </div>

          {/* Error Message */}
          {error && <p className="text-red-500 text-sm">{error}</p>}

          {/* Remember me + Forgot password */}
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 rounded border-gray-300 text-[var(--primary-color)] focus:ring-[var(--primary-color)]"
              />
              <label
                htmlFor="remember-me"
                className="ml-2 block text-sm text-[var(--text-secondary)]"
              >
                Remember Me
              </label>
            </div>

            <div className="text-sm">
              <a
                href="#"
                className="font-medium text-[var(--primary-color)] hover:text-blue-600"
              >
                Forgot Password?
              </a>
            </div>
          </div>

          {/* Login Button */}
          <div>
            <button
              type="submit"
              className="flex w-full justify-center rounded-lg bg-[var(--primary-color)] px-4 py-3 text-base font-semibold text-white shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] focus:ring-offset-2"
            >
              Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
