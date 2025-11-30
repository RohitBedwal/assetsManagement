// src/components/Sidebar.jsx
import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import clsx from "clsx";
import {
  LayoutDashboard,
  HardDrive,
  Link2,
  Store,
  BarChart3,
  Settings,
  ChevronRight,
  Users,
  Package,
  Shield,
  Building2,
} from "lucide-react";
import { useUser } from "../context/UserContext";

export default function Sidebar() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const { user, isAdmin } = useUser();

  // Check screen size for responsive behavior
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 1200);
    };
    
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const shouldExpand = isMobile ? isExpanded : true;

  // Base navigation items available to all users
  const baseNavItems = [
    { path: "/", icon: LayoutDashboard, label: "Dashboard" },
    { path: "/devices", icon: HardDrive, label: "Devices" },
    { path: "/rma/list", icon: Package, label: "My RMA" },
    { path: "/reports", icon: BarChart3, label: "Reports" },
    // { path: "/links", icon: Link2, label: "Inventory" },
    { path: "/vendors", icon: Store, label: "Vendors" },
    // { path: "/oem", icon: Building2, label: "OEM" },
    { path: "/settings", icon: Users, label: "Settings" },
  ];

  // Admin-only navigation items
  const adminNavItems = [
    { path: "/rma/admin", icon: Shield, label: "RMA Admin", adminOnly: true },
  ];

  // Combine navigation items based on user role
  const navItems = isAdmin() 
    ? [...baseNavItems, ...adminNavItems]
    : baseNavItems;


  return (
    <>
      <style>{`
        :root {
          --sidebar-width: ${isMobile ? '64px' : '256px'};
        }
      `}</style>
      <aside
        onMouseEnter={() => isMobile && setIsExpanded(true)}
        onMouseLeave={() => isMobile && setIsExpanded(false)}
        className={clsx(
          "h-full flex flex-col bg-white border-r border-gray-100 transition-all duration-300 flex-shrink-0",
          isMobile 
            ? "w-16 fixed left-0 top-0 bottom-0 z-50 shadow-lg" 
            : "w-64 fixed left-0 top-0 bottom-0 z-40"
        )}
        style={isMobile && isExpanded ? { width: '256px', boxShadow: '0 0 30px rgba(0,0,0,0.15)' } : undefined}
      >
      <div className="flex flex-col h-full">
        {/* Logo */}
        <div className={clsx("flex items-center gap-3 py-6", shouldExpand ? "px-6" : "px-4 justify-center")}>
          <img src="/src/assets/logo.jpg" alt="Logo" className="h-8 w-8 rounded-lg object-cover flex-shrink-0" />
          {shouldExpand && (
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold text-gray-800 tracking-tight">SOS</span>
              <span className="text-lg font-bold text-blue-600 tracking-tight">ASSET</span>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 space-y-2">
          {navItems.map(({ path, icon: Icon, label, adminOnly }) => (
            <NavLink
              key={path}
              to={path}
              end
              className={({ isActive }) =>
                clsx(
                  "flex items-center gap-4 rounded-xl transition-all text-sm font-medium relative",
                  shouldExpand ? "px-4 py-3" : "px-3 py-3 justify-center",
                  isActive
                    ? adminOnly 
                      ? "bg-red-600 text-white shadow-lg shadow-red-200"
                      : "bg-blue-600 text-white shadow-lg shadow-blue-200"
                    : adminOnly
                      ? "text-red-600 hover:bg-red-50 hover:text-red-700"
                      : "text-gray-500 hover:bg-gray-50 hover:text-blue-600"
                )
              }
            >
              <Icon className="h-4 w-4 flex-shrink-0" />
              {shouldExpand && (
                <span className="whitespace-nowrap flex items-center gap-2">
                  {label}
                  {adminOnly && (
                    <span className="text-xs px-1.5 py-0.5 bg-red-100 text-red-700 rounded-full font-medium">
                      ADMIN
                    </span>
                  )}
                </span>
              )}
            </NavLink>
          ))}

          {/* Product Section */}
          

          {/* Business Section */}
          
        </nav>

        {/* Footer */}
        {shouldExpand && (
          <div className="px-6 py-4 text-xs text-gray-400 border-t border-gray-100">
            <p className="font-bold text-gray-800">© SOS ASSET 2024</p>
            <p className="mt-1">Asset Management & Tracking System</p>
          </div>
        )}
      </div>

      {/* Hover hint chevron for collapsed state */}
      {isMobile && !isExpanded && (
        <div className="absolute top-1/2 right-[-12px] transform -translate-y-1/2 bg-blue-600 text-white p-1.5 rounded-full shadow-lg animate-pulse">
          <ChevronRight className="h-3.5 w-3.5" />
        </div>
      )}
    </aside>
    </>
  );
}
