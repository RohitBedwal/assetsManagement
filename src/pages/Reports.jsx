import React, { useMemo, useState } from "react";
import { Download, Filter, Calendar, RefreshCcw } from "lucide-react";

const initialReports = [
  { id: 1, name: "Device Inventory", desc: "A comprehensive list of all devices in the system.", date: "2024-01-15", status: "Completed" },
  { id: 2, name: "Connectivity Status", desc: "Details on the connectivity status of all devices.", date: "2024-01-20", status: "Completed" },
  { id: 3, name: "Vendor Performance", desc: "Reports on vendor performance and device reliability.", date: "2024-02-05", status: "Pending" },
  { id: 4, name: "Security Audit", desc: "Security audit reports for all devices.", date: "2024-02-10", status: "Completed" },
  { id: 5, name: "Compliance Report", desc: "Compliance reports for regulatory requirements.", date: "2024-02-15", status: "Completed" },
  { id: 6, name: "Warranty Summary", desc: "Summary of warranty expiries by month.", date: "2024-03-01", status: "Completed" },
  { id: 7, name: "Assignment Report", desc: "Which users have which devices assigned.", date: "2024-03-10", status: "Pending" },
  { id: 8, name: "Usage Metrics", desc: "Device usage and uptime statistics.", date: "2024-03-18", status: "Completed" },
];

export default function Reports() {
  const [reports, setReports] = useState(initialReports);
  const [query, setQuery] = useState("");
  const [sortAsc, setSortAsc] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // 🔍 Filter
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return reports;
    return reports.filter(
      (r) =>
        r.name.toLowerCase().includes(q) ||
        r.desc.toLowerCase().includes(q) ||
        r.status.toLowerCase().includes(q)
    );
  }, [reports, query]);

  // 🔢 Sort
  const handleSort = () => {
    const sorted = [...reports].sort((a, b) =>
      sortAsc ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name)
    );
    setReports(sorted);
    setSortAsc((s) => !s);
    setCurrentPage(1);
  };

  // 📄 Pagination
  const totalPages = Math.max(1, Math.ceil(filtered.length / itemsPerPage));
  const startIndex = (currentPage - 1) * itemsPerPage;
  const pageReports = filtered.slice(startIndex, startIndex + itemsPerPage);

  const handlePrev = () => setCurrentPage((p) => Math.max(1, p - 1));
  const handleNext = () => setCurrentPage((p) => Math.min(totalPages, p + 1));

  // 📥 Export CSV
  const handleExport = () => {
    const headers = ["Report Name", "Description", "Created At", "Status"];
    const rows = filtered.map((r) => [r.name, r.desc, r.date, r.status]);
    const csvContent = [headers, ...rows]
      .map((e) => e.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(","))
      .join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "reports.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  // 🔄 Reset
  const handleReset = () => {
    setReports(initialReports);
    setQuery("");
    setCurrentPage(1);
    setSortAsc(true);
  };

  return (
    <div className="space-y-6">
      {/* 🧭 Header */}
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-blue-600">Reports</h1>
          <p className="text-gray-500 text-sm mt-1">
            Generate and export reports on your assets and performance.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Search */}
          <input
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search reports..."
            className="border border-slate-200 px-3 py-2 text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
          />

          {/* Export CSV */}
          <button
            onClick={handleExport}
            className="flex items-center gap-2 border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-slate-50 transition"
          >
            <Download className="h-4 w-4" />
            Export
          </button>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <button
            onClick={handleSort}
            className=" border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-50"
          >
            Sort {sortAsc ? "A → Z" : "Z → A"}
          </button>

          <button
            onClick={() => alert("Filter functionality coming soon")}
            className=" border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-1"
          >
            <Filter className="h-4 w-4" />
            Filter
          </button>

          <button
            onClick={() => alert("Date picker coming soon")}
            className=" border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-1"
          >
            <Calendar className="h-4 w-4" />
            Date
          </button>

          <button
            onClick={handleReset}
            className=" border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-1"
          >
            <RefreshCcw className="h-4 w-4" />
            Reset
          </button>
        </div>

        <div className="text-sm text-slate-600">
          Showing {Math.min(startIndex + 1, filtered.length)} –{" "}
          {Math.min(startIndex + pageReports.length, filtered.length)} of {filtered.length}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto border border-slate-200 bg-white shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-3 text-left text-gray-600 font-medium">Report Name</th>
              <th className="px-6 py-3 text-left text-gray-600 font-medium">Description</th>
              <th className="px-6 py-3 text-left text-gray-600 font-medium">Created At</th>
              <th className="px-6 py-3 text-left text-gray-600 font-medium">Status</th>
              <th className="px-6 py-3 text-right text-gray-600 font-medium">Actions</th>
            </tr>
          </thead>

          <tbody>
            {pageReports.map((r) => (
              <tr key={r.id} className="border-t border-slate-100 hover:bg-slate-50 transition">
                <td className="px-6 py-3 font-medium text-gray-800">{r.name}</td>
                <td className="px-6 py-3 text-gray-600">{r.desc}</td>
                <td className="px-6 py-3 text-gray-600">{r.date}</td>
                <td className="px-6 py-3">
                  <span
                    className={`inline-flex items-center px-2 py-1  text-xs font-medium ${
                      r.status === "Completed"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {r.status}
                  </span>
                </td>
                <td className="px-6 py-3 text-right">
                  <button className="text-blue-600 text-sm hover:underline">View</button>
                </td>
              </tr>
            ))}

            {pageReports.length === 0 && (
              <tr>
                <td
                  colSpan={5}
                  className="px-6 py-8 text-center text-sm text-gray-500 italic"
                >
                  No reports found
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
            className="px-3 py-1.5 text-sm  border border-slate-300 bg-white hover:bg-slate-50 disabled:opacity-50"
          >
            Previous
          </button>

          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-3 py-1.5 text-sm  ${
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
            className="px-3 py-1.5 text-sm  border border-slate-300 bg-white hover:bg-slate-50 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
