import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Edit, Trash2, Download } from "lucide-react";
import AddVendorDrawer from "./AddVendors/index";

const API_URL = `${import.meta.env.VITE_BACKEND_URL}/api/vendors`; // ⬅ ENV used here

export default function Vendors() {
  const [vendors, setVendors] = useState([]);
  const [query, setQuery] = useState("");
  const [sortAsc, setSortAsc] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [loading, setLoading] = useState(false);
  const itemsPerPage = 5;

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

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return q
      ? vendors.filter(
          (v) =>
            v.vendor?.toLowerCase().includes(q) ||
            v.contact?.toLowerCase().includes(q) ||
            v.email?.toLowerCase().includes(q) ||
            v.phone?.toLowerCase().includes(q)
        )
      : vendors;
  }, [vendors, query]);

  const handleSort = () => {
    const sorted = [...vendors].sort((a, b) =>
      sortAsc
        ? a.vendor.localeCompare(b.vendor)
        : b.vendor.localeCompare(a.vendor)
    );
    setVendors(sorted);
    setSortAsc((s) => !s);
    setCurrentPage(1);
  };

  const totalPages = Math.max(1, Math.ceil(filtered.length / itemsPerPage));
  const startIndex = (currentPage - 1) * itemsPerPage;
  const pageVendors = filtered.slice(startIndex, startIndex + itemsPerPage);

  const handleDelete = async (id) => {
    if (!confirm("Delete this vendor?")) return;
    try {
      await axios.delete(`${API_URL}/${id}`);
      setVendors((prev) => prev.filter((v) => v._id !== id));
    } catch (error) {
      console.error("Error deleting vendor:", error);
    }
  };

  const handleEdit = (vendor) => {
    setSelectedVendor(vendor);
    setOpenDrawer(true);
  };

  const handleSaveVendor = async (form) => {
    setLoading(true);
    try {
      let res;
      if (selectedVendor) {
        res = await axios.put(
          `${API_URL}/${selectedVendor._id}`,
          form
        );
        setVendors((prev) =>
          prev.map((v) =>
            v._id === selectedVendor._id ? res.data : v
          )
        );
      } else {
        res = await axios.post(API_URL, form);
        setVendors((prev) => [res.data, ...prev]);
      }

      setCurrentPage(1);
      setSelectedVendor(null);
      setOpenDrawer(false);
    } catch (error) {
      console.error("Error saving vendor:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadCSV = () => {
    const csvData = [
      ["Vendor", "Contact", "Email", "Phone", "Status"],
      ...filtered.map((v) => [
        v.vendor,
        v.contact,
        v.email,
        v.phone,
        v.status,
      ]),
    ];

    const csvContent = csvData.map((r) => r.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `vendors_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
  };

  return (
    <div className="space-y-6">
      {/* ...rest UI unchanged ... */}

      <AddVendorDrawer
        open={openDrawer}
        onClose={() => {
          setOpenDrawer(false);
          setSelectedVendor(null);
        }}
        loading={loading}
        onAdd={handleSaveVendor}
        editData={selectedVendor}
      />
    </div>
  );
}
