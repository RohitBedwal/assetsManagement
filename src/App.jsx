// src/App.jsx
import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";

import Dashboard from "./pages/Dashboard";
import Links from "./pages/Links";
import Vendors from "./pages/Vendors";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login";

import Categories from "./pages/devices/DeviceCategories";
import CategoryDevices from "./pages/devices/Devices";
import ScanDevice from "./pages/devices/ScanDevice";
import DeviceInfo from "./pages/devices/DeviceInfo";
import Profile from "./pages/Profile";

function App() {
  const location = useLocation();
  const hideLayout = location.pathname === "/login";

  return (
    <div className="min-h-screen bg-[#f9fafb] flex flex-col">
      {/* Header */}
      {!hideLayout && (
        <div className="bg-white border-b border-slate-200 shadow-sm">
          <Header />
        </div>
      )}

      {/* Main Layout (Sidebar + Page Content) */}
      <div className="flex flex-1">
        {/* Sidebar */}
        {!hideLayout && (
          <div
            className="transition-all duration-300 border-r border-slate-200 bg-white"
            style={{ width: "60px" }} // Keep same hover/expand logic
          >
            <Sidebar />
          </div>
        )}

        {/* Main Content */}
        <main
          className={`flex-1 bg-[#f9fafb] min-h-screen overflow-y-auto p-6 ${
            !hideLayout ? "" : "w-full"
          }`}
        >
          <Routes>
            {/* Public Route */}
            <Route path="/login" element={<Login />} />

            {/* Protected Routes */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />

            {/* Devices Section */}
            <Route
              path="/devices"
              element={
                <ProtectedRoute>
                  <Categories />
                </ProtectedRoute>
              }
            />
            <Route
              path="/devices/:id"
              element={
                <ProtectedRoute>
                  <CategoryDevices />
                </ProtectedRoute>
              }
            />
            <Route
              path="/devices/:id/scan"
              element={
                <ProtectedRoute>
                  <ScanDevice />
                </ProtectedRoute>
              }
            />
            <Route
              path="/devices/info/:deviceId"
              element={
                <ProtectedRoute>
                  <DeviceInfo />
                </ProtectedRoute>
              }
            />

            {/* Other Pages */}
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
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />

            {/* Catch-all */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default App;
