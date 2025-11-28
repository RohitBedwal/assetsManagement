import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useUser } from "../context/UserContext";

/**
 * ProtectedRoute - Handles authentication and role-based access control
 * @param {React.ReactNode} children - Components to render if access is granted
 * @param {string[]} roles - Optional array of required roles
 */
function ProtectedRoute({ children, roles }) {
  const location = useLocation();
  const { user, loading, isAuthenticated, hasAnyRole } = useUser();

  console.log("🛡️ ProtectedRoute Debug:", {
    path: location.pathname,
    user: user,
    loading: loading,
    isAuthenticated: isAuthenticated,
    requiredRoles: roles,
    userHasRole: roles ? hasAnyRole(roles) : "N/A"
  });

  // Show loading while checking authentication state
  if (loading) {
    console.log("⏳ ProtectedRoute: Loading user state...");
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    console.log("❌ ProtectedRoute: User not authenticated, redirecting to login");
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  // Check role-based access if roles are specified
  if (roles && roles.length > 0) {
    if (!hasAnyRole(roles)) {
      console.log("🚫 ProtectedRoute: User does not have required roles");
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
              <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h3 className="mt-2 text-sm font-medium text-gray-900">Access Denied</h3>
            <p className="mt-1 text-sm text-gray-500">
              You don't have permission to access this page.
            </p>
            <p className="mt-1 text-xs text-gray-400">
              Required roles: {roles.join(', ')}
            </p>
            <p className="mt-1 text-xs text-gray-400">
              Your role: {user?.role || user?.roles?.join(', ') || 'No role assigned'}
            </p>
            <div className="mt-6">
              <button
                onClick={() => window.history.back()}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Go Back
              </button>
            </div>
          </div>
        </div>
      );
    }
  }

  console.log("✅ ProtectedRoute: Access granted");
  return children;
}

export default ProtectedRoute;  