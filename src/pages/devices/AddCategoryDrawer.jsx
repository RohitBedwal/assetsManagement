import React, { useState } from "react";
import { X } from "lucide-react";

export default function AddCategoryDrawer({ open, onClose, onAdd }) {
  const [form, setForm] = useState({
    name: "",
    description: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name.trim()) {
      setError("Category name is required.");
      return;
    }

    const newCategory = {
      id: Date.now(),
      name: form.name.trim(),
      description: form.description.trim() || "No description provided",
    };

    onAdd(newCategory);
    setForm({ name: "", description: "" });
    setError("");
  };

  return (
    <div
      className={`fixed inset-0 z-40 transition-opacity duration-300 ${
        open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
      }`}
    >
      {/* Background overlay */}
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      {/* Drawer */}
      <aside
        className={`absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-xl transform transition-transform duration-300 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <h3 className="text-lg font-semibold text-gray-900">Add New Category</h3>
          <button
            onClick={onClose}
            className=" p-2 text-slate-600 hover:bg-slate-100"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5 overflow-y-auto h-[calc(100%-64px)]">
          {error && <div className="text-sm text-red-600">{error}</div>}

          <div>
            <label className="block text-sm text-gray-600 mb-1">Category Name</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              className="w-full border border-slate-200  px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g. Laptops, Cameras, Network Devices"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={3}
              className="w-full border border-slate-200  px-3 py-2 text-sm resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Brief description of the category"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className=" border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className=" bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
            >
              Create Category
            </button>
          </div>
        </form>
      </aside>
    </div>
  );
}
