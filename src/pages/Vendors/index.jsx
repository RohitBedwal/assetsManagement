import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Edit, Trash2, Download } from "lucide-react";
import AddVendorDrawer from "./AddVendors/index"; // Drawer component
import { useNotifications } from "../../context/NotificationContext";

const API_URL = `${import.meta.env.VITE_BACKEND_URL}/api/vendors`;

export default function Vendors() {
  const [vendors, setVendors] = useState([]);
  const [query, setQuery] = useState("");
  const [sortAsc, setSortAsc] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState(null); // ✅ for editing
  const [loading, setLoading] = useState(false);
  const itemsPerPage = 5;
  const { addNotification } = useNotifications();

  // ✅ Fetch vendors from backend
  useEffect(() => {
    fetchVendors();
  }, []);

  const fetchVendors = async () => {
    try {
      const { data } = await axios.get(API_URL);
      setVendors(data);
    } catch (error) {
      console.error("Error fetching vendors:", error);
    }
  };

  // 🔍 Filter vendors
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return vendors;
    return vendors.filter(
      (v) =>
        v.vendor?.toLowerCase().includes(q) ||
        v.contact?.toLowerCase().includes(q) ||
        v.email?.toLowerCase().includes(q) ||
        v.phone?.toLowerCase().includes(q)
    );
  }, [vendors, query]);

  // 🔢 Sorting
  const handleSort = () => {
    const sorted = [...vendors].sort((a, b) =>
      sortAsc ? a.vendor.localeCompare(b.vendor) : b.vendor.localeCompare(a.vendor)
    );
    setVendors(sorted);
    setSortAsc((s) => !s);
    setCurrentPage(1);
  };

  // 📄 Pagination
  const totalPages = Math.max(1, Math.ceil(filtered.length / itemsPerPage));
  const startIndex = (currentPage - 1) * itemsPerPage;
  const pageVendors = filtered.slice(startIndex, startIndex + itemsPerPage);

  const handlePrev = () => setCurrentPage((p) => Math.max(1, p - 1));
  const handleNext = () => setCurrentPage((p) => Math.min(totalPages, p + 1));

  // 🗑️ Delete vendor
  const handleDelete = async (id) => {
    if (!confirm("Delete this vendor?")) return;
    try {
      await axios.delete(`${API_URL}/${id}`);
      setVendors((prev) => prev.filter((v) => v._id !== id));
    } catch (error) {
      console.error("Error deleting vendor:", error);
    }
  };

  // ✏️ Edit vendor — open drawer with vendor data
  const handleEdit = (vendor) => {
    setSelectedVendor(vendor);
    setOpenDrawer(true);
  };

  // ➕ Add or ✏️ Update Vendor (from Drawer)
  const handleSaveVendor = async (form) => {
    setLoading(true);
    try {
      let data;

      if (selectedVendor) {
        // ✅ Update existing vendor
        const res = await axios.put(`${API_URL}/${selectedVendor._id}`, form);
        data = res.data;
        setVendors((prev) =>
          prev.map((v) => (v._id === selectedVendor._id ? data : v))
        );
        // Add notification for update
        addNotification(
          "Vendor Updated",
          `Vendor "${data.vendor}" has been updated successfully.`
        );
      } else {
        // ✅ Add new vendor
        const res = await axios.post(API_URL, form);
        data = res.data;
        setVendors((prev) => [data, ...prev]);
        // Add notification for new vendor
        addNotification(
          "New Vendor Added",
          `Vendor "${data.vendor}" (Contact: ${data.contact}) has been added successfully.`
        );
      }

      setOpenDrawer(false);
      setSelectedVendor(null);
      setCurrentPage(1);
    } catch (error) {
      console.error("Error saving vendor:", error);
    } finally {
      setLoading(false);
    }
  };

  // 📥 Download CSV
  const handleDownloadCSV = () => {
    const csvRows = [
      ["Vendor", "Contact", "Email", "Phone", "Status"],
      ...filtered.map((v) => [v.vendor, v.contact, v.email, v.phone, v.status]),
    ];
    const csvContent = csvRows.map((r) => r.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `vendors_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
  };

  return (
    <div className="space-y-6">
      {/* Vendors Table Card */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
          <h3 className="font-bold text-gray-800 text-xl">All Vendors</h3>
          <div className="flex gap-3 items-center flex-wrap">
            <input
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search vendors, contact or email..."
              className="border border-slate-200 px-3 py-2 text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 rounded-lg"
            />

            <button
              onClick={handleSort}
              className="border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded-lg transition"
            >
              Sort {sortAsc ? "A → Z" : "Z → A"}
            </button>

            <button
              onClick={() => {
                fetchVendors();
                setQuery("");
                setCurrentPage(1);
              }}
              className="border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded-lg transition"
            >
              Reset
            </button>

            <button
              onClick={handleDownloadCSV}
              className="flex items-center gap-2 border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-slate-50 rounded-lg transition"
            >
              <Download className="h-4 w-4" />
              Download CSV
            </button>

            <button
              onClick={() => {
                setSelectedVendor(null);
                setOpenDrawer(true);
              }}
              className={`px-6 py-2.5 text-sm font-semibold text-white rounded-lg transition-all ${
                  loading ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700 shadow-sm"
                }`}
            >
              New Vendor
            </button>
          </div>
        </div>
        
        <div className="mb-4 text-sm text-slate-600">
          Showing {Math.min(startIndex + 1, filtered.length)} –{" "}
          {Math.min(startIndex + pageVendors.length, filtered.length)} of {filtered.length}
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-xs text-gray-400 border-b border-gray-100">
                <th className="pb-3 font-medium">Vendor</th>
                <th className="pb-3 font-medium">Contact</th>
                <th className="pb-3 font-medium">Email</th>
                <th className="pb-3 font-medium">Phone</th>
                <th className="pb-3 font-medium text-center">Status</th>
                <th className="pb-3 font-medium text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="text-sm">
            {pageVendors.map((v) => (
              <tr key={v._id} className="border-t border-slate-100 hover:bg-slate-50 transition">
                <td className="px-6 py-3">{v.vendor}</td>
                <td className="px-6 py-3">{v.contact}</td>
                <td className="px-6 py-3">{v.email}</td>
                <td className="px-6 py-3">{v.phone}</td>
                <td className="px-6 py-3 text-center">
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded ${
                      v.status === "Active"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {v.status}
                  </span>
                </td>
                <td className="py-4 text-right">
                  <button
                    onClick={() => handleEdit(v)}
                    className="border border-gray-200 rounded-lg px-3 py-1 text-xs text-gray-500 hover:bg-white transition-colors"
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))}

            {pageVendors.length === 0 && (
              <tr>
                <td colSpan={6} className="py-12 text-center">
                  <div className="text-gray-500 text-sm">No vendors found</div>
                </td>
              </tr>
            )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
          <div className="text-sm text-slate-600">
            Page {currentPage} of {totalPages}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrev}
              disabled={currentPage === 1}
              className="px-3 py-1.5 text-sm border border-slate-300 rounded-lg bg-white hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              Previous
            </button>

            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`px-3 py-1.5 text-sm rounded-lg transition ${
                  currentPage === i + 1
                    ? "bg-blue-600 text-white"
                    : "bg-white text-slate-600 border border-slate-300 hover:bg-slate-50"
                }`}
              >
                {i + 1}
              </button>
            ))}

            <button
              onClick={handleNext}
              disabled={currentPage === totalPages}
              className="px-3 py-1.5 text-sm border border-slate-300 rounded-lg bg-white hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* ✅ Add / Edit Vendor Drawer */}
      <AddVendorDrawer
        open={openDrawer}
        onClose={() => {
          setOpenDrawer(false);
          setSelectedVendor(null);
        }}
        loading={loading}
        onAdd={handleSaveVendor}
        editData={selectedVendor} // ✅ pass current vendor for edit
      />
    </div>
  );
}
