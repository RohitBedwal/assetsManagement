import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { User, Search, LogOut, UserCircle } from "lucide-react";
import NotificationDropdown from "./NotificationDropdown";
import { UserCircleIcon } from "@heroicons/react/24/solid";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Handle outside click for dropdown
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    navigate("/login");
  };

  const handleProfile = () => {
    setMenuOpen(false);
    navigate("/profile");
  };

  // Get current date
  const today = new Date().toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  // Get page title based on route
  const getPageTitle = () => {
    const path = location.pathname;
    if (path === '/') return 'Dashboard Overview';
    if (path === '/reports') return 'Reports Overview';
    if (path.startsWith('/devices')) return 'Devices Management';
    if (path === '/links') return 'Connectivity Links';
    if (path === '/vendors') return 'Vendors Management';
    if (path === '/settings') return 'Settings';
    if (path === '/profile') return 'User Profile';
    return 'Dashboard Overview';
  };

  return (
    <header className="sticky top-0 bg-white/50 backdrop-blur-md border-b border-gray-100 z-40">
      <div className="h-20 flex items-center justify-between px-8">
        {/* Left - Title Section */}
        <div>
          <h2 className="text-xl font-bold text-gray-800">{getPageTitle()}</h2>
          <p className="text-xs text-gray-500">Today, {today}</p>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-5">

          {/* Notifications */}
          <NotificationDropdown />

          {/* Profile Avatar */}
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="w-10 h-10 rounded-full bg-blue-100 overflow-hidden border-2 border-white shadow-sm hover:border-blue-200 transition-colors"
            >
              <UserCircleIcon className=" text-gray-400" />

            </button>

            {/* Dropdown Menu */}
            {menuOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-200 py-2 animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="px-4 py-3 border-b border-gray-100">
                  <p className="text-sm font-semibold text-gray-900">Admin User</p>
                  <p className="text-xs text-gray-500 mt-0.5">admin@sosasset.com</p>
                </div>
                <button
                  onClick={handleProfile}
                  className="flex items-center gap-3 w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <UserCircle className="w-4 h-4 text-gray-400" />
                  View Profile
                </button>
                <div className="border-t border-gray-100 mt-1 pt-1">
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors rounded-lg mx-1"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
