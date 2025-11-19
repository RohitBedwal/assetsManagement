import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Edit, Trash2, Download } from "lucide-react";
import AddVendorDrawer from "./AddVendors/index"; // Drawer component
import { url } from "../../context/config";

const API_URL = `${url}/api/vendors`;

export default function Vendors() {
  const [vendors, setVendors] = useState([]);
  const [query, setQuery] = useState("");
  const [sortAsc, setSortAsc] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState(null); // ✅ for editing
  const [loading, setLoading] = useState(false);
  const itemsPerPage = 5;

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
      } else {
        // ✅ Add new vendor
        const res = await axios.post(API_URL, form);
        data = res.data;
        setVendors((prev) => [data, ...prev]);
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
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-blue-600">Vendors</h1>
          <p className="text-gray-500 text-sm mt-1">
            Manage suppliers and vendor contacts for your assets.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <input
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search vendors, contact or email..."
            className="border border-slate-200 px-3 py-2 text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
          />

          <button
            onClick={handleDownloadCSV}
            className="flex items-center gap-2 border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-slate-50 transition"
          >
            <Download className="h-4 w-4" />
            Download CSV
          </button>

          <button
            onClick={() => {
              setSelectedVendor(null);
              setOpenDrawer(true);
            }}
            className="flex items-center gap-2 bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 transition"
          >
            New Vendor
          </button>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={handleSort}
            className="border border-slate-200 bg-white px-3 py-1 text-sm text-slate-700 hover:bg-slate-50"
          >
            Sort {sortAsc ? "A → Z" : "Z → A"}
          </button>
          <button
            onClick={() => {
              fetchVendors();
              setQuery("");
              setCurrentPage(1);
            }}
            className="border border-slate-200 bg-white px-3 py-1 text-sm text-slate-700 hover:bg-slate-50"
          >
            Reset
          </button>
        </div>

        <div className="text-sm text-slate-600">
          Showing {Math.min(startIndex + 1, filtered.length)} –{" "}
          {Math.min(startIndex + pageVendors.length, filtered.length)} of {filtered.length}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto border border-slate-200 bg-white shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-3 text-left text-gray-600 font-medium">Vendor</th>
              <th className="px-6 py-3 text-left text-gray-600 font-medium">Contact</th>
              <th className="px-6 py-3 text-left text-gray-600 font-medium">Email</th>
              <th className="px-6 py-3 text-left text-gray-600 font-medium">Phone</th>
              <th className="px-6 py-3 text-center text-gray-600 font-medium">Status</th>
              <th className="px-6 py-3 text-right text-gray-600 font-medium">Actions</th>
            </tr>
          </thead>

          <tbody>
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
                <td className="px-6 py-3 text-right">
                  <div className="inline-flex items-center gap-2">
                    <button
                      onClick={() => handleEdit(v)}
                      className="p-2 hover:bg-slate-100 text-slate-600"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(v._id)}
                      className="p-2 hover:bg-slate-100 text-red-600"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {pageVendors.length === 0 && (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-sm text-gray-500 italic">
                  No vendors found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="p-4 border-t border-slate-100 flex items-center justify-between bg-white">
        <div className="text-sm text-slate-600">
          Page {currentPage} of {totalPages}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrev}
            disabled={currentPage === 1}
            className="px-3 py-1.5 text-sm border border-slate-300 bg-white hover:bg-slate-50 disabled:opacity-50"
          >
            Previous
          </button>

          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-3 py-1.5 text-sm ${
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
            className="px-3 py-1.5 text-sm border border-slate-300 bg-white hover:bg-slate-50 disabled:opacity-50"
          >
            Next
          </button>
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
