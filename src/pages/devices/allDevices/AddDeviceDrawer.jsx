// src/pages/devices/Category/AddDeviceDrawer.jsx
import React, { useState } from "react";

export default function AddDeviceDrawer({ open, onClose, onAdd, loading }) {
  const [form, setForm] = useState({
    sku: "",
    serial: "",
    status: "inward",
    assignedTo: "",
    purchaseDate: "",
    warrantyEndDate: "",
    amcExpiryDate: "",
    vendor: "",
    purchaseOrderNumber: "",
    installedAtSite: "",
    ipAddress: "",
    macAddress: "",
    firmwareOSVersion: "",
    rackId: "",
    rackUnit: "",
    dataCenter: "",
    notes: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    const numberFields = ["rackUnit"];
  if (numberFields.includes(name)) {
    return setForm((prev) => ({ ...prev, [name]: value ? Number(value) : "" }));
  }
    setForm((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.sku.trim() || !form.serial.trim()) {
      setError("SKU and Serial Number are required!");
      return;
    }
    onAdd(form);
  };

  return (
    <div className={`fixed inset-0 z-40 transition-opacity ${open ? "" : "pointer-events-none"}`}>
      
      {/* Background overlay */}
      <div
        onClick={onClose}
        className={`absolute inset-0 bg-gray-900 transition-opacity duration-300 ${
          open ? "opacity-40 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      />

      {/* Drawer */}
      <aside
        className={`absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-lg border-l border-slate-200 transition-transform duration-300 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4 bg-white">
          <h3 className="text-lg font-semibold text-gray-800">Add Device</h3>
          <button onClick={onClose} className="text-gray-600 hover:text-gray-800">✕</button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto h-[calc(100%-64px)]">
          {error && (
            <div className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded">
              {error}
            </div>
          )}

          <InputField label="SKU" name="sku" value={form.sku} onChange={handleChange} required />
          <InputField label="Serial Number" name="serial" value={form.serial} onChange={handleChange} required />

          <Dropdown
            label="Status"
            name="status"
            value={form.status}
            onChange={handleChange}
            options={["inward", "outward"]}
            required
          />

          <InputField label="Assigned To" name="assignedTo" value={form.assignedTo} onChange={handleChange} />
          <InputField label="Vendor" name="vendor" value={form.vendor} onChange={handleChange} />
          <InputField label="PO Number" name="purchaseOrderNumber" value={form.purchaseOrderNumber} onChange={handleChange} />

          <DateField label="Purchase Date" name="purchaseDate" value={form.purchaseDate} onChange={handleChange} />
          <DateField label="Warranty End Date" name="warrantyEndDate" value={form.warrantyEndDate} onChange={handleChange} />
          <DateField label="AMC Expiry Date" name="amcExpiryDate" value={form.amcExpiryDate} onChange={handleChange} />

          <InputField label="Installed At" name="installedAtSite" value={form.installedAtSite} onChange={handleChange} />

          <InputField label="Rack ID" name="rackId" value={form.rackId} onChange={handleChange} />
          <InputField label="Rack Unit" name="rackUnit" value={form.rackUnit} onChange={handleChange} />
          <InputField label="Data Center" name="dataCenter" value={form.dataCenter} onChange={handleChange} />

          <InputField label="IP Address" name="ipAddress" value={form.ipAddress} onChange={handleChange} />
          <InputField label="MAC Address" name="macAddress" value={form.macAddress} onChange={handleChange} />
          <InputField label="Firmware / OS" name="firmwareOSVersion" value={form.firmwareOSVersion} onChange={handleChange} />

          <textarea
            name="notes"
            value={form.notes}
            onChange={handleChange}
            placeholder="Notes"
            className="w-full border border-slate-200 rounded px-3 py-2 text-sm"
          />

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="border border-slate-200 bg-white px-4 py-2 text-sm text-gray-700 hover:bg-slate-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className={`px-4 py-2 text-sm text-white rounded ${
                loading ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {loading ? "Saving..." : "Add Device"}
            </button>
          </div>
        </form>
      </aside>
    </div>
  );
}

// Reusable components
function InputField({ label, name, value, onChange, required }) {
  return (
    <div>
      <label className="text-sm block text-gray-600 mb-1">{label}</label>
      <input
        name={name}
        value={value}
        required={required}
        onChange={onChange}
        className="w-full border border-slate-200 rounded px-3 py-2 text-sm"
      />
    </div>
  );
}

function Dropdown({ label, name, value, onChange, options, required }) {
  return (
    <div>
      <label className="text-sm block text-gray-600 mb-1">{label}</label>
      <select
        name={name}
        value={value}
        required={required}
        onChange={onChange}
        className="w-full border border-slate-200 rounded px-3 py-2 text-sm"
      >
        {options.map((o) => (
          <option key={o} value={o}>{o}</option>
        ))}
      </select>
    </div>
  );
}

function DateField({ label, name, value, onChange }) {
  return (
    <div>
      <label className="text-sm block text-gray-600 mb-1">{label}</label>
      <input
        type="date"
        name={name}
        value={value}
        onChange={onChange}
        className="w-full border border-slate-200 rounded px-3 py-2 text-sm"
      />
    </div>
  );
}
