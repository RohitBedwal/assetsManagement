import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, User } from "lucide-react";
import NotificationDropdown from "./NotificationDropdown";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, message: "New device added", read: false },
    { id: 2, message: "Warranty expiring soon", read: false },
  ]);
  const menuRef = useRef(null);
  const notifRef = useRef(null);
  const navigate = useNavigate();
  const [notifOpen, setNotifOpen] = useState(false);

  // Handle outside click for both dropdowns
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        (menuRef.current && !menuRef.current.contains(event.target)) &&
        (notifRef.current && !notifRef.current.contains(event.target))
      ) {
        setMenuOpen(false);
        setNotifOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    navigate("/login");
  };

  const handleProfile = () => navigate("/profile");

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  return (
    <header className="sticky top-0 bg-white/80 backdrop-blur-lg z-30 flex items-center justify-between whitespace-nowrap border-b border-slate-200 pr-8 pl-3 py-2">
      {/* Logo */}
      <h2 className="text-xl font-bold text-amber-500 flex items-center font-poppins">
        <img src="src/assets/logo.jpg" alt="Logo" className="h-[50px] mr-2" />
        SOS Asset  Management
      </h2>

      <div className="flex w-1/2 items-end justify-end gap-4">
        {/* Search */}
        <div className="relative w-full  hidden md:block">
          <input
            type="text"
            placeholder="Search vendors..."
            className="w-full  border border-slate-200 bg-slate-100 pl-5 pr-4 py-2.5 text-sm placeholder:text-slate-500 focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        {/* Notifications */}
        
          
           <NotificationDropdown />
         
        

        {/* Profile Avatar */}
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200 size-10   transition"
          >
            <User className="h-5 w-5 text-slate-700" />
          </button>

          {/* Dropdown Menu */}
          {menuOpen && (
            <div className="absolute right-0 mt-2 w-40  bg-white shadow-lg border border-slate-200 py-2 animate-fadeIn">
              <button
                onClick={handleProfile}
                className="block w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-100"
              >
                See Profile
              </button>
              <button
                onClick={handleLogout}
                className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-slate-100"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
