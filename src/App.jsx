import React from "react";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
// import ProtectedRoute from "./routes/ProtectedRoute";

// import { publicRoutes, protectedRoutes } from "./route";
// import ProtectedRoute from "./routes/ProtectedRoute";
import { protectedRoutes, publicRoutes } from "./routes/routes";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

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
            {/* Public / Open Routes */}
            {publicRoutes.map((r) => {
              const Component = r.component;
              return <Route key={r.path} path={r.path} element={<Component />} />;
            })}

            {/* Protected Routes */}
            {protectedRoutes.map((r) => {
              const Component = r.component;
              return (
                <Route
                  key={r.path}
                  path={r.path}
                  element={
                    <ProtectedRoute>
                      <Component />
                    </ProtectedRoute>
                  }
                />
              );
            })}

            {/* Catch-all */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default App;