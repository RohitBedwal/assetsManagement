import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { User, Search, LogOut, UserCircle, Shield, HardDrive } from "lucide-react";
import NotificationDropdown from "./NotificationDropdown";
import { useUser } from "../context/UserContext";
import axios from "axios";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const menuRef = useRef(null);
  const searchRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout, isAdmin } = useUser();

  const api = axios.create({
    baseURL: `${import.meta.env.VITE_BACKEND_URL}/api`,
    headers: { "Content-Type": "application/json" },
  });

  // Handle outside click for dropdown
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSearchDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Debounced search function
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchQuery.trim().length >= 2) {
        searchDevices();
      } else {
        setSearchResults([]);
        setShowSearchDropdown(false);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  const searchDevices = async () => {
    if (!searchQuery.trim()) return;
    
    setSearchLoading(true);
    try {
      // Get all devices and filter on frontend
      const { data } = await api.get('/devices');
      const query = searchQuery.toLowerCase();
      
      const filtered = data.filter(device => 
        device.sku?.toLowerCase().includes(query) ||
        device.serial?.toLowerCase().includes(query) ||
        device.invoiceNumber?.toLowerCase().includes(query) ||
        device.purchaseOrderNumber?.toLowerCase().includes(query) ||
        device.projectName?.toLowerCase().includes(query)
      );
      
      setSearchResults(filtered.slice(0, 8)); // Limit to 8 results
      setShowSearchDropdown(true);
    } catch (error) {
      console.error("Search error:", error);
      setSearchResults([]);
    } finally {
      setSearchLoading(false);
    }
  };

  const handleSearchInputChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleDeviceClick = (deviceId) => {
    setSearchQuery("");
    setShowSearchDropdown(false);
    navigate(`/devices/info/${deviceId}`);
  };

  const handleSearchFocus = () => {
    if (searchQuery.trim().length >= 2 && searchResults.length > 0) {
      setShowSearchDropdown(true);
    }
  };

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
    navigate("/login");
  };

  const handleProfile = () => {
    setMenuOpen(false);
    navigate("/settings");
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
    if (path === '/oem') return 'OEM Management';
    if (path === '/settings') return 'Settings';
    if (path === '/profile') return 'User Profile';
    if (path.startsWith('/rma')) {
      if (path === '/rma/submit') return 'Submit RMA Request';
      if (path === '/rma/list') return 'My RMA Requests';
      if (path === '/rma/admin') return 'RMA Administration';
      return 'RMA Management';
    }
    return 'Dashboard Overview';
  };

  // Get user display name
  const getUserDisplayName = () => {
    if (!user) return 'User';
    return user.name || user.username || user.email?.split('@')[0] || 'User';
  };

  // Get user email
  const getUserEmail = () => {
    if (!user) return 'user@example.com';
    return user.email || 'user@example.com';
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
          {/* Search Bar */}
          <div className="relative" ref={searchRef}>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearchInputChange}
                onFocus={handleSearchFocus}
                placeholder="Search devices (SKU, Serial, Invoice...)"
                className="w-80 pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
              {searchLoading && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-500 border-t-transparent"></div>
                </div>
              )}
            </div>

            {/* Search Results Dropdown */}
            {showSearchDropdown && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-xl border border-gray-200 max-h-80 overflow-y-auto z-50">
                {searchResults.length > 0 ? (
                  <>
                    <div className="px-3 py-2 border-b border-gray-100 bg-gray-50">
                      <p className="text-xs text-gray-500 font-medium">
                        Found {searchResults.length} device{searchResults.length !== 1 ? 's' : ''}
                      </p>
                    </div>
                    {searchResults.map((device) => (
                      <button
                        key={device._id}
                        onClick={() => handleDeviceClick(device._id)}
                        className="w-full px-3 py-3 text-left hover:bg-gray-50 border-b border-gray-100 last:border-b-0 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                            <HardDrive className="h-4 w-4 text-blue-600" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <p className="text-sm font-medium text-gray-900 truncate">
                                {device.sku}
                              </p>
                              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                                device.status === 'outward' 
                                  ? 'bg-blue-100 text-blue-700' 
                                  : 'bg-green-100 text-green-700'
                              }`}>
                                {device.status === 'outward' ? 'Outward' : 'Inward'}
                              </span>
                            </div>
                            <div className="text-xs text-gray-500 space-y-0.5">
                              <p>Serial: {device.serial}</p>
                              {device.invoiceNumber && (
                                <p>Invoice: {device.invoiceNumber}</p>
                              )}
                              {device.projectName && (
                                <p>Project: {device.projectName}</p>
                              )}
                            </div>
                          </div>
                        </div>
                      </button>
                    ))}
                  </>
                ) : searchQuery.length >= 2 && !searchLoading ? (
                  <div className="px-4 py-8 text-center">
                    <Search className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                    <p className="text-sm text-gray-500">No devices found</p>
                    <p className="text-xs text-gray-400 mt-1">Try searching by SKU, serial number, or invoice</p>
                  </div>
                ) : null}
              </div>
            )}
          </div>

          {/* Notifications */}
          <NotificationDropdown />

          {/* Profile Avatar */}
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="w-10 h-10 rounded-full bg-blue-100 overflow-hidden border-2 border-white shadow-sm">
                <img 
                  src={user?.avatar || `https://ui-avatars.com/api/?name=${getUserDisplayName()}&background=3B82F6&color=fff`} 
                  alt="User" 
                  className="w-full h-full object-cover" 
                />
              </div>
              <div className="hidden md:block text-left">
                <p className="text-sm font-medium text-gray-700">{getUserDisplayName()}</p>
                <div className="flex items-center gap-1">
                  {isAdmin() ? (
                    <>
                      <Shield className="h-3 w-3 text-red-500" />
                      <span className="text-xs text-red-600 font-medium">Admin</span>
                    </>
                  ) : (
                    <>
                      <User className="h-3 w-3 text-green-500" />
                      <span className="text-xs text-green-600 font-medium">User</span>
                    </>
                  )}
                </div>
              </div>
            </button>

            {/* Dropdown Menu */}
            {menuOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-gray-200 py-2 animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="px-4 py-3 border-b border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-blue-100 overflow-hidden">
                      <img 
                        src={user?.avatar || `https://ui-avatars.com/api/?name=${getUserDisplayName()}&background=3B82F6&color=fff`} 
                        alt="User" 
                        className="w-full h-full object-cover" 
                      />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{getUserDisplayName()}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{getUserEmail()}</p>
                      <div className="flex items-center gap-1 mt-1">
                        {isAdmin() ? (
                          <>
                            <Shield className="h-3 w-3 text-red-500" />
                            <span className="text-xs text-red-600 font-medium px-1.5 py-0.5 bg-red-50 rounded-full">
                              Administrator
                            </span>
                          </>
                        ) : (
                          <>
                            <User className="h-3 w-3 text-green-500" />
                            <span className="text-xs text-green-600 font-medium px-1.5 py-0.5 bg-green-50 rounded-full">
                              User
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
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
