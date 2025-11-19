import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useParams, useNavigate } from "react-router-dom";
import AddDeviceDrawer from "./AddDeviceDrawer";
import AssignDeviceDrawer from "./AssignDeviceDrawer";
import { ArrowLeft, Camera, Download } from "lucide-react";

export default function CategoryDevices() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [devices, setDevices] = useState([]);
  const [category, setCategory] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [assignDrawerOpen, setAssignDrawerOpen] = useState(false);
  const [selectedDeviceId, setSelectedDeviceId] = useState(null);
  const [query, setQuery] = useState("");
  const [stats, setStats] = useState({ total: 0, assigned: 0, unassigned: 0 });
  const [loading, setLoading] = useState(false);

  const api = axios.create({
    baseURL: `${url}`,
    headers: { "Content-Type": "application/json" },
  });

  // 🔹 Fetch category & devices
  const fetchCategoryAndDevices = async () => {
    try {
      const [catRes, devRes] = await Promise.all([
        api.get(`/categories/${id}`),
        api.get(`/devices?categoryId=${id}`),
      ]);

      setCategory(catRes.data);
      setDevices(devRes.data);
      calculateStats(devRes.data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load devices or category data.");
    }
  };

  useEffect(() => {
    fetchCategoryAndDevices();
  }, [id]);

  // 🔹 Calculate stats
  const calculateStats = (deviceList) => {
    const total = deviceList.length;
    const assigned = deviceList.filter((d) => d.status === "outward").length;
    const unassigned = total - assigned;
    setStats({ total, assigned, unassigned });
  };

  // 🔹 Filter by search
  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    return devices.filter(
      (d) =>
        d.sku.toLowerCase().includes(q) ||
        d.serial.toLowerCase().includes(q) ||
        (d.projectName && d.projectName.toLowerCase().includes(q))
    );
  }, [devices, query]);

  // 🔹 Add new device (only one API call)
  const handleAddDevice = async (form) => {
    if (loading) return;
    setLoading(true);

    try {
      const { data } = await api.post("/devices", {
        ...form,
        categoryId: id,
      });

      setDevices((prev) => {
        const updated = [data, ...prev];
        calculateStats(updated);
        return updated;
      });

      toast.success(`✅ Device ${data.sku} added successfully`);
      setDrawerOpen(false);
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to add device");
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Assign Device
  const handleAssign = async (form) => {
    try {
      const { data } = await api.put(`/devices/${selectedDeviceId}`, {
        status: "outward",
        projectName: form.projectName,
        assignedDate: form.assignedDate,
      });

      setDevices((prev) => {
        const updated = prev.map((d) => (d._id === data._id ? data : d));
        calculateStats(updated);
        return updated;
      });

      toast.success(`Device assigned to ${data.projectName}`);
    } catch (err) {
      console.error(err);
      toast.error("Failed to assign device");
    } finally {
      setAssignDrawerOpen(false);
    }
  };

  // 🔹 Unassign Device
  const unassignDevice = async (id) => {
    try {
      const { data } = await api.put(`/devices/${id}`, {
        status: "inward",
        projectName: null,
        assignedDate: null,
      });

      setDevices((prev) => {
        const updated = prev.map((d) => (d._id === data._id ? data : d));
        calculateStats(updated);
        return updated;
      });

      toast.success(`Device ${data.sku} unassigned successfully`);
    } catch (err) {
      toast.error("Failed to unassign device");
    }
  };

  // 🔹 Assign Drawer Open
  const openAssignForm = (id) => {
    setSelectedDeviceId(id);
    setAssignDrawerOpen(true);
  };

  // 🔹 CSV Export
  const handleDownloadCSV = () => {
    const csvRows = [
      ["SKU", "Type", "Serial", "Status", "Project", "Assigned Date"],
      ...devices.map((d) => [
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
          Back
        </button>
      </div>

      {/* 🧭 Header */}
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-blue-600">{category?.name}</h1>
          <p className="text-gray-500 text-sm mt-1">{category?.description}</p>

          {/* 📊 Stats */}
          <div className="flex gap-3 mt-2 text-sm">
            <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded">
              Total: {stats.total}
            </span>
            <span className="bg-green-50 text-green-600 px-3 py-1 rounded">
              Inward: {stats.unassigned}
            </span>
            <span className="bg-amber-50 text-amber-600 px-3 py-1 rounded">
              Outward: {stats.assigned}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Search */}
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by SKU, serial, or project..."
            className="border border-slate-200 px-3 py-2 text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
          />

          {/* Camera */}
          {/* <button
            onClick={() => navigate(`/devices/${id}/scan`)}
            className="flex items-center gap-2 border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-slate-50 transition"
          >
            <Camera className="h-4 w-4" />
            Scan
          </button> */}

          {/* Download CSV */}
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
                key={d._id}
                className="border-t border-slate-100 hover:bg-slate-50 transition"
              >
                <td className="px-6 py-3">{d.sku}</td>
                <td className="px-6 py-3">{d.type}</td>
                <td className="px-6 py-3">{d.serial}</td>
                <td className="px-6 py-3">
                  <span
                    className={`inline-flex items-center px-2 py-1 text-xs font-medium ${d.status === "inward"
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
                        <>
                          <p className="text-xs text-gray-500">{`Assigned: ${d.assignedDate}`}</p>
                          {d.warrantyEndDate && (
                            <p className="text-xs text-red-500">
                              Warranty ends: {d.warrantyEndDate}
                            </p>
                          )}
                        </>
                      )}
                    </>
                  ) : (
                    <span className="text-gray-400 italic">Not assigned</span>
                  )}
                </td>
                <td className="px-6 py-3 text-right">
                  <button
                    onClick={() => navigate(`/devices/info/${d._id}`)}
                    className="text-blue-600 text-sm hover:underline mr-3"
                  >
                    View
                  </button>
                  {d.status === "inward" ? (
                    <button
                      onClick={() => openAssignForm(d._id)}
                      className="text-green-600 text-sm hover:underline"
                    >
                      Assign
                    </button>
                  ) : (
                    <button
                      onClick={() => unassignDevice(d._id)}
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
        loading={loading}
      />

      <AssignDeviceDrawer
        open={assignDrawerOpen}
        onClose={() => setAssignDrawerOpen(false)}
        onAssign={handleAssign}
      />
    </div>
  );
}
