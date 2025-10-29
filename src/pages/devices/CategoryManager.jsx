// src/pages/Devices/CategoryManager.jsx
import React, { useState } from "react";

export default function CategoryManager({ categories, setCategories }) {
  const [newCategory, setNewCategory] = useState("");

  const handleAdd = () => {
    if (!newCategory.trim()) return;
    if (!categories.includes(newCategory.trim())) {
      setCategories((prev) => [...prev, newCategory.trim()]);
      setNewCategory("");
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-lg shadow-sm p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Manage Categories</h3>

      <div className="flex items-center gap-2 mb-4">
        <input
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
          placeholder="New category name..."
          className="flex-1  border border-slate-200 px-3 py-2 text-sm"
        />
        <button
          onClick={handleAdd}
          className=" bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
        >
          Add
        </button>
      </div>

      {categories.length === 0 ? (
        <p className="text-sm text-gray-500">No categories yet.</p>
      ) : (
        <ul className="divide-y divide-slate-100">
          {categories.map((c, i) => (
            <li key={i} className="py-2 text-sm text-gray-700">
              {c}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
