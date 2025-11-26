import React, { useEffect, useState } from "react";
import { Download, RefreshCcw } from "lucide-react";
import axios from "axios";

const API_URL = `${import.meta.env.VITE_BACKEND_URL}/api/notifications`;

export default function Reports({ socket, isConnected }) {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchNotifications();

    // Listen for real-time notifications only if socket exists
    if (socket && isConnected) {
      const handleNewNotification = (notification) => {
        setNotifications(prev => [notification, ...prev]);
      };

      socket.on("notification", handleNewNotification);
      socket.on("newNotification", handleNewNotification);

      // Cleanup function
      return () => {
        socket.off("notification", handleNewNotification);
        socket.off("newNotification", handleNewNotification);
      };
    }
  }, [socket, isConnected]);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const res = await axios.get(API_URL, {
        withCredentials: false,
      });
      
      // Handle the response structure from your backend
      const data = res.data;
      if (data. success && Array.isArray(data.data)) {
        setNotifications(data.data);
      } else if (Array.isArray(data)) {
        setNotifications(data);
      } else {
        setNotifications([]);
      }
    } catch (err) {
      console.error("Failed loading notifications:", err. message);
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = () => {
    if (! notifications.length) return;

    const csvRows = [
      ["Message", "Category", "Date"],
      ...notifications.map((n) => [
        `"${n.message. replace(/"/g, '""')}"`, // Escape quotes in CSV
        n.type || "General",
        new Date(n. createdAt).toLocaleString(),
      ]),
    ];

    const csvContent = csvRows.map((r) => r.join(",")).join("\n");
    const blob = new Blob([csvContent], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `notifications_${new Date(). toISOString(). slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Connection Status */}
      <div className="flex items-center gap-2 text-sm">
        <div className={`w-2 h-2 rounded-full ${isConnected ?  'bg-green-500' : 'bg-red-500'}`}></div>
        <span className={isConnected ?  'text-green-600' : 'text-red-600'}>
          {isConnected ? 'Connected' : 'Disconnected'}
        </span>
      </div>

      {/* Header */}
      <div className="flex justify-between items-center flex-wrap gap-3">
        <h1 className="text-2xl font-bold text-blue-600">Notifications</h1>

        <div className="flex gap-2">
          <button
            onClick={handleExport}
            disabled={! notifications.length}
            className="flex items-center gap-2 border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Download className="h-4 w-4" />
            Export CSV ({notifications.length})
          </button>

          <button
            onClick={fetchNotifications}
            disabled={loading}
            className="flex items-center gap-2 border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-slate-50 disabled:opacity-50"
          >
            <RefreshCcw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto border border-slate-200 bg-white shadow-sm rounded-lg">
        <table className="w-full text-sm">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-3 text-left font-medium text-gray-600">Message</th>
              <th className="px-6 py-3 text-left font-medium text-gray-600">Category</th>
              <th className="px-6 py-3 text-left font-medium text-gray-600">Date</th>
              <th className="px-6 py-3 text-left font-medium text-gray-600">Status</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan={4} className="py-10 text-center text-gray-500">
                  <div className="flex items-center justify-center gap-2">
                    <RefreshCcw className="h-4 w-4 animate-spin" />
                    Loading notifications...
                  </div>
                </td>
              </tr>
            ) : notifications.length ? (
              notifications. map((n) => (
                <tr key={n._id} className="border-t hover:bg-slate-50">
                  <td className="px-6 py-3">{n.message}</td>
                  <td className="px-6 py-3">
                    <span className={`inline-block px-2 py-1 rounded text-xs font-medium capitalize ${
                      n.type === 'error' ? 'bg-red-100 text-red-800' :
                      n.type === 'warning' ? 'bg-yellow-100 text-yellow-800' :
                      n.type === 'success' ?  'bg-green-100 text-green-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {n.type || "General"}
                    </span>
                  </td>
                  <td className="px-6 py-3">
                    {new Date(n.createdAt).toLocaleString()}
                  </td>
                  <td className="px-6 py-3">
                    <span className={`inline-block w-2 h-2 rounded-full ${
                      n. isRead ? 'bg-gray-300' : 'bg-blue-500'
                    }`}></span>
                    <span className="ml-2 text-xs text-gray-500">
                      {n.isRead ? 'Read' : 'Unread'}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={4}
                  className="py-10 text-center text-gray-500 italic"
                >
                  No notifications found (last 30 days)
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}