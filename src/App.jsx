import React, { useEffect, useState } from "react";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import { protectedRoutes, publicRoutes } from "./routes/routes";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

// 🔔 Socket + Toast Notification
import { io } from "socket.io-client";
import toast, { Toaster } from "react-hot-toast";

// 🔌 Socket configuration with better error handling
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000';

const socket = io(BACKEND_URL, {
  autoConnect: false, // Manual connection control
  reconnection: true,
  reconnectionDelay: 1000,
  reconnectionAttempts: 5,
  timeout: 20000,
  transports: ["websocket", "polling"], // Fallback to polling if websocket fails
});

function App() {
  const location = useLocation();
  const hideLayout = location.pathname === "/login";
  const [isConnected, setIsConnected] = useState(false);
  const [connectionError, setConnectionError] = useState(null);

  // 📡 Socket connection and real-time notifications
  useEffect(() => {
    // Connect socket
    socket.connect();

    // Connection event listeners
    socket.on("connect", () => {
      console.log("✅ Socket connected:", socket.id);
      setIsConnected(true);
      setConnectionError(null);
      toast.success("Connected to server", { 
        id: "connection",
        duration: 2000 
      });
    });

    socket.on("disconnect", (reason) => {
      console. log("❌ Socket disconnected:", reason);
      setIsConnected(false);
      if (reason === "io server disconnect") {
        // Server disconnected, try to reconnect
        socket.connect();
      }
    });

    socket.on("connect_error", (error) => {
      console.error("🔥 Socket connection error:", error. message);
      setIsConnected(false);
      setConnectionError(error.message);
      toast.error("Connection failed.  Retrying...", { 
        id: "connection-error",
        duration: 3000 
      });
    });

    socket.on("reconnect", (attemptNumber) => {
      console.log("🔄 Reconnected after", attemptNumber, "attempts");
      setIsConnected(true);
      setConnectionError(null);
      toast.success("Reconnected to server", { 
        id: "reconnection",
        duration: 2000 
      });
    });

    socket.on("reconnect_error", (error) => {
      console.error("🔄❌ Reconnection failed:", error.message);
      toast.error("Reconnection failed", { 
        id: "reconnect-error",
        duration: 3000 
      });
    });

    // Application-specific event listeners
    socket.on("notification", (data) => {
      console.log("📢 Notification received:", data);
      toast.success(data?.message ?? "New update received!", {
        duration: 4000,
        icon: "🔔",
      });
    });

    socket. on("expiry-alert", (data) => {
      console. log("⚠️ Expiry alert received:", data);
      toast.error(
        `${data.message} (Expires: ${new Date(data. expiryDate).toLocaleDateString()})`,
        {
          duration: 6000,
          icon: "⚠️",
        }
      );
    });

    socket.on("device-added", (data) => {
      toast.success(`New device added: ${data.deviceName}`, {
        duration: 4000,
        icon: "📱",
      });
    });

    socket.on("device-updated", (data) => {
      toast(`Device updated: ${data.deviceName}`, {
        duration: 3000,
        icon: "🔄",
      });
    });

    // Cleanup on unmount
    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("connect_error");
      socket.off("reconnect");
      socket. off("reconnect_error");
      socket.off("notification");
      socket.off("expiry-alert");
      socket.off("device-added");
      socket. off("device-updated");
      socket.disconnect();
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#f9fafb] flex flex-col">
      {/* 🔔 Notification UI */}
      <Toaster 
        position="top-right"
        toastOptions={{
          // Default options for all toasts
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: '#10B981',
              secondary: '#fff',
            },
          },
          error: {
            duration: 5000,
            iconTheme: {
              primary: '#EF4444',
              secondary: '#fff',
            },
          },
        }}
      />

      {/* Connection Status (only show when disconnected or error) */}
      {(! isConnected || connectionError) && (
        <div className="bg-red-50 border-l-4 border-red-400 p-2 text-center text-sm">
          <div className="flex items-center justify-center gap-2">
            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
            <span className="text-red-700">
              {connectionError ?  `Connection Error: ${connectionError}` : 'Disconnected from server'}
            </span>
            {! isConnected && (
              <button
                onClick={() => socket.connect()}
                className="ml-2 text-red-600 underline hover:text-red-800"
              >
                Retry
              </button>
            )}
          </div>
        </div>
      )}

      {/* Layout */}
      <div className="flex flex-1 h-screen overflow-hidden">
        {/* Sidebar */}
        {!hideLayout && <Sidebar />}

        {/* Main Content Area - Add margin to prevent overlap */}
        <div className="flex-1 flex flex-col h-screen overflow-hidden" style={{ marginLeft: hideLayout ? '0' : 'var(--sidebar-width, 64px)' }}>
          {/* Header */}
          {!hideLayout && <Header socketConnected={isConnected} />}

          {/* Page Routes */}
          <main
            className={`flex-1 bg-[#F5F7FB] overflow-y-auto p-4 md:p-6 lg:p-8 ${
              hideLayout ? "w-full" : ""
            }`}
          >
          <Routes>
            {/* Public Routes */}
            {publicRoutes.map((r) => (
              <Route key={r.path} path={r.path} element={<r.component />} />
            ))}

            {/* Protected Routes */}
            {protectedRoutes.map((r) => (
              <Route
                key={r.path}
                path={r.path}
                element={
                  <ProtectedRoute>
                    <r.component socket={socket} isConnected={isConnected} />
                  </ProtectedRoute>
                }
              />
            ))}

            {/* Redirect unknown pages */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        </div>
      </div>
    </div>
  );
}

export default App;