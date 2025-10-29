import { useEffect, useRef, useState } from "react";
import { Bell, CheckCircle2, Trash2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useNavigate } from "react-router-dom";

const initialNotifications = [
  {
    id: 1,
    title: "New Device Added",
    message: "Device 'Router-23' was registered by Ajay.",
    createdAt: new Date(Date.now() - 1000 * 60 * 10),
    read: false,
  },
  {
    id: 2,
    title: "Vendor Approved",
    message: "Vendor 'Green Supplies' was approved.",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 3),
    read: false,
  },
  
];

export default function NotificationDropdown() {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState(initialNotifications);
  const ref = useRef(null);
  const navigate = useNavigate();
  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAsRead = (id) =>
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );

  const markAllAsRead = () =>
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));

  const clearAll = () => setNotifications([]);

  return (
    <div className="relative" ref={ref}>
      {/* 🔔 Bell Button */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="relative p-2.5  hover:bg-slate-100 transition"
        aria-label="Notifications"
      >
        <Bell
          className={`h-5 w-5 ${
            unreadCount > 0 ? "text-blue-600" : "text-slate-500"
          }`}
        />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 inline-flex items-center justify-center bg-blue-600 px-1.5 py-0.5 text-[10px] font-semibold text-white  shadow-sm">
            {unreadCount}
          </span>
        )}
      </button>

      {/* 🧾 Dropdown Panel */}
      {open && (
        <div className="absolute right-0 mt-2 w-80 max-h-96 overflow-y-auto bg-white  shadow-lg border border-slate-200 z-30">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 sticky top-0 bg-white">
            <h3 className="text-sm font-semibold text-slate-800">
              Notifications
            </h3>
            <div className="flex items-center gap-2">
              {notifications.length > 0 && (
                <>
                  <button
                    onClick={markAllAsRead}
                    className="text-xs flex items-center gap-1 text-slate-500 hover:text-blue-600 transition"
                  >
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    Mark all read
                  </button>
                  <button
                    onClick={clearAll}
                    className="text-xs flex items-center gap-1 text-red-500 hover:text-red-600 transition"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    Clear
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Notification List */}
          <ul className="divide-y divide-slate-100">
            {notifications.length === 0 ? (
              <li className="px-4 py-6 text-center text-sm text-slate-500">
                No notifications
              </li>
            ) : (
              notifications.map((n) => (
                <li
                  key={n.id}
                  className={`px-4 py-3 transition hover:bg-slate-50 ${
                    n.read ? "bg-white" : "bg-gray-100"
                  }`}
                >
                  <div className="flex flex-col gap-1.5">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-slate-800">
                        {n.title}
                      </p>
                      <span className="text-xs text-slate-400 whitespace-nowrap">
                        {formatDistanceToNow(n.createdAt, { addSuffix: true })}
                      </span>
                    </div>

                    <p className="text-sm text-slate-600 leading-snug">
                      {n.message}
                    </p>

                    {!n.read && (
                      <button
                        onClick={() => markAsRead(n.id)}
                        className="self-start mt-1 text-xs text-blue-600 hover:underline"
                      >
                        Mark read
                      </button>
                    )}
                  </div>
                </li>
              ))
            )}
          </ul>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="px-4 py-3 border-t border-slate-100 bg-white sticky bottom-0">
              <button
                onClick={() => {
                  setOpen(false);
                  navigate("/reports");
                  // TODO: navigate("/notifications");
                }}
                className="w-full bg-blue-600 text-white text-sm font-medium py-2  hover:bg-blue-700 transition"
              >
                View all
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
