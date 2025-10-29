// src/pages/Devices/AddDeviceDrawer.jsx
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";


export default function AddDeviceDrawer({ open, onClose, onAdd, categoryId }) {
    const location = useLocation();
useEffect(() => {
  if (location.state?.scannedSerial) {
    setForm((f) => ({ ...f, serial: location.state.scannedSerial }));
  }
}, [location.state]);
  const [form, setForm] = useState({
    type: "",
    serial: "",
    hostname: "",
    assignedTo: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.serial || !form.hostname) {
      setError("Serial and Hostname are required.");
      return;
    }

    const skuPrefix = (form.type || "GEN").substring(0, 3).toUpperCase();
    const sku = `${skuPrefix}-${Math.floor(Math.random() * 900 + 100)}`;

    const newDevice = {
  id: Date.now(),
  sku,
  categoryId,
  status: "inward", // 🟢 default state
  projectName: null,
  ...form,
};


    onAdd(newDevice);
    onClose();
    setForm({ type: "", serial: "", hostname: "", assignedTo: "" });
  };

  return (
    <div
      className={`fixed inset-0 z-40 transition-opacity duration-300 ${
        open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
      }`}
    >
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <aside
        className={`absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-xl transform transition-transform duration-300 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <h3 className="text-lg font-semibold text-gray-900">Add Device</h3>
          <button onClick={onClose} className="text-slate-600 hover:text-slate-800">
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto h-[calc(100%-64px)]">
          {error && <div className="text-sm text-red-600">{error}</div>}

          <div>
            <label className="block text-sm text-gray-600 mb-1">Device Type</label>
            <input
              name="type"
              value={form.type}
              onChange={handleChange}
              className="w-full border border-slate-200  px-3 py-2 text-sm"
              placeholder="Laptop, Camera, etc."
            />
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">Serial Number</label>
            <input
              name="serial"
              value={form.serial}
              onChange={handleChange}
              className="w-full border border-slate-200  px-3 py-2 text-sm"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">Hostname</label>
            <input
              name="hostname"
              value={form.hostname}
              onChange={handleChange}
              className="w-full border border-slate-200  px-3 py-2 text-sm"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">Assigned To</label>
            <input
              name="assignedTo"
              value={form.assignedTo}
              onChange={handleChange}
              className="w-full border border-slate-200  px-3 py-2 text-sm"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className=" border border-slate-200 px-4 py-2 text-sm text-gray-600 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className=" bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
            >
              Create
            </button>
          </div>
        </form>
      </aside>
    </div>
  );
}
