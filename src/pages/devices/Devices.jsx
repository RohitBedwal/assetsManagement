import React, { useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { initialDevices, initialCategories } from "./data";
import AddDeviceDrawer from "./AddDeviceDrawer";
import AssignDeviceDrawer from "./AssignDeviceDrawer";
import { useDevices } from "../../context/DeviceContext";
import { ArrowLeft, Camera, Download } from "lucide-react"; // ⬅️ added Download icon

export default function CategoryDevices() {
  const { id } = useParams();
  const navigate = useNavigate();
  const categoryId = parseInt(id, 10);
  const category = initialCategories.find((c) => c.id === categoryId);

  const { devices, updateDevice, addDevice } = useDevices();
  const categoryDevices = devices.filter((d) => d.categoryId === categoryId);

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [assignDrawerOpen, setAssignDrawerOpen] = useState(false);
  const [selectedDeviceId, setSelectedDeviceId] = useState(null);
  const [query, setQuery] = useState("");

  // 🔍 Filter
  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    return devices.filter(
      (d) =>
        d.sku.toLowerCase().includes(q) ||
        d.serial.toLowerCase().includes(q) ||
        d.hostname.toLowerCase().includes(q) ||
        (d.projectName && d.projectName.toLowerCase().includes(q))
    );
  }, [devices, query]);

  // 📦 Assign / Unassign
  const openAssignForm = (id) => {
    setSelectedDeviceId(id);
    setAssignDrawerOpen(true);
  };

  const handleAssign = (form) => {
    updateDevice(selectedDeviceId, {
      status: "outward",
      projectName: form.projectName,
      assignedDate: form.assignedDate,
    });
    setAssignDrawerOpen(false);
  };

  const unassignDevice = (id) => {
    updateDevice(id, {
      status: "inward",
      projectName: null,
      assignedDate: null,
    });
  };

  const handleAddDevice = (device) => {
    addDevice({
      ...device,
      status: "inward",
      projectName: null,
    });
    setDrawerOpen(false);
  };

  // ✅ CSV Export function
  const handleDownloadCSV = () => {
    const csvRows = [
      ["SKU", "Type", "Serial", "Status", "Project", "Assigned Date"],
      ...filtered.map((d) => [
        d.sku,
        d.type,
        d.serial,
        d.status,
        d.projectName || "Not assigned",
        d.assignedDate || "-",
      ]),
    ];
    const csvContent = csvRows.map((r) => r.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${category?.name || "devices"}_data.csv`;
    link.click();
  };

  return (
    <div className="space-y-6">
      {/* 🔙 Back */}
      <div className="flex items-center gap-2 mb-2">
        <button
          onClick={() => navigate("/devices")}
          className="flex items-center gap-2 text-sm text-gray-600 hover:text-blue-600 transition"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>
      </div>

      {/* 🧭 Header */}
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-blue-600">{category?.name}</h1>
          <p className="text-gray-500 text-sm mt-1">{category?.description}</p>
        </div>

        <div className="flex items-center gap-3">
          {/* Search */}
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by SKU, serial, or project..."
            className="border border-slate-200 px-3 py-2 text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
          />

          {/* Camera Scan */}
          <button
            onClick={() => navigate(`/devices/${categoryId}/scan`)}
            className="flex items-center gap-2 border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-slate-50 transition"
          >
            <Camera className="h-4 w-4" />
            Scan
          </button>

          {/* ✅ Download CSV Button */}
          <button
            onClick={handleDownloadCSV}
            className="flex items-center gap-2 border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-slate-50 transition"
          >
            <Download className="h-4 w-4" />
            Download CSV
          </button>

          {/* Add Device */}
          <button
            onClick={() => setDrawerOpen(true)}
            className="flex items-center gap-2 bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 transition"
          >
            Add Device
          </button>
        </div>
      </div>

      {/* 📋 Table */}
      <div className="overflow-x-auto border border-slate-200 bg-white shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-3 text-left text-gray-600 font-medium">SKU</th>
              <th className="px-6 py-3 text-left text-gray-600 font-medium">Type</th>
              <th className="px-6 py-3 text-left text-gray-600 font-medium">Serial</th>
              <th className="px-6 py-3 text-left text-gray-600 font-medium">Status</th>
              <th className="px-6 py-3 text-left text-gray-600 font-medium">Project</th>
              <th className="px-6 py-3 text-gray-600 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((d) => (
              <tr
                key={d.id}
                className="border-t border-slate-100 hover:bg-slate-50 transition"
              >
                <td className="px-6 py-3">{d.sku}</td>
                <td className="px-6 py-3">{d.type}</td>
                <td className="px-6 py-3">{d.serial}</td>
                <td className="px-6 py-3">
                  <span
                    className={`inline-flex items-center px-2 py-1 text-xs font-medium ${
                      d.status === "inward"
                        ? "bg-green-100 text-green-700"
                        : "bg-blue-100 text-blue-700"
                    }`}
                  >
                    {d.status === "inward" ? "Inward" : "Outward"}
                  </span>
                </td>
                <td className="px-6 py-3 text-gray-700">
                  {d.projectName ? (
                    <>
                      {d.projectName}
                      {d.assignedDate && (
                        <p className="text-xs text-gray-400">
                          {`Assigned: ${d.assignedDate}`}
                        </p>
                      )}
                    </>
                  ) : (
                    <span className="text-gray-400 italic">Not assigned</span>
                  )}
                </td>
                <td className="px-6 py-3 text-right">
                  <button
                    onClick={() => navigate(`/devices/info/${d.id}`)}
                    className="text-blue-600 text-sm hover:underline mr-3"
                  >
                    View
                  </button>
                  {d.status === "inward" ? (
                    <button
                      onClick={() => openAssignForm(d.id)}
                      className="text-green-600 text-sm hover:underline"
                    >
                      Assign
                    </button>
                  ) : (
                    <button
                      onClick={() => unassignDevice(d.id)}
                      className="text-red-500 text-sm hover:underline"
                    >
                      Unassign
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Drawers */}
      <AddDeviceDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onAdd={handleAddDevice}
        categoryId={categoryId}
      />

      <AssignDeviceDrawer
        open={assignDrawerOpen}
        onClose={() => setAssignDrawerOpen(false)}
        onAssign={handleAssign}
      />
    </div>
  );
}
