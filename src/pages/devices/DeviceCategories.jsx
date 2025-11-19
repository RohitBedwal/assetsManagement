import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import AddCategoryDrawer from "./AddCategoryDrawer";
import { Plus, Folder } from "lucide-react";
import { url } from "../../context/config";

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const api = axios.create({
    baseURL: `${url}/api`,
    headers: { "Content-Type": "application/json" },
  });

  // ✅ Fetch all categories
  const fetchCategories = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/categories");
      setCategories(data);
    } catch (error) {
      console.error("Error fetching categories:", error);
      toast.error("Failed to load categories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // ✅ Add new category instantly + toast
  const handleAddCategory = async (newCategory) => {
    try {
      const { data } = await api.post("/categories", {
        name: newCategory.name,
        description: newCategory.description,
      });

      // 🔥 Update UI immediately
      setCategories((prev) => [data, ...prev]);

      // ✅ Show success toast
      toast.success(`Category "${data.name}" added successfully!`);
    } catch (error) {
      const errMsg =
        error.response?.data?.message || "Failed to create category. Try again.";
      console.error("Add Category Error:", errMsg);
      toast.error(errMsg);
    } finally {
      setDrawerOpen(false);
    }
  };

  // Dummy device stats (temporary)
  const getCategoryStats = () => {
    const total = Math.floor(Math.random() * 20) + 5;
    const inUse = Math.floor(total * 0.6);
    const notInUse = total - inUse;
    return { total, inUse, notInUse };
  };

  return (
    <div className="space-y-6">
      {/* Header */}
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

      {/* Category List */}
      <div className="bg-white border border-slate-200 shadow-sm overflow-hidden rounded-lg">
        {loading ? (
          <div className="py-10 text-center text-gray-500 text-sm">Loading categories...</div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="text-left px-6 py-3 font-medium text-gray-600 w-[30%]">
                  Category
                </th>
                <th className="text-left px-6 py-3 font-medium text-gray-600">Description</th>
                <th className="text-left px-6 py-3 font-medium text-gray-600 w-[25%]">
                  Device Stats
                </th>
              </tr>
            </thead>

            <tbody>
              {categories.length > 0 ? (
                categories.map((cat, index) => {
                  const { total, inUse, notInUse } = getCategoryStats(cat._id);
                  return (
                    <tr
                      key={cat._id}
                      onClick={() => navigate(`/devices/${cat._id}`)}
                      className={`cursor-pointer transition hover:bg-slate-50 ${
                        index !== categories.length - 1
                          ? "border-b border-slate-100"
                          : ""
                      }`}
                    >
                      <td className="px-6 py-4 flex items-center gap-2 text-gray-800 font-medium">
                        <Folder className="h-5 w-5 text-blue-600" />
                        <span className="hover:text-blue-700 transition">{cat.name}</span>
                      </td>
                      <td className="px-6 py-4 text-gray-500 text-sm">
                        {cat.description || "No description"}
                      </td>
                      <td className="px-6 py-4 text-gray-700 text-sm">
                        <div className="flex flex-wrap gap-2">
                          <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-600 px-2 py-1 text-xs font-medium">
                            {total} Total
                          </span>
                          <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-600 px-2 py-1 text-xs font-medium">
                            {inUse} In Use
                          </span>
                          <span className="inline-flex items-center gap-1 bg-green-50 text-green-600 px-2 py-1 text-xs font-medium">
                            {notInUse} Idle
                          </span>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={3} className="px-6 py-10 text-center text-gray-500 text-sm">
                    <Folder className="mx-auto h-10 w-10 text-gray-400 mb-2" />
                    <p>No categories found.</p>
                    <button
                      onClick={() => setDrawerOpen(true)}
                      className="mt-3 text-blue-600 text-sm hover:underline"
                    >
                      Add your first category
                    </button>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Drawer for Adding Category */}
      <AddCategoryDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onAdd={handleAddCategory}
      />
    </div>
  );
}
