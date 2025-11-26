import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useParams, useNavigate } from "react-router-dom";
import AddDeviceDrawer from "./AddDeviceDrawer";
import AssignDeviceDrawer from "./AssignDeviceDrawer";
import { ArrowLeft, Download } from "lucide-react";

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
    baseURL: `${import.meta.env.VITE_BACKEND_URL}/api`,
    headers: { "Content-Type": "application/json" },
  });

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

  const calculateStats = (deviceList) => {
    const total = deviceList.length;
    const assigned = deviceList.filter((d) => d.status === "DEPLOYED").length;
    const unassigned = deviceList.filter((d) => d.status === "IN_STOCK").length;
    setStats({ total, assigned, unassigned });
  };

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    return devices.filter(
      (d) =>
        d.sku.toLowerCase().includes(q) ||
        d.serial.toLowerCase().includes(q) ||
        (d.projectName && d.projectName.toLowerCase().includes(q))
    );
  }, [devices, query]);

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

  const handleAssign = async (form) => {
    try {
      const { data } = await api.put(`/devices/${selectedDeviceId}`, {
        status: "DEPLOYED",
        projectName: form.projectName,
        assignedDate: form.assignedDate,
        warrantyEndDate: form.warrantyEndDate, // comes from AssignDeviceDrawer
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

  const unassignDevice = async (deviceId) => {
    try {
      const { data } = await api.put(`/devices/${deviceId}`, {
        status: "IN_STOCK",
        projectName: null,
        assignedDate: null,
        // warrantyEndDate: null, // up to you whether to clear or keep last value
      });

      setDevices((prev) => {
        const updated = prev.map((d) => (d._id === data._id ? data : d));
        calculateStats(updated);
        return updated;
      });

      toast.success(`Device ${data.sku} unassigned successfully`);
    } catch (err) {
      console.error(err);
      toast.error("Failed to unassign device");
    }
  };

  const openAssignForm = (id) => {
    setSelectedDeviceId(id);
    setAssignDrawerOpen(true);
  };

  const handleDownloadCSV = () => {
    const csvRows = [
      ["SKU", "Category", "Serial", "Status", "Project", "Assigned Date", "Warranty End"],
      ...devices.map((d) => [
        d.sku,
        category?.name || "", // type = category
        d.serial,
        d.status,
        d.projectName || "Not assigned",
        d.assignedDate ? new Date(d.assignedDate).toISOString().split("T")[0] : "-",
        d.warrantyEndDate ? new Date(d.warrantyEndDate).toISOString().split("T")[0] : "-",
      ]),
    ];
    const csvContent = csvRows.map((r) => r.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${category?.name || "devices"}_data.csv`;
    link.click();
  };

  const getStatusPill = (status) => {
    if (status === "IN_STOCK") {
      return "bg-green-100 text-green-700";
    }
    if (status === "DEPLOYED") {
      return "bg-blue-100 text-blue-700";
    }
    return "bg-slate-100 text-slate-700";
  };

  const getStatusLabel = (status) => {
    if (status === "IN_STOCK") return "In Stock";
    if (status === "DEPLOYED") return "Deployed";
    return status;
  };

  return (
    <div className="space-y-6">
      {/* Back */}
      <div className="flex items-center gap-2 mb-2">
        <button
          onClick={() => navigate("/devices")}
          className="flex items-center gap-2 text-sm text-gray-600 hover:text-blue-600 transition"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>
      </div>

      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-blue-600">{category?.name}</h1>
          <p className="text-gray-500 text-sm mt-1">{category?.description}</p>

          <div className="flex gap-3 mt-2 text-sm">
            <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded">
              Total: {stats.total}
            </span>
            <span className="bg-green-50 text-green-600 px-3 py-1 rounded">
              In Stock: {stats.unassigned}
            </span>
            <span className="bg-amber-50 text-amber-600 px-3 py-1 rounded">
              Deployed: {stats.assigned}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by SKU, serial, or project..."
            className="border border-slate-200 px-3 py-2 text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
          />

          <button
            onClick={handleDownloadCSV}
            className="flex items-center gap-2 border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-slate-50 transition"
          >
            <Download className="h-4 w-4" />
            Download CSV
          </button>

          <button
            onClick={() => setDrawerOpen(true)}
            className="flex items-center gap-2 bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 transition"
          >
            Add Device
          </button>
        </div>
      </div>

      {/* Table */}
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
                {/* Type = Category name */}
                <td className="px-6 py-3">{category?.name}</td>
                <td className="px-6 py-3">{d.serial}</td>
                <td className="px-6 py-3">
                  <span
                    className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded ${getStatusPill(
                      d.status
                    )}`}
                  >
                    {getStatusLabel(d.status)}
                  </span>
                </td>
                <td className="px-6 py-3 text-gray-700">
                  {d.projectName ? (
                    <>
                      {d.projectName}
                      {d.assignedDate && (
                        <>
                          <p className="text-xs text-gray-500">
                            Assigned:{" "}
                            {new Date(d.assignedDate).toISOString().split("T")[0]}
                          </p>
                          {d.warrantyEndDate && (
                            <p className="text-xs text-red-500">
                              Warranty ends:{" "}
                              {new Date(d.warrantyEndDate)
                                .toISOString()
                                .split("T")[0]}
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
                  {d.status === "IN_STOCK" ? (
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
