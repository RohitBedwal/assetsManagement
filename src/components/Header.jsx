import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import NotificationDropdown from "./NotificationDropdown";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    navigate("/login"); // updated to /login
  };

  const handleProfile = () => {
    navigate("/profile"); // create profile page later
  };

  return (
    <header className="sticky top-0 bg-white/80 backdrop-blur-lg z-10 flex items-center justify-between whitespace-nowrap border-b border-solid border-slate-200 px-8 py-4">
      <h2 className="text-2xl font-bold text-[var(--text-primary)] font-poppins">
        SOS Asset Management
      </h2>

      <div className="flex items-center gap-4">
        {/* Search */}
        <div className="relative w-64">
          <input
            type="text"
            placeholder="Search vendors..."
            className="form-input w-full rounded-lg border border-slate-200 bg-slate-100 pl-5 pr-4 py-2.5 text-sm placeholder:text-slate-500 focus:border-[var(--primary-color)] focus:ring-[var(--primary-color)]"
          />
        </div>

        {/* Notifications - replaced with component */}
        <NotificationDropdown />

        {/* Profile Avatar */}
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10 border-2 border-slate-200"
            style={{
              backgroundImage:
                'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBFSL-Nv92zatmB209qdm9U01sHYGCbc9nye2Dri1jYTDL9hhKi5puzk-iEYrWcdnXtRn4eCUwFqKiQLshiCq56g1ZGiy07sMFbIGI5gBVnXsTFkneOJU8dBxVUu8DQL2vWIMAH7Hv7oB0TUkjuDxErn_YqlkPQopvJNNUJ_ErMniSkSl9q2zcOnre8WJl6QTM26LGy-rabEIBQmAACiuZsRbebdoHvhxWwGZVpNW_krp-XRJjwqy3pAi9uak-_rURVe8P0pgqM_Qai")',
            }}
          />

          {/* Dropdown Menu */}
          {menuOpen && (
            <div className="absolute right-0 mt-2 w-40 rounded-lg bg-white shadow-lg border border-slate-200 py-2">
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
