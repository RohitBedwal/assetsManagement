import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import AddCategoryDrawer from "./AddCategoryDrawer";
import { Plus, Folder } from "lucide-react";
import { useNotifications } from "../../../context/NotificationContext";

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { addNotification } = useNotifications();

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
      // Add notification
      addNotification(
        "New Category Added",
        `Category "${newCategory.name}" has been created successfully.`
      );
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create category");
    } finally {
      setDrawerOpen(false);
    }
  };

  return (
    <div className="space-y-8">
      
      {/* Categories Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p className="text-sm text-gray-500 mt-2">Loading categories...</p>
            </div>
          </div>
        ) : (
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-gray-800">All Categories</h3>
               <button
          onClick={() => setDrawerOpen(true)}
          className="mt-4 sm:mt-0 flex items-center gap-2 bg-blue-600 px-4 py-2 rounded-lg text-sm font-semibold text-white hover:bg-blue-700 transition-colors shadow-sm"
        >
          <Plus className="h-4 w-4" />
          Add Category
        </button>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="text-xs text-gray-400 border-b border-gray-100">
                    <th className="pb-3 font-medium">Category</th>
                    <th className="pb-3 font-medium">Description</th>
                    <th className="pb-3 font-medium">Device Stats</th>
                  </tr>
                </thead>

                <tbody className="text-sm">
              {categories.length > 0 ? (
                categories.map((cat) => (
                  <tr
                    key={cat._id}
                    onClick={() => navigate(`/devices/${cat._id}`)}
                    className="group cursor-pointer transition-colors hover:bg-gray-50"
                  >
                    <td className="py-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-50 rounded-lg">
                          <Folder className="h-5 w-5 text-blue-600" />
                        </div>
                        <span className="text-sm font-medium text-gray-900">{cat.name}</span>
                      </div>
                    </td>

                    <td className="py-4">
                      <span className="text-sm text-gray-600">
                        {cat.description || "No description"}
                      </span>
                    </td>

                    <td className="py-4">
                      <div className="flex items-center gap-4">
                        <div>
                          <div className="text-sm font-semibold text-gray-900">{cat.total ?? 0}</div>
                          <div className="text-xs text-gray-500">Total</div>
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-amber-600">{cat.outward ?? 0}</div>
                          <div className="text-xs text-gray-500">In Use</div>
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-green-600">{cat.inward ?? 0}</div>
                          <div className="text-xs text-gray-500">Idle</div>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="px-6 py-12">
                    <div className="text-center">
                      <Folder className="mx-auto h-12 w-12 text-gray-300 mb-3" />
                      <h3 className="text-base font-medium text-gray-700 mb-2">No categories yet</h3>
                      <p className="text-sm text-gray-500 mb-4">Get started by creating your first device category</p>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setDrawerOpen(true);
                        }}
                        className="inline-flex items-center gap-2 bg-blue-600 px-4 py-2 rounded-lg text-sm font-semibold text-white hover:bg-blue-700 transition-colors"
                      >
                        <Plus className="h-4 w-4" />
                        Add Category
                      </button>
                    </div>
                  </td>
                </tr>
              )}
                </tbody>
              </table>
            </div>
          </div>
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
