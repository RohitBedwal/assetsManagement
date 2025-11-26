import React from "react";
import { Navigate, useLocation } from "react-router-dom";

/**
 * Basic token validity check:
 * - returns false if no token
 * - if token is a JWT, tries to check exp claim and reject expired tokens
 */
function isTokenValid() {
  const token = localStorage.getItem("authToken");
  if (!token) return false;

  // Try to decode as JWT and check expiry (best-effort)
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return true; // not a JWT, assume present token is valid
    const payload = JSON.parse(atob(parts[1]));
    if (payload.exp && Date.now() >= payload.exp * 1000) return false;
    return true;
  } catch (e) {
    // any error decoding -> assume token present is valid (or change to false if you prefer)
    return true;
  }
}

/**
 * ProtectedRoute
 * - children: protected UI to render
 * - roles (optional): array of allowed roles; user roles should be available in localStorage or context
 */
function ProtectedRoute({ children, roles }) {
  const location = useLocation();
  const isAuthenticated = isTokenValid();

  if (!isAuthenticated) {
    // Save where the user wanted to go so you can redirect back post-login
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (roles && roles.length) {
    // Example role check: expects user object in localStorage (adjust to your app)
    try {
      const user = JSON.parse(localStorage.getItem("user") || "null");
      const hasRole = user && Array.isArray(user.roles) && roles.some((r) => user.roles.includes(r));
      if (!hasRole) {
        return <Navigate to="/unauthorized" replace />;
      }
    } catch (e) {
      // if parsing fails, block access
      return <Navigate to="/unauthorized" replace />;
    }
  }

  return children;
}

export default ProtectedRoute;  