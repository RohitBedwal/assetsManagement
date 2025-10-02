// src/pages/Reports.jsx
import React, { useMemo, useState } from "react";

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

  // Filter
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

  // Sort toggle (by name)
  const handleSort = () => {
    const sorted = [...reports].sort((a, b) =>
      sortAsc ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name)
    );
    setReports(sorted);
    setSortAsc((s) => !s);
    setCurrentPage(1);
  };

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filtered.length / itemsPerPage));
  const startIndex = (currentPage - 1) * itemsPerPage;
  const pageReports = filtered.slice(startIndex, startIndex + itemsPerPage);

  const handlePrev = () => setCurrentPage((p) => Math.max(1, p - 1));
  const handleNext = () => setCurrentPage((p) => Math.min(totalPages, p + 1));

  // Export CSV (simple client-side)
  const handleExport = () => {
    const headers = ["Report Name", "Description", "Created At", "Status"];
    const rows = filtered.map((r) => [r.name, r.desc, r.date, r.status]);
    const csvContent = [headers, ...rows].map((e) => e.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "reports.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleReset = () => {
    setReports(initialReports);
    setQuery("");
    setCurrentPage(1);
    setSortAsc(true);
  };

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-poppins font-bold text-[var(--text-primary)]">Reports</h1>
          <p className="mt-1 text-sm text-[var(--text-secondary)]">
            Generate and export reports on your assets and their performance.
          </p>
        </div>
      </div>

      {/* Controls */}
      <div className="mt-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="relative flex-1 md:max-w-xs">
          <input
            type="text"
            placeholder="Search reports..."
            value={query}
            onChange={(e) => { setQuery(e.target.value); setCurrentPage(1); }}
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-[var(--text-primary)] placeholder:text-slate-400 focus:border-[var(--primary-color)] focus:ring-1 focus:ring-[var(--primary-color)]"
          />
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleSort}
            className="flex items-center gap-2 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
          >
            Sort {sortAsc ? "A → Z" : "Z → A"}
          </button>

          <button
            className="flex items-center gap-2 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
            onClick={() => alert("Filter placeholder — implement filter modal")}
          >
            Filter
          </button>

          <button
            className="flex items-center gap-2 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
            onClick={() => alert("Date picker placeholder")}
          >
            Date
          </button>

          <button
            onClick={handleExport}
            className="flex items-center gap-2 rounded-md bg-[var(--primary-color)] px-4 py-2 text-sm font-semibold text-white shadow-sm hover:opacity-95"
          >
            Export
          </button>

          <button
            onClick={handleReset}
            className="hidden md:inline-flex items-center gap-2 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
          >
            Reset
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="mt-6 overflow-hidden rounded-lg bg-white border border-slate-100">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-slate-500 uppercase">
              <tr className="font-semibold">
                <th className="px-6 py-3 text-left">Report Name</th>
                <th className="px-6 py-3 text-left">Description</th>
                <th className="px-6 py-3 text-left">Created At</th>
                <th className="px-6 py-3 text-left">Status</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-200">
              {pageReports.map((r) => (
                <tr key={r.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4 font-medium text-[var(--text-primary)]">{r.name}</td>
                  <td className="px-6 py-4 max-w-xs truncate text-[var(--text-secondary)]">{r.desc}</td>
                  <td className="px-6 py-4 text-[var(--text-secondary)]">{r.date}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        r.status === "Completed" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {r.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-[var(--primary-color)] hover:underline text-sm">View</button>
                  </td>
                </tr>
              ))}

              {pageReports.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-sm text-slate-500">
                    No reports found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-4 border-t border-slate-100 flex items-center justify-between">
          <div className="text-sm text-slate-600">
            Page {currentPage} of {totalPages}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrev}
              disabled={currentPage === 1}
              className="px-3 py-1.5 text-sm rounded-md border border-slate-300 bg-white hover:bg-slate-50 disabled:opacity-50"
            >
              Previous
            </button>

            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`px-3 py-1.5 text-sm rounded-md ${currentPage === i + 1 ? "bg-[var(--primary-color)] text-white" : "bg-white text-slate-600 border border-slate-300 hover:bg-slate-50"}`}
              >
                {i + 1}
              </button>
            ))}

            <button
              onClick={handleNext}
              disabled={currentPage === totalPages}
              className="px-3 py-1.5 text-sm rounded-md border border-slate-300 bg-white hover:bg-slate-50 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
