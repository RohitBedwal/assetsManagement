// src/components/Sidebar.jsx
import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import clsx from "clsx";
import {
  LayoutDashboard,
  HardDrive,
  Link2,
  Store,
  BarChart3,
  Settings,
  HelpCircle,
  ChevronRight,
} from "lucide-react";

export default function Sidebar() {
  const [isExpanded, setIsExpanded] = useState(false);

  const navItems = [
    { path: "/", icon: LayoutDashboard, label: "Dashboard" },
    { path: "/devices", icon: HardDrive, label: "Devices" },
    { path: "/links", icon: Link2, label: "Links" },
    { path: "/vendors", icon: Store, label: "Vendors" },
    { path: "/reports", icon: BarChart3, label: "Reports" },
    { path: "/settings", icon: Settings, label: "Settings" },
  ];

  return (
    <aside
  onMouseEnter={() => setIsExpanded(true)}
  onMouseLeave={() => setIsExpanded(false)}
  className={clsx(
    "h-full flex flex-col bg-white border-r border-slate-200 shadow-sm transition-all duration-100 z-40 relative", // <-- added z-40 + relative
    isExpanded ? "w-50" : "w-[60px]"
  )}
>

      {/* Navigation */}
      <nav className="flex flex-col gap-1 p-3 mt-2">
        {navItems.map(({ path, icon: Icon, label }) => (
          <NavLink
            key={path}
            to={path}
            end
            className={({ isActive }) =>
              clsx(
                "flex items-center gap-3  px-3 py-2 text-sm font-medium transition-all duration-100",
                isActive
                  ? " text-blue-600"
                  : "text-slate-600 hover:bg-slate-50 hover:text-blue-600"
              )
            }
          >
            <Icon className="h-5 w-5 flex-shrink-0" />
            {isExpanded && (
              <span className="whitespace-nowrap transition-opacity duration-100">
                {label}
              </span>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Help Section */}
      <div
        className={clsx(
          "mt-auto p-4 border-t border-slate-100 transition-all duration-100",
          isExpanded ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
      >
        <div className="bg-slate-50  text-center p-3">
          <div className="flex items-center justify-center text-blue-600 mb-2">
            <HelpCircle className="h-5 w-5" />
          </div>
          <h3 className="font-semibold text-slate-800 text-sm">Need Help?</h3>
          <p className="text-xs text-slate-600 mt-1 mb-3">
            Contact our support team.
          </p>
          <button className="bg-blue-600 text-white text-xs font-semibold py-2 px-3  w-full hover:bg-blue-700 transition">
            Contact Support
          </button>
        </div>
      </div>

      {/* Chevron Hint */}
      {!isExpanded && (
        <div className="absolute top-1/2 right-[-10px] transform -translate-y-1/2 bg-blue-600 text-white p-1 rounded-full shadow-lg">
          <ChevronRight className="h-4 w-4" />
        </div>
      )}
    </aside>
  );
}
