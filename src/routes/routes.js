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

/**
 * publicRoutes: routes that are open (no auth required)
 * protectedRoutes: routes that require the ProtectedRoute wrapper
 *
 * Each route object:
 *  - path: string
 *  - component: React component (not JSX)
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
];