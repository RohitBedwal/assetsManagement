import React, { useState } from "react";
import { X } from "lucide-react";

export default function AddCategoryDrawer({ open, onClose, onAdd }) {
  const [form, setForm] = useState({ name: "", description: "" });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name.trim()) {
      setError("Category name is required.");
      return;
    }
    onAdd({
      name: form.name.trim(),
      description: form.description.trim() || "No description provided",
    });
    setForm({ name: "", description: "" });
  };

  return (
    <div
      className={`fixed inset-0 z-50 ${
        open ? "pointer-events-auto" : "pointer-events-none"
      }`}
    >
      <div 
        className={`absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${
          open ? "opacity-100" : "opacity-0"
        }`} 
        onClick={onClose} 
      />

      <aside
        className={`absolute right-0 top-0 h-full w-full max-w-lg bg-white shadow-2xl transform transition-transform duration-300 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4 bg-gradient-to-r from-blue-50 to-indigo-50">
          <div>
            <h3 className="text-xl font-bold text-gray-900">Add New Category</h3>
            <p className="text-sm text-gray-600 mt-0.5">Create a new device category</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-200 rounded-lg transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col h-[calc(100%-73px)]">
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {error && (
              <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 px-4 py-3 rounded-lg border border-red-200">
                <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"/>
                </svg>
                {error}
              </div>
            )}

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Category Name <span className="text-red-500">*</span>
              </label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="e.g. Laptops, Cameras, Network Devices"
                autoFocus
              />
              <p className="text-xs text-gray-500">Choose a clear and descriptive name</p>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows={4}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="Brief description of what this category includes..."
              />
              <p className="text-xs text-gray-500">Optional: Add details about this category</p>
            </div>
          </div>

          {/* Footer */}
          <div className="border-t border-gray-200 px-6 py-4 bg-gray-50 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2.5 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 shadow-sm hover:shadow transition-all"
            >
              Create Category
            </button>
          </div>
        </form>
      </aside>
    </div>
  );
}
