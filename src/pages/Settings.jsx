import React, { useState } from "react";
import { User, Lock, Bell, Palette, Shield } from "lucide-react";
import { useUser } from "../context/UserContext";

export default function Settings() {
  const [activeTab, setActiveTab] = useState("account");
  const { user } = useUser();

  return (
    <div className="space-y-6">
      {/* 🧭 Header */}
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-blue-600">Settings</h1>
          <p className="text-gray-500 text-sm mt-1">
            Manage your account, preferences, and system configurations.
          </p>
        </div>
      </div>

      {/* 🧱 Tabs */}
      <div className="flex flex-wrap gap-3 border-b border-slate-200 pb-2">
        {[
          { id: "account", icon: User, label: "Account" },
          { id: "security", icon: Lock, label: "Security" },
          { id: "notifications", icon: Bell, label: "Notifications" },
          { id: "appearance", icon: Palette, label: "Appearance" },
          { id: "privacy", icon: Shield, label: "Privacy" },
        ].map(({ id, icon: Icon, label }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium  transition ${
              activeTab === id
                ? "bg-blue-100 text-blue-700"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            <Icon className="h-4 w-4" />
            {label}
          </button>
        ))}
      </div>

      {/* 🔧 Tab Content */}
      <div className="bg-white border border-slate-200 shadow-sm rounded-lg p-6">
        {activeTab === "account" && (
          <div className="space-y-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Profile Settings
            </h2>
            
            {/* Profile Section */}
            <div className="flex items-center gap-6 pb-6 border-b border-gray-100">
              <div className="relative">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-3xl font-bold shadow-lg">
                  {user?.name?.charAt(0).toUpperCase() || user?.username?.charAt(0).toUpperCase() || "U"}
                </div>
                <button className="absolute bottom-0 right-0 w-8 h-8 bg-white rounded-full border-2 border-blue-500 flex items-center justify-center hover:bg-blue-50 transition">
                  <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </button>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-800">{user?.name || user?.username || "User"}</h3>
                <p className="text-sm text-gray-500 mt-1">
                  {user?.role?.charAt(0).toUpperCase() + user?.role?.slice(1) || "User"} • {user?.email || "No email"}
                </p>
                <div className="flex gap-2 mt-3">
                  <span className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-full">
                    Active
                  </span>
                  <span className="px-3 py-1 bg-green-50 text-green-700 text-xs font-medium rounded-full">
                    Verified
                  </span>
                </div>
              </div>
            </div>

            {/* Account Information */}
            <div>
              <h3 className="text-sm font-semibold text-gray-800 mb-4">Account Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                  <div className="w-full border border-slate-200 bg-gray-50 rounded-lg px-4 py-2.5 text-sm text-gray-700">
                    {user?.name || user?.username || "Not specified"}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
                  <div className="w-full border border-slate-200 bg-gray-50 rounded-lg px-4 py-2.5 text-sm text-gray-700">
                    {user?.username || "Not specified"}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                  <div className="w-full border border-slate-200 bg-gray-50 rounded-lg px-4 py-2.5 text-sm text-gray-700">
                    {user?.email || "Not specified"}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
                  <div className="w-full border border-slate-200 bg-gray-50 rounded-lg px-4 py-2.5 text-sm text-gray-700">
                    {user?.role?.charAt(0).toUpperCase() + user?.role?.slice(1) || "User"}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
                  <div className="w-full border border-slate-200 bg-gray-50 rounded-lg px-4 py-2.5 text-sm text-gray-700">
                    {user?.department || "Not specified"}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">User ID</label>
                  <div className="w-full border border-slate-200 bg-gray-50 rounded-lg px-4 py-2.5 text-sm text-gray-700">
                    {user?.employeeId || user?._id || "Not specified"}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "security" && (
          <div>
            <h2 className="text-lg font-semibold text-blue-600 mb-3">
              Security Settings
            </h2>
            <p className="text-gray-600 text-sm mb-3">
              Manage your password and authentication preferences.
            </p>
            <div className="space-y-3">
              <button className="px-4 py-2 border border-slate-200 text-sm text-gray-700  hover:bg-slate-50">
                Change Password
              </button>
              <button className="px-4 py-2 border border-slate-200 text-sm text-gray-700  hover:bg-slate-50">
                Enable Two-Factor Authentication (2FA)
              </button>
            </div>
          </div>
        )}

        {activeTab === "notifications" && (
          <div>
            <h2 className="text-lg font-semibold text-blue-600 mb-3">
              Notification Preferences
            </h2>
            <div className="space-y-3">
              <label className="flex items-center gap-3">
                <input type="checkbox" defaultChecked className="accent-blue-600" />
                <span className="text-sm text-gray-700">
                  Email alerts for new devices
                </span>
              </label>
              <label className="flex items-center gap-3">
                <input type="checkbox" defaultChecked className="accent-blue-600" />
                <span className="text-sm text-gray-700">
                  Notify when reports are generated
                </span>
              </label>
              <label className="flex items-center gap-3">
                <input type="checkbox" className="accent-blue-600" />
                <span className="text-sm text-gray-700">
                  Vendor update notifications
                </span>
              </label>
            </div>
          </div>
        )}

        {activeTab === "appearance" && (
          <div>
            <h2 className="text-lg font-semibold text-blue-600 mb-3">
              Appearance
            </h2>
            <div className="flex items-center gap-4">
              <button className="border border-slate-200  px-4 py-2 text-sm hover:bg-slate-50">
                Light Mode
              </button>
              <button className="border border-slate-200  px-4 py-2 text-sm hover:bg-slate-50">
                Dark Mode
              </button>
              <button className="border border-slate-200  px-4 py-2 text-sm hover:bg-slate-50">
                Amber Theme
              </button>
            </div>
          </div>
        )}

        {activeTab === "privacy" && (
          <div>
            <h2 className="text-lg font-semibold text-blue-600 mb-3">Privacy</h2>
            <p className="text-sm text-gray-600 mb-3">
              Control your data and how it’s used in the system.
            </p>
            <button className="border border-slate-200  px-4 py-2 text-sm hover:bg-slate-50 text-red-600">
              Delete My Account
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
