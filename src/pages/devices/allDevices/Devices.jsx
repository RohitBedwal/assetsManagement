import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useParams, useNavigate } from "react-router-dom";
import AddDeviceDrawer from "./AddDeviceDrawer";
import { ArrowLeft, Download, Edit } from "lucide-react";
import { useNotifications } from "../../../context/NotificationContext";

export default function CategoryDevices() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addNotification } = useNotifications();

  const [devices, setDevices] = useState([]);
  const [category, setCategory] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingDevice, setEditingDevice] = useState(null);
  const [query, setQuery] = useState("");
  const [stats, setStats] = useState({ total: 0, assigned: 0, unassigned: 0 });
  const [loading, setLoading] = useState(false);
  const [showUnassignConfirm, setShowUnassignConfirm] = useState(false);
  const [deviceToUnassign, setDeviceToUnassign] = useState(null);
  const [showDownloadModal, setShowDownloadModal] = useState(false);

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
    const assigned = deviceList.filter((d) => d.status === "outward").length;
    const unassigned = deviceList.filter((d) => d.status === "inward").length;
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
      if (editingDevice) {
        // Update existing device
        const { data } = await api.put(`/devices/${editingDevice._id}`, {
          ...form,
          categoryId: id,
        });

        setDevices((prev) => {
          const updated = prev.map((d) => (d._id === data._id ? data : d));
          calculateStats(updated);
          return updated;
        });

        toast.success(`✅ Device ${data.sku} updated successfully`);
        addNotification(
          "Device Updated",
          `Device "${data.sku}" (Serial: ${data.serial}) has been updated.`
        );
      } else {
        // Add new device
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
        addNotification(
          "New Device Added",
          `Device "${data.sku}" (Serial: ${data.serial}) has been added to ${category?.name || "category"}.`
        );
      }
      
      setDrawerOpen(false);
      setEditingDevice(null);
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || `Failed to ${editingDevice ? 'update' : 'add'} device`);
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (device) => {
    setEditingDevice(device);
    setDrawerOpen(true);
  };

  const confirmUnassign = (device) => {
    setDeviceToUnassign(device);
    setShowUnassignConfirm(true);
  };

  const unassignDevice = async () => {
    if (!deviceToUnassign) return;

    try {
      const { data } = await api.put(`/devices/${deviceToUnassign._id}`, {
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
      console.error(err);
      toast.error("Failed to unassign device");
    } finally {
      setShowUnassignConfirm(false);
      setDeviceToUnassign(null);
    }
  };

  const handleDownloadCSV = () => {
    setShowDownloadModal(true);
  };

  const confirmDownload = () => {
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
    toast.success(`CSV file downloaded successfully!`);
    setShowDownloadModal(false);
  };

  const getStatusPill = (status) => {
    if (status === "inward") {
      return "bg-green-100 text-green-700";
    }
    if (status === "outward") {
      return "bg-blue-100 text-blue-700";
    }
    return "bg-slate-100 text-slate-700";
  };

  const getStatusLabel = (status) => {
    if (status === "inward") return "Inward";
    if (status === "outward") return "Outward";
    return status;
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}

      {/* Table Card */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/devices')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="h-5 w-5 text-gray-600" />
            </button>
            <h3 className="font-bold text-gray-800">{category?.name} <span className="text-sm font-light text-gray-500">• {category?.description}</span></h3>
          </div>
            {/* buttons and search bar */}
          <div className="flex justify-between items-center ">
            
           <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          {/* Search */}
          <div className="relative w-full sm:w-80">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3">
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
            </span>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by SKU, serial, or project"
              className="w-full bg-white border border-gray-300 text-gray-700 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block pl-10 p-2.5 shadow-sm"
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-3">
            <button
              onClick={handleDownloadCSV}
              className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 transition"
            >
              <Download className="w-4 h-4 mr-2 text-gray-500" />
              Download CSV
            </button>
            <button
              onClick={() => setDrawerOpen(true)}
              className="flex items-center px-4 py-2 bg-blue-600 border border-transparent rounded-lg text-sm font-medium text-white shadow-sm hover:bg-blue-700 transition"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
              </svg>
              Add Device
            </button>
          </div>
          </div>
          </div>
        </div>        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-xs text-gray-400 border-b border-gray-100">
                <th className="pb-3 font-medium">SKU</th>
                <th className="pb-3 font-medium">Type</th>
                <th className="pb-3 font-medium">Serial</th>
                <th className="pb-3 font-medium">Status</th>
                <th className="pb-3 font-medium">Project / Assignment</th>
                <th className="pb-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {filtered.map((d) => (
                <tr
                  key={d._id}
                  className="group hover:bg-gray-50 transition-colors"
                >
                  <td className="py-4">
                    <div className="font-bold text-gray-800">{d.sku}</div>
                  </td>
                  <td className="py-4 text-gray-500">{category?.name}</td>
                  <td className="py-4 text-gray-500 font-mono text-xs">{d.serial}</td>
                  <td className="py-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusPill(
                        d.status
                      )}`}
                    >
                      {getStatusLabel(d.status)}
                    </span>
                  </td>
                  <td className="py-4">
                    {d.projectName ? (
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-gray-800">{d.projectName}</span>
                        {d.assignedDate && (
                          <span className="text-xs text-gray-500">
                            Assigned: {new Date(d.assignedDate).toLocaleDateString()}
                          </span>
                        )}
                        {d.warrantyEndDate && (
                          <span className="text-xs text-red-500 font-medium">
                            Warranty ends: {new Date(d.warrantyEndDate).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    ) : (
                      <span className="text-sm text-gray-400 italic">Not assigned</span>
                    )}
                  </td>
                  <td className="py-4 text-right">
                    <div className="inline-flex items-center gap-2">
                      <button
                        onClick={() => navigate(`/devices/info/${d._id}`)}
                        className="border border-gray-200 rounded-lg px-3 py-1 text-xs text-gray-500 hover:bg-white transition-colors"
                      >
                        Details
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditClick(d);
                        }}
                        className="border border-blue-200 bg-blue-50 rounded-lg px-3 py-1 text-xs text-blue-600 hover:bg-blue-100 transition-colors flex items-center gap-1"
                      >
                        <Edit className="h-3 w-3" />
                        Edit
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <AddDeviceDrawer
        open={drawerOpen}
        onClose={() => {
          setDrawerOpen(false);
          setEditingDevice(null);
        }}
        onAdd={handleAddDevice}
        loading={loading}
        editingDevice={editingDevice}
      />

      {/* Unassign Confirmation Modal */}
      {showUnassignConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/30 backdrop-blur-sm transition-opacity"
            onClick={() => setShowUnassignConfirm(false)}
          />
          <div className="relative bg-white rounded-xl shadow-xl p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Confirm Unassignment
            </h3>
            <p className="text-sm text-gray-600 mb-6">
              Are you sure you want to unassign <span className="font-medium text-gray-900">{deviceToUnassign?.sku}</span> from <span className="font-medium text-gray-900">{deviceToUnassign?.projectName}</span>?
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowUnassignConfirm(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={unassignDevice}
                className="px-4 py-2 text-sm font-semibold text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
              >
                Unassign Device
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Download Confirmation Modal */}
      {showDownloadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/30 backdrop-blur-sm transition-opacity"
            onClick={() => setShowDownloadModal(false)}
          />
          <div className="relative bg-white rounded-2xl shadow-xl p-6 max-w-md w-full mx-4">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center flex-shrink-0">
                <Download className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-1">
                  Download CSV File?
                </h3>
                <p className="text-sm text-gray-600">
                  Download <span className="font-semibold text-gray-900">{category?.name}</span> devices data as CSV file.
                </p>
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowDownloadModal(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDownload}
                className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Download
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
