import React, { useState } from "react";
import { Edit3, Mail, Phone, ShieldUser, UserCircle2 } from "lucide-react";

export default function Profile() {
  const [profile] = useState({
    name: "Rohit Sharma",
    email: "rohit.sos@example.com",
    phone: "+91 9876543210",
    role: "Admin",
    avatar:
      "", // replace with real avatar URL
  });

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-blue-600">Profile</h1>
        <p className="text-gray-500 text-sm mt-1">
          View and manage your account details.
        </p>
      </div>

      {/* Profile Card */}
      <div className="bg-white border border-slate-200 shadow-sm  p-6">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
          {/* Avatar */}
          <div className="relative">
            <img
              // src={profile.avatar}
              // alt={profile.name}
              className="w-28 h-28  border-4 border-blue-100 object-cover"
            />
            <button
              className="absolute bottom-1 right-1 bg-blue-600 hover:bg-blue-700 text-white  p-1.5 shadow-md"
              title="Edit Photo"
            >
              <Edit3 className="h-4 w-4" />
            </button>
          </div>

          {/* Details */}
          <div className="flex-1 space-y-4">
            <div>
              <h2 className="text-xl font-semibold text-gray-800">
                {profile.name}
              </h2>
              <p
                className={`inline-flex items-center gap-2 mt-1 text-sm font-medium px-3 py-1  ${
                  profile.role === "Admin"
                    ? "bg-blue-100 text-blue-700"
                    : "bg-amber-100 text-amber-700"
                }`}
              >
                <ShieldUser className="h-4 w-4" />
                {profile.role}
              </p>
            </div>

            {/* Info List */}
            <div className="divide-y divide-slate-100">
              <div className="flex items-center gap-3 py-2">
                <Mail className="h-5 w-5 text-slate-500" />
                <span className="text-gray-700 text-sm">{profile.email}</span>
              </div>
              <div className="flex items-center gap-3 py-2">
                <Phone className="h-5 w-5 text-slate-500" />
                <span className="text-gray-700 text-sm">{profile.phone}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Edit Button */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={() => alert("Edit profile feature coming soon")}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 text-sm font-medium  transition"
          >
            <Edit3 className="h-4 w-4" />
            Edit Profile
          </button>
        </div>
      </div>

      {/* Account Info Section */}
      <div className="bg-slate-50 border border-slate-200  p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">
          Account Overview
        </h3>
        <ul className="text-sm text-gray-600 space-y-2">
          <li>
            <strong>Joined:</strong> January 2024
          </li>
          <li>
            <strong>Last Login:</strong> 2 hours ago
          </li>
          <li>
            <strong>Status:</strong>{" "}
            <span className="text-green-600 font-medium">Active</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
