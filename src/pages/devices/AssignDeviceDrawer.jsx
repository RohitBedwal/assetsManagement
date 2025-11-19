import React, { useState } from "react";

export default function AssignDeviceDrawer({ open, onClose, onAssign }) {
  const [form, setForm] = useState({ projectName: "", assignedDate: "" });

  // Auto set assigned date = today when drawer opens
  React.useEffect(() => {
    if (open) {
      const today = new Date().toISOString().split("T")[0];
      setForm({ projectName: "", assignedDate: today });
    }
  }, [open]);

  // Calculate warranty end (default 1 year)
  const getWarrantyEndDate = (assignedDate) => {
    const date = new Date(assignedDate);
    date.setFullYear(date.getFullYear() + 1); // 1-year warranty
    return date.toISOString().split("T")[0];
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.projectName.trim()) return;

    const warrantyEndDate = getWarrantyEndDate(form.assignedDate);

    onAssign({ ...form, warrantyEndDate });
    onClose();
  };

  return (
    <div
      className={`fixed inset-0 z-40 transition-opacity duration-300 ${
        open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
      }`}
    >
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <aside
        className={`absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-xl transform transition-transform duration-300 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <h3 className="text-lg font-semibold text-gray-900">Assign Device</h3>
          <button onClick={onClose} className="text-gray-600 hover:text-gray-800">
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5 overflow-y-auto h-[calc(100%-64px)]">
          <div>
            <label className="block text-sm text-gray-600 mb-1">Project / Employee Name</label>
            <input
              type="text"
              value={form.projectName}
              onChange={(e) => setForm({ ...form, projectName: e.target.value })}
              className="w-full border border-slate-200 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
              placeholder="Enter project name or person"
              required
            />
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">Assigned Date</label>
            <input
              type="date"
              value={form.assignedDate}
              onChange={(e) => setForm({ ...form, assignedDate: e.target.value })}
              className="w-full border border-slate-200 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Preview Warranty End Date */}
          {form.assignedDate && (
            <div className="bg-slate-50 border border-slate-200 p-3 rounded-md">
              <p className="text-sm text-gray-600">
                📅 Warranty will end on:{" "}
                <span className="font-semibold text-blue-600">
                  {getWarrantyEndDate(form.assignedDate)}
                </span>
              </p>
            </div>
          )}

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="border border-slate-200 px-4 py-2 text-sm text-gray-600 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-600 text-white text-sm font-semibold px-4 py-2 hover:bg-blue-700"
            >
              Assign
            </button>
          </div>
        </form>
      </aside>
    </div>
  );
}
