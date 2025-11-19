import React, { useState, useEffect } from "react";

export default function AddVendorDrawer({ open, onClose, onAdd, loading, editData }) {
  const [form, setForm] = useState({
    vendor: "",
    contact: "",
    email: "",
    phone: "",
    status: "Active",
  });
  const [error, setError] = useState("");

  // ✅ Pre-fill form when editing
  useEffect(() => {
    if (editData) {
      setForm({
        vendor: editData.vendor || "",
        contact: editData.contact || "",
        email: editData.email || "",
        phone: editData.phone || "",
        status: editData.status || "Active",
      });
    } else {
      setForm({
        vendor: "",
        contact: "",
        email: "",
        phone: "",
        status: "Active",
      });
    }
    setError("");
  }, [editData, open]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    setError("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.vendor || !form.contact || !form.email || !form.phone) {
      setError("All fields except status are required.");
      return;
    }

    onAdd(form); // parent handles API (add or update)
  };

  const isEdit = !!editData;

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
          <h3 className="text-lg font-semibold text-gray-900">
            {isEdit ? "Edit Vendor" : "Add Vendor"}
          </h3>
          <button onClick={onClose} className="text-slate-600 hover:text-slate-800">
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5 overflow-y-auto h-[calc(100%-64px)]">
          {error && (
            <div className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded">{error}</div>
          )}

          {["vendor", "contact", "email", "phone"].map((field) => (
            <div key={field}>
              <label className="block text-sm text-gray-600 mb-1 capitalize">
                {field === "vendor" ? "Vendor Name" : field === "contact" ? "Contact Person" : field}
              </label>
              <input
                name={field}
                type={field === "email" ? "email" : field === "phone" ? "tel" : "text"}
                value={form[field]}
                onChange={handleChange}
                placeholder={
                  field === "vendor"
                    ? "e.g., BlueTech"
                    : field === "contact"
                    ? "e.g., John Doe"
                    : field === "email"
                    ? "e.g., vendor@example.com"
                    : "e.g., 9876543210"
                }
                className="w-full border border-slate-200 px-3 py-2 text-sm"
                disabled={loading}
              />
            </div>
          ))}

          <div>
            <label className="block text-sm text-gray-600 mb-1">Status</label>
            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              className="w-full border border-slate-200 px-3 py-2 text-sm"
              disabled={loading}
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`px-4 py-2 text-sm font-semibold text-white ${
                loading ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
              }`}
              disabled={loading}
            >
              {loading ? (isEdit ? "Updating..." : "Adding...") : isEdit ? "Update Vendor" : "Add Vendor"}
            </button>
          </div>
        </form>
      </aside>
    </div>
  );
}
