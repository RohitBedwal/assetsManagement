// src/App.jsx
import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";

import Dashboard from "./pages/Dashboard";
import Devices from "./pages/Devices";
import Links from "./pages/Links";
import Vendors from "./pages/Vendors";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login";   // ✅ renamed import

function App() {
  const location = useLocation();
  const hideLayout = location.pathname === "/login"; // ✅ check for /login

  return (
    <div className="min-h-screen bg-white">
      {/* Header only when not on /login */}
      {!hideLayout && <Header />}

      <div className="flex">
        {/* Sidebar only when not on /login */}
        {!hideLayout && <Sidebar />}

        {/* If Sidebar is hidden, main should take full width */}
        <main className={`${!hideLayout ? "ml-64 w-[calc(100%-256px)]" : "w-full"}`}>
          <div className="p-8">
            <Routes>
              {/* Public Route */}
              <Route path="/login" element={<Login />} />   {/* ✅ updated */}

              {/* Protected Routes */}
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/devices"
                element={
                  <ProtectedRoute>
                    <Devices />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/links"
                element={
                  <ProtectedRoute>
                    <Links />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/vendors"
                element={
                  <ProtectedRoute>
                    <Vendors />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/reports"
                element={
                  <ProtectedRoute>
                    <Reports />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/settings"
                element={
                  <ProtectedRoute>
                    <Settings />
                  </ProtectedRoute>
                }
              />

              {/* Catch-all for wrong URLs */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
