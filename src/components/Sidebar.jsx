import { NavLink } from "react-router-dom";

export default function Sidebar() {
  return (
    <aside className="fixed  left-0 h-full w-64 bg-white border-r border-slate-200 z-10">
      <div className="flex flex-col h-full p-4">
        
        <nav className="flex flex-col gap-2">
          <NavLink to="/" end className="sidebar-link">
            <span className="material-symbols-outlined">dashboard</span>
            
          </NavLink>
          <NavLink to="/devices" className="sidebar-link">
            <span className="material-symbols-outlined">devices</span>
           
          </NavLink>
          <NavLink to="/links" className="sidebar-link">
            <span className="material-symbols-outlined">link</span>
           
          </NavLink>
          <NavLink to="/vendors" className="sidebar-link">
            <span className="material-symbols-outlined">Vendors</span>
            
          </NavLink>
          <NavLink to="/reports" className="sidebar-link">
            <span className="material-symbols-outlined">reports</span>
            
          </NavLink>
          <NavLink to="/settings" className="sidebar-link">
            <span className="material-symbols-outlined">settings</span>
           
          </NavLink>
        </nav>
        <div className="mt-auto">
          <div className="p-4 bg-slate-50 rounded-lg text-center">
            <h3 className="font-semibold text-slate-800">Need Help?</h3>
            <p className="text-sm text-slate-600 mt-1 mb-3">
              Contact our support team for any questions.
            </p>
            <button className="bg-[var(--primary-color)] text-white text-sm font-semibold py-2 px-4 rounded-lg w-full">
              Contact Support
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}
