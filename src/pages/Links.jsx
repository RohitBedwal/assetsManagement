import React, { useMemo, useState } from "react";
import { format } from "date-fns";
import { Download } from "lucide-react";

const initialLinks = [
  { id: 1, linkType: "Fiber", bandwidth: "1 Gbps", provider: "TechConnect", serviceId: "SVC-12345", expiryDate: "2025-12-31", monthlyCost: 150 },
  { id: 2, linkType: "Ethernet", bandwidth: "100 Mbps", provider: "NetSolutions", serviceId: "SVC-67890", expiryDate: "2024-06-30", monthlyCost: 80 },
  { id: 3, linkType: "Wireless", bandwidth: "50 Mbps", provider: "SkyNet", serviceId: "SVC-11223", expiryDate: "2023-11-15", monthlyCost: 50 },
  { id: 4, linkType: "DSL", bandwidth: "20 Mbps", provider: "GlobalCom", serviceId: "SVC-44556", expiryDate: "2024-03-20", monthlyCost: 30 },
  { id: 5, linkType: "Satellite", bandwidth: "10 Mbps", provider: "StarLink", serviceId: "SVC-77889", expiryDate: "2025-09-01", monthlyCost: 200 },
];

export default function Links() {
  const [links, setLinks] = useState(initialLinks);
  const [query, setQuery] = useState("");

  // 🔍 Filtered links
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return links;
    return links.filter(
      (l) =>
        l.linkType.toLowerCase().includes(q) ||
        l.provider.toLowerCase().includes(q) ||
        l.serviceId.toLowerCase().includes(q) ||
        l.bandwidth.toLowerCase().includes(q)
    );
  }, [links, query]);

  // ➕ Add new link
  const handleAdd = () => {
    const nextId = links.length ? Math.max(...links.map((l) => l.id)) + 1 : 1;
    const newLink = {
      id: nextId,
      linkType: "New Link",
      bandwidth: "100 Mbps",
      provider: "DemoProvider",
      serviceId: `SVC-${Math.floor(10000 + Math.random() * 90000)}`,
      expiryDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 365)
        .toISOString()
        .slice(0, 10),
      monthlyCost: 99,
    };
    setLinks((prev) => [newLink, ...prev]);
  };

  const formatDate = (d) => {
    try {
      return format(new Date(d), "yyyy-MM-dd");
    } catch {
      return d;
    }
  };

  // 📥 Download CSV
  const handleDownloadCSV = () => {
    const csvRows = [
      ["Link Type", "Bandwidth", "Provider", "Service ID", "Expiry Date", "Monthly Cost ($)"],
      ...filtered.map((l) => [
        l.linkType,
        l.bandwidth,
        l.provider,
        l.serviceId,
        l.expiryDate,
        l.monthlyCost,
      ]),
    ];
    const csvContent = csvRows.map((r) => r.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `connectivity_links_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-blue-600">Connectivity Links</h1>
          <p className="text-gray-500 text-sm mt-1">
            Manage and monitor connectivity links for your assets.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Search */}
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by type, provider, or service ID..."
            className="border border-slate-200 px-3 py-2 text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
          />

          {/* Download CSV */}
          <button
            onClick={handleDownloadCSV}
            className="flex items-center gap-2 border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-slate-50 transition"
          >
            <Download className="h-4 w-4" />
            Download CSV
          </button>

          {/* Add Link */}
          <button
            onClick={handleAdd}
            className="flex items-center gap-2 bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 transition"
          >
            Add Link
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto border border-slate-200 bg-white shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-3 text-left text-gray-600 font-medium">Link Type</th>
              <th className="px-6 py-3 text-left text-gray-600 font-medium">Bandwidth</th>
              <th className="px-6 py-3 text-left text-gray-600 font-medium">Provider</th>
              <th className="px-6 py-3 text-left text-gray-600 font-medium">Service ID</th>
              <th className="px-6 py-3 text-left text-gray-600 font-medium">Expiry Date</th>
              <th className="px-6 py-3 text-right text-gray-600 font-medium">Monthly Cost</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((link) => (
              <tr
                key={link.id}
                className="border-t border-slate-100 hover:bg-slate-50 transition"
              >
                <td className="px-6 py-3 text-gray-700">{link.linkType}</td>
                <td className="px-6 py-3 text-gray-700">{link.bandwidth}</td>
                <td className="px-6 py-3 text-gray-700">{link.provider}</td>
                <td className="px-6 py-3 text-gray-700">{link.serviceId}</td>
                <td className="px-6 py-3 text-gray-700">{formatDate(link.expiryDate)}</td>
                <td className="px-6 py-3 text-right text-gray-700">${link.monthlyCost}</td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  className="px-6 py-6 text-center text-gray-500 italic"
                >
                  No links found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
