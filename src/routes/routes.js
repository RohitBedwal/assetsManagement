import React from "react";

import Dashboard from "../pages/Dashboard";
import Links from "../pages/connectivity/Links.jsx";
import Vendors from "../pages/Vendors/index";
import Reports from "../pages/Reports";
import Settings from "../pages/Settings";
import Login from "../pages/Login";

import Categories from "../pages/devices/Category/DeviceCategories";
import CategoryDevices from "../pages/devices/allDevices/Devices.jsx";

import DeviceInfo from "../pages/devices/DeviceInfo";
import Profile from "../pages/Profile";

// RMA Pages
import RMASubmit from "../pages/RMA/RMASubmit";
import RMAList from "../pages/RMA/RMAList";
import RMAAdmin from "../pages/RMA/RMAAdmin";

// Test Page for routing debugging
import TestPage from "../pages/TestPage";

/**
 * publicRoutes: routes that are open (no auth required)
 * protectedRoutes: routes that require the ProtectedRoute wrapper
 *
 * Each route object:
 *  - path: string
 *  - component: React component (not JSX)
 *  - roles: array of roles that can access this route (optional)
 */
export const publicRoutes = [
  {
    path: "/login",
    component: Login,
  },
];

export const protectedRoutes = [
  {
    path: "/",
    component: Dashboard,
  },
  // Test route for debugging
  {
    path: "/test",
    component: TestPage,
  },
  // Devices Section
  {
    path: "/devices",
    component: Categories,
  },
  {
    path: "/devices/:id",
    component: CategoryDevices,
  },
  {
    path: "/devices/info/:deviceId",
    component: DeviceInfo,
  },

  // Other Pages
  {
    path: "/links",
    component: Links,
  },
  {
    path: "/vendors",
    component: Vendors,
  },
  {
    path: "/reports",
    component: Reports,
  },
  {
    path: "/settings",
    component: Settings,
  },
  {
    path: "/profile",
    component: Profile,
  },

  // RMA Routes - Updated to be more permissive for testing
  {
    path: "/rma/submit",
    component: RMASubmit,
    // Remove role restrictions for now to test routing
  },
  {
    path: "/rma/list",
    component: RMAList,
    // Remove role restrictions for now to test routing
  },
  {
    path: "/rma/admin",
    component: RMAAdmin,
    // Keep admin restriction but make it more flexible
    roles: ["admin", "user"], // Temporarily allow both for testing
  },
];

// Debug log for routes
console.log("📍 Routes loaded:", {
  publicRoutes: publicRoutes.length,
  protectedRoutes: protectedRoutes.length,
  rmaRoutes: protectedRoutes.filter(r => r.path.startsWith('/rma')).length
});