import { useEffect, useRef, useState } from "react";
import { Bell, CheckCircle2, Trash2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useNavigate } from "react-router-dom";
import { useNotifications } from "../context/NotificationContext";

export default function NotificationDropdown() {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const navigate = useNavigate();
  const { notifications, markAsRead, markAllAsRead, clearAll, unreadCount } = useNotifications();
  
  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div className="relative" ref={ref}>
      {/* 🔔 Bell Button */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="relative p-2.5 rounded-full hover:bg-gradient-to-br hover:from-blue-50 hover:to-indigo-50 transition-all duration-300 group"
        aria-label="Notifications"
      >
        <Bell
          className={`h-5 w-5 transition-all duration-300 ${
            unreadCount > 0 
              ? "text-blue-600 animate-pulse" 
              : "text-slate-500 group-hover:text-blue-600"
          }`}
        />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 inline-flex items-center justify-center bg-gradient-to-br from-blue-500 to-blue-600 px-1.5 py-0.5 text-[10px] font-bold text-white rounded-full shadow-lg shadow-blue-500/50 animate-bounce">
            {unreadCount}
          </span>
        )}
      </button>

      {/* 🧾 Dropdown Panel */}
      {open && (
        <div className="absolute right-0 mt-3 w-96 max-h-[32rem] bg-white rounded-xl shadow-2xl border border-slate-200 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-xl">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-blue-600 rounded-lg">
                <Bell className="h-4 w-4 text-white" />
              </div>
              <h3 className="text-base font-bold text-slate-800">
                Notifications
              </h3>
              {unreadCount > 0 && (
                <span className="px-2 py-0.5 bg-blue-600 text-white text-xs font-semibold rounded-full">
                  {unreadCount} new
                </span>
              )}
            </div>
            <div className="flex items-center gap-1">
              {notifications.length > 0 && (
                <>
                  <button
                    onClick={markAllAsRead}
                    className="p-2 rounded-lg text-slate-600 hover:bg-white hover:text-blue-600 transition-all duration-200 group"
                    title="Mark all as read"
                  >
                    <CheckCircle2 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={clearAll}
                    className="p-2 rounded-lg text-slate-600 hover:bg-white hover:text-red-600 transition-all duration-200"
                    title="Clear all"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Notification List */}
          <div className="overflow-y-auto max-h-96">
            {notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 px-4">
                <div className="w-16 h-16 bg-gradient-to-br from-slate-100 to-slate-200 rounded-full flex items-center justify-center mb-4">
                  <Bell className="h-8 w-8 text-slate-400" />
                </div>
                <p className="text-sm font-medium text-slate-600">No notifications yet</p>
                <p className="text-xs text-slate-400 mt-1">You're all caught up!</p>
              </div>
            ) : (
              <ul className="divide-y divide-slate-100">
                {notifications.map((n) => (
                  <li
                    key={n.id}
                    className={`px-5 py-4 transition-all duration-200 hover:bg-gradient-to-r hover:from-blue-50 hover:to-transparent cursor-pointer ${
                      n.read ? "bg-white opacity-70" : "bg-gradient-to-r from-blue-50/50 to-transparent"
                    }`}
                  >
                    <div className="flex gap-3">
                      {/* Indicator Dot */}
                      <div className="flex-shrink-0 mt-1">
                        {!n.read ? (
                          <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse shadow-lg shadow-blue-500/50"></div>
                        ) : (
                          <div className="w-2 h-2 bg-slate-300 rounded-full"></div>
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <p className={`text-sm font-semibold ${n.read ? "text-slate-600" : "text-slate-900"}`}>
                            {n.title}
                          </p>
                          <span className="text-xs text-slate-400 whitespace-nowrap">
                            {formatDistanceToNow(new Date(n.createdAt), { addSuffix: true })}
                          </span>
                        </div>

                        <p className={`text-sm leading-relaxed ${n.read ? "text-slate-500" : "text-slate-700"}`}>
                          {n.message}
                        </p>

                        {!n.read && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              markAsRead(n.id);
                            }}
                            className="mt-2 text-xs font-medium text-blue-600 hover:text-blue-700 hover:underline transition-all"
                          >
                            Mark as read
                          </button>
                        )}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="px-5 py-3 border-t border-slate-100 bg-slate-50 rounded-b-xl">
              <button
                onClick={() => {
                  setOpen(false);
                  navigate("/reports");
                }}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-semibold py-2.5 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50"
              >
                View All Notifications
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
