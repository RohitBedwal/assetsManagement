// src/pages/Devices.jsx
import React, { useState, useMemo } from "react";
import { format } from "date-fns"; // optional for date formatting

const initialDevices = [
  {
    id: 1,
    type: "Laptop",
    serial: "SN123456789",
    hostname: "Laptop-01",
    purchaseDate: "2023-01-15",
    warrantyExpiry: "2025-01-15",
    assignedTo: "Alice Johnson",
  },
  {
    id: 2,
    type: "Smartphone",
    serial: "SN987654321",
    hostname: "Phone-01",
    purchaseDate: "2023-03-20",
    warrantyExpiry: "2024-03-20",
    assignedTo: "Bob Williams",
  },
  {
    id: 3,
    type: "Tablet",
    serial: "SN456789123",
    hostname: "Tablet-01",
    purchaseDate: "2023-05-10",
    warrantyExpiry: "2024-05-10",
    assignedTo: "Charlie Davis",
  },
  {
    id: 4,
    type: "Desktop",
    serial: "SN321987654",
    hostname: "Desktop-01",
    purchaseDate: "2023-07-05",
    warrantyExpiry: "2025-07-05",
    assignedTo: "Diana Evans",
  },
  {
    id: 5,
    type: "Laptop",
    serial: "SN654123987",
    hostname: "Laptop-02",
    purchaseDate: "2023-09-12",
    warrantyExpiry: "2025-09-12",
    assignedTo: "Ethan Foster",
  },
  {
    id: 6,
    type: "Smartphone",
    serial: "SN789321456",
    hostname: "Phone-02",
    purchaseDate: "2023-11-18",
    warrantyExpiry: "2024-11-18",
    assignedTo: "Fiona Green",
  },
  {
    id: 7,
    type: "Tablet",
    serial: "SN147258369",
    hostname: "Tablet-02",
    purchaseDate: "2024-01-22",
    warrantyExpiry: "2025-01-22",
    assignedTo: "George Harris",
  },
  {
    id: 8,
    type: "Desktop",
    serial: "SN963852741",
    hostname: "Desktop-02",
    purchaseDate: "2024-03-28",
    warrantyExpiry: "2026-03-28",
    assignedTo: "Hannah Ives",
  },
  {
    id: 9,
    type: "Laptop",
    serial: "SN258369147",
    hostname: "Laptop-03",
    purchaseDate: "2024-05-03",
    warrantyExpiry: "2026-05-03",
    assignedTo: "Ian Jenkins",
  },
  {
    id: 10,
    type: "Smartphone",
    serial: "SN741852963",
    hostname: "Phone-03",
    purchaseDate: "2024-07-10",
    warrantyExpiry: "2025-07-10",
    assignedTo: "Julia King",
  },
];

export default function Devices() {
  const [devices, setDevices] = useState(initialDevices);
  const [query, setQuery] = useState("");

  // drawer state + form state
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [form, setForm] = useState({
    type: "Laptop",
    serial: "",
    hostname: "",
    purchaseDate: new Date().toISOString().slice(0, 10),
    warrantyExpiry: new Date(Date.now() + 1000 * 60 * 60 * 24 * 365).toISOString().slice(0, 10),
    assignedTo: "",
  });
  const [formError, setFormError] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return devices;
    return devices.filter(
      (d) =>
        d.type.toLowerCase().includes(q) ||
        d.serial.toLowerCase().includes(q) ||
        d.hostname.toLowerCase().includes(q) ||
        d.assignedTo.toLowerCase().includes(q)
    );
  }, [devices, query]);

  const formatDate = (d) => {
    try {
      return format(new Date(d), "yyyy-MM-dd");
    } catch {
      return d;
    }
  };

  const openAddDrawer = () => {
    setForm({
      type: "Laptop",
      serial: "",
      hostname: "",
      purchaseDate: new Date().toISOString().slice(0, 10),
      warrantyExpiry: new Date(Date.now() + 1000 * 60 * 60 * 24 * 365).toISOString().slice(0, 10),
      assignedTo: "",
    });
    setFormError("");
    setDrawerOpen(true);
    // lock scroll
    document.body.style.overflow = "hidden";
  };

  const closeDrawer = () => {
    setDrawerOpen(false);
    document.body.style.overflow = ""; // restore scroll
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // basic validation
    if (!form.serial.trim()) {
      setFormError("Serial number is required.");
      return;
    }
    if (!form.hostname.trim()) {
      setFormError("Hostname is required.");
      return;
    }
    // create new device (temporary only)
    const nextId = devices.length ? Math.max(...devices.map((d) => d.id)) + 1 : 1;
    const newDevice = {
      id: nextId,
      type: form.type,
      serial: form.serial.trim(),
      hostname: form.hostname.trim(),
      purchaseDate: form.purchaseDate,
      warrantyExpiry: form.warrantyExpiry,
      assignedTo: form.assignedTo || "Unassigned",
    };
    setDevices((prev) => [newDevice, ...prev]);
    closeDrawer();
  };

  return (
    <div className="w-full">
      {/* Top Bar */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-poppins font-bold text-[var(--text-primary)]">Devices</h1>
          <p className="mt-1 text-sm text-[var(--text-secondary)]">
            Manage all devices and track their warranty status.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search devices..."
            className="hidden md:block rounded-lg border border-slate-200 bg-white/90 px-3 py-2 text-sm placeholder:text-slate-400 focus:border-[var(--primary-color)] focus:ring-1 focus:ring-[var(--primary-color)]"
          />
          <button
            onClick={openAddDrawer}
            className="flex items-center gap-2 rounded-md bg-[var(--primary-color)] px-4 py-2 text-sm font-semibold text-white shadow-md hover:opacity-90"
          >
            Add Device
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="mt-6 overflow-hidden rounded-lg border border-slate-100 bg-white shadow-sm">
        <table className="w-full table-auto">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-medium text-[var(--text-secondary)]">
                Device Type
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-[var(--text-secondary)]">
                Serial Number
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-[var(--text-secondary)]">
                Hostname
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-[var(--text-secondary)]">
                Purchase Date
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-[var(--text-secondary)]">
                Warranty Expiry
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-[var(--text-secondary)]">
                Assigned To
              </th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((d, idx) => (
              <tr
                key={d.id}
                className={`border-t border-slate-100 ${
                  idx % 2 === 0 ? "bg-white" : "bg-slate-50/50"
                } hover:bg-slate-50`}
              >
                <td className="px-6 py-4 text-sm text-[var(--text-primary)]">{d.type}</td>
                <td className="px-6 py-4 text-sm text-[var(--text-primary)]">{d.serial}</td>
                <td className="px-6 py-4 text-sm text-[var(--text-primary)]">{d.hostname}</td>
                <td className="px-6 py-4 text-sm text-[var(--text-primary)]">
                  {formatDate(d.purchaseDate)}
                </td>
                <td className="px-6 py-4 text-sm text-[var(--text-primary)]">
                  {formatDate(d.warrantyExpiry)}
                </td>
                <td className="px-6 py-4 text-sm text-[var(--text-primary)]">{d.assignedTo}</td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="px-6 py-6 text-center text-sm text-slate-500">
                  No devices found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Right sliding drawer (Add Device form) */}
      {/* backdrop */}
      <div
        className={`fixed inset-0 z-40 transition-opacity duration-300 ${
          drawerOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
        aria-hidden={!drawerOpen}
      >
        <div
          className="absolute inset-0 bg-black/40"
          onClick={closeDrawer}
        />
        <aside
          className={`absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-xl transform transition-transform duration-300 ${
            drawerOpen ? "translate-x-0" : "translate-x-full"
          }`}
          role="dialog"
          aria-modal="true"
        >
          <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
            <h3 className="text-lg font-medium text-[var(--text-primary)]">Add Device</h3>
            <div className="flex items-center gap-2">
              <button
                onClick={closeDrawer}
                className="rounded-md p-2 text-slate-600 hover:bg-slate-100"
                aria-label="Close"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="px-6 py-6 space-y-4 overflow-y-auto h-[calc(100%-88px)]">
            {formError && <div className="text-sm text-red-600">{formError}</div>}

            <div>
              <label className="block text-sm text-[var(--text-secondary)] mb-1">Device Type</label>
              <select
                name="type"
                value={form.type}
                onChange={handleChange}
                className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm"
              >
                <option>Laptop</option>
                <option>Desktop</option>
                <option>Smartphone</option>
                <option>Tablet</option>
                <option>Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm text-[var(--text-secondary)] mb-1">Serial Number</label>
              <input
                name="serial"
                value={form.serial}
                onChange={handleChange}
                className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm"
                placeholder="e.g. SN123456789"
                required
              />
            </div>

            <div>
              <label className="block text-sm text-[var(--text-secondary)] mb-1">Hostname</label>
              <input
                name="hostname"
                value={form.hostname}
                onChange={handleChange}
                className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm"
                placeholder="e.g. Laptop-01"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm text-[var(--text-secondary)] mb-1">Purchase Date</label>
                <input
                  name="purchaseDate"
                  type="date"
                  value={form.purchaseDate}
                  onChange={handleChange}
                  className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm text-[var(--text-secondary)] mb-1">Warranty Expiry</label>
                <input
                  name="warrantyExpiry"
                  type="date"
                  value={form.warrantyExpiry}
                  onChange={handleChange}
                  className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm text-[var(--text-secondary)] mb-1">Assigned To</label>
              <input
                name="assignedTo"
                value={form.assignedTo}
                onChange={handleChange}
                className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm"
                placeholder="Person name (optional)"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-4">
              <button
                type="button"
                onClick={closeDrawer}
                className="rounded-md border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-md bg-[var(--primary-color)] px-4 py-2 text-sm font-semibold text-white hover:opacity-95"
              >
                Create Device
              </button>
            </div>
          </form>
        </aside>
      </div>
    </div>
  );
}
