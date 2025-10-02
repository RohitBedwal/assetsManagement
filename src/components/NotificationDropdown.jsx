import { useEffect, useRef, useState } from "react";
import { formatDistanceToNow } from "date-fns"; // optional, nice time formatting (install date-fns) 

// Dummy initial notifications
const initialNotifications = [
  {
    id: 1,
    title: "New device added",
    message: "Device 'Router-23' was registered by Ajay.",
    createdAt: new Date(Date.now() - 1000 * 60 * 10), // 10 mins ago
    read: false,
  },
  {
    id: 2,
    title: "Vendor approved",
    message: "Vendor 'Green Supplies' was approved.",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 3), // 3 hours ago
    read: false,
  },
  {
    id: 3,
    title: "Monthly report ready",
    message: "Your asset usage report is ready to download.",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
    read: true,
  },
];

export default function NotificationDropdown() {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState(initialNotifications);
  const ref = useRef(null);

  // close when clicking outside
  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAsRead = (id) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="relative p-2.5 text-slate-500 rounded-full hover:bg-slate-100"
        aria-label="Notifications"
      >
        <span className="material-symbols-outlined">notifications</span>

        {/* badge */}
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 inline-flex items-center justify-center rounded-full bg-red-600 px-1.5 py-0.5 text-xs font-medium text-white">
            {unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-80 max-h-96 overflow-y-auto rounded-lg bg-white shadow-lg border border-slate-200 py-2">
          <div className="flex items-center justify-between px-4 py-2 border-b border-slate-100">
            <h3 className="text-sm font-semibold text-slate-700">Notifications</h3>
            <div className="flex items-center gap-2">
              <button
                onClick={markAllAsRead}
                className="text-xs text-slate-500 hover:text-slate-700"
              >
                Mark all read
              </button>
              <button onClick={clearAll} className="text-xs text-red-500 hover:text-red-600">
                Clear
              </button>
            </div>
          </div>

          <ul className="divide-y divide-slate-100">
            {notifications.length === 0 && (
              <li className="px-4 py-6 text-center text-sm text-slate-500">No notifications</li>
            )}

            {notifications.map((n) => (
              <li
                key={n.id}
                className={`px-4 py-3 hover:bg-slate-50 ${n.read ? "" : "bg-white"}`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm font-medium text-slate-800">{n.title}</p>
                      <span className="text-xs text-slate-400">
                        {typeof formatDistanceToNow === "function"
                          ? formatDistanceToNow(n.createdAt, { addSuffix: true })
                          : new Date(n.createdAt).toLocaleString()}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-slate-600">{n.message}</p>
                    {!n.read && (
                      <button
                        onClick={() => markAsRead(n.id)}
                        className="mt-2 text-xs text-[var(--primary-color)] hover:underline"
                      >
                        Mark read
                      </button>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>

          <div className="px-4 py-2 border-t border-slate-100">
            <button
              onClick={() => {
                setOpen(false);
                // navigate to notifications page if you have one later
              }}
              className="w-full rounded-md bg-[var(--primary-color)] px-3 py-2 text-sm font-medium text-white hover:opacity-95"
            >
              View all
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
