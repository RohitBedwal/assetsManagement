import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import AddCategoryDrawer from "./AddCategoryDrawer";
import { Plus, Folder } from "lucide-react";

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const api = axios.create({
    baseURL: `${import.meta.env.VITE_BACKEND_URL}/api`,
    headers: { "Content-Type": "application/json" },
  });

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/categories");
      setCategories(data);
    } catch (error) {
      toast.error("Failed to load categories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleAddCategory = async (newCategory) => {
    try {
      await api.post("/categories", newCategory);
      fetchCategories(); // refresh stats
      toast.success("Category added successfully!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create category");
    } finally {
      setDrawerOpen(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-blue-600">Device Categories</h1>
          <p className="text-gray-500 text-sm mt-1">
            Manage your device categories and organize assets by type.
          </p>
        </div>

        <button
          onClick={() => setDrawerOpen(true)}
          className="flex items-center gap-2 bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 transition"
        >
          <Plus className="h-4 w-4" />
          Add Category
        </button>
      </div>

      <div className="bg-white border border-slate-200 shadow-sm overflow-hidden rounded-lg">
        {loading ? (
          <div className="py-10 text-center text-gray-500 text-sm">Loading categories...</div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="text-left px-6 py-3 font-medium text-gray-600 w-[30%]">Category</th>
                <th className="text-left px-6 py-3 font-medium text-gray-600">Description</th>
                <th className="text-left px-6 py-3 font-medium text-gray-600 w-[25%]">Device Stats</th>
              </tr>
            </thead>

            <tbody>
              {categories.length > 0 ? (
                categories.map((cat, index) => (
                  <tr
                    key={cat._id}
                    onClick={() => navigate(`/devices/${cat._id}`)}
                    className={`cursor-pointer transition hover:bg-slate-50 ${
                      index !== categories.length - 1 ? "border-b border-slate-100" : ""
                    }`}
                  >
                    <td className="px-6 py-4 flex items-center gap-2 text-gray-800 font-medium">
                      <Folder className="h-5 w-5 text-blue-600" />
                      {cat.name}
                    </td>

                    <td className="px-6 py-4 text-gray-500 text-sm">
                      {cat.description || "No description"}
                    </td>

                    <td className="px-6 py-4 text-gray-700 text-sm">
                      <div className="flex flex-wrap gap-2">
                        <span className="bg-blue-50 text-blue-600 px-2 py-1 text-xs font-medium rounded">
                          {cat.total ?? 0} Total
                        </span>
                        <span className="bg-amber-50 text-amber-600 px-2 py-1 text-xs font-medium rounded">
                          {cat.outward ?? 0} In Use
                        </span>
                        <span className="bg-green-50 text-green-600 px-2 py-1 text-xs font-medium rounded">
                          {cat.inward ?? 0} Idle
                        </span>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="px-6 py-10 text-center text-gray-500 text-sm">
                    <Folder className="mx-auto h-10 w-10 text-gray-400 mb-2" />
                    No categories found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      <AddCategoryDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onAdd={handleAddCategory}
      />
    </div>
  );
}
