// src/pages/Links.jsx
import React, { useMemo, useState } from "react";
import { format } from "date-fns"; // optional, install date-fns or remove formatting

const initialLinks = [
  {
    id: 1,
    linkType: "Fiber",
    bandwidth: "1 Gbps",
    provider: "TechConnect",
    serviceId: "SVC-12345",
    expiryDate: "2025-12-31",
    monthlyCost: 150,
  },
  {
    id: 2,
    linkType: "Ethernet",
    bandwidth: "100 Mbps",
    provider: "NetSolutions",
    serviceId: "SVC-67890",
    expiryDate: "2024-06-30",
    monthlyCost: 80,
  },
  {
    id: 3,
    linkType: "Wireless",
    bandwidth: "50 Mbps",
    provider: "SkyNet",
    serviceId: "SVC-11223",
    expiryDate: "2023-11-15",
    monthlyCost: 50,
  },
  {
    id: 4,
    linkType: "DSL",
    bandwidth: "20 Mbps",
    provider: "GlobalCom",
    serviceId: "SVC-44556",
    expiryDate: "2024-03-20",
    monthlyCost: 30,
  },
  {
    id: 5,
    linkType: "Satellite",
    bandwidth: "10 Mbps",
    provider: "StarLink",
    serviceId: "SVC-77889",
    expiryDate: "2025-09-01",
    monthlyCost: 200,
  },
];

export default function Links() {
  const [links, setLinks] = useState(initialLinks);
  const [query, setQuery] = useState("");

  // filtered list
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

  const handleAdd = () => {
    // quick add demo — replace with modal or form later
    const nextId = links.length ? Math.max(...links.map((l) => l.id)) + 1 : 1;
    const newLink = {
      id: nextId,
      linkType: "New Link",
      bandwidth: "100 Mbps",
      provider: "DemoProvider",
      serviceId: `SVC-${Math.floor(10000 + Math.random() * 90000)}`,
      expiryDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 365).toISOString().slice(0, 10),
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

  return (
    <div className="w-full">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-poppins font-bold text-[var(--text-primary)]">
            Connectivity Links
          </h1>
          <p className="mt-1 text-sm text-[var(--text-secondary)]">
            Manage and monitor connectivity links for your assets.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search links, provider or service id..."
            className="hidden md:block rounded-lg border border-slate-200 bg-white/90 px-3 py-2 text-sm placeholder:text-slate-400 focus:border-[var(--primary-color)] focus:ring-1 focus:ring-[var(--primary-color)]"
          />
          <button
            onClick={handleAdd}
            className="flex items-center gap-2 rounded-md bg-[var(--primary-color)] px-4 py-2 text-sm font-semibold text-white shadow-md hover:opacity-90"
          >
            Add Link
          </button>
        </div>
      </div>

      {/* Table container */}
      <div className="mt-6 overflow-hidden rounded-lg border border-slate-100 bg-gradient-to-br from-white/90 to-slate-50">
        <table className="w-full table-auto">
          <thead className="bg-white/60">
            <tr>
              <th className="text-left px-6 py-4 text-sm font-medium text-[var(--text-secondary)]">
                Link Type
              </th>
              <th className="text-left px-6 py-4 text-sm font-medium text-[var(--text-secondary)]">
                Bandwidth
              </th>
              <th className="text-left px-6 py-4 text-sm font-medium text-[var(--text-secondary)]">
                Provider
              </th>
              <th className="text-left px-6 py-4 text-sm font-medium text-[var(--text-secondary)]">
                Service ID
              </th>
              <th className="text-left px-6 py-4 text-sm font-medium text-[var(--text-secondary)]">
                Expiry Date
              </th>
              <th className="text-right px-6 py-4 text-sm font-medium text-[var(--text-secondary)]">
                Monthly Cost
              </th>
            </tr>
          </thead>

          <tbody>
            {filtered.map((link, idx) => (
              <tr
                key={link.id}
                className={`border-t border-slate-100 hover:bg-slate-50 ${
                  idx % 2 === 0 ? "bg-white" : "bg-white/95"
                }`}
              >
                <td className="px-6 py-5 text-sm text-[var(--text-primary)]">{link.linkType}</td>
                <td className="px-6 py-5 text-sm text-[var(--text-primary)]">{link.bandwidth}</td>
                <td className="px-6 py-5 text-sm text-[var(--text-primary)]">{link.provider}</td>
                <td className="px-6 py-5 text-sm text-[var(--text-primary)]">{link.serviceId}</td>
                <td className="px-6 py-5 text-sm text-[var(--text-primary)]">
                  {formatDate(link.expiryDate)}
                </td>
                <td className="px-6 py-5 text-sm text-right text-[var(--text-primary)]">
                  ${link.monthlyCost}
                </td>
              </tr>
            ))}

            {filtered.length === 0 && (
              <tr>
                <td colSpan="6" className="px-6 py-8 text-center text-sm text-slate-500">
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
