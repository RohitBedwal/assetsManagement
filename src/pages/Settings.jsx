import React, { useState } from "react";
import { User, Lock, Bell, Palette, Shield } from "lucide-react";

export default function Settings() {
  const [activeTab, setActiveTab] = useState("account");

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
      <div className="bg-white border border-slate-200 shadow-sm p-6">
        {activeTab === "account" && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-blue-600 mb-2">
              Account Settings
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-600">Full Name</label>
                <input
                  type="text"
                  defaultValue="Rohit Bedwal"
                  className="mt-1 w-full border border-slate-200  px-3 py-2 text-sm focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="text-sm text-gray-600">Email</label>
                <input
                  type="email"
                  defaultValue="rohit@example.com"
                  className="mt-1 w-full border border-slate-200  px-3 py-2 text-sm focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="text-sm text-gray-600">Phone Number</label>
                <input
                  type="text"
                  defaultValue="+91 9876543210"
                  className="mt-1 w-full border border-slate-200  px-3 py-2 text-sm focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="text-sm text-gray-600">Role</label>
                <input
                  type="text"
                  value="Admin"
                  disabled
                  className="mt-1 w-full border border-slate-100 bg-gray-50  px-3 py-2 text-sm text-gray-500 cursor-not-allowed"
                />
              </div>
            </div>
            <button className="mt-4 px-4 py-2 bg-blue-600 text-white text-sm font-semibold  hover:bg-blue-700 transition">
              Save Changes
            </button>
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
