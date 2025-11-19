import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Barcode from "react-barcode";
import { ArrowLeft } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";
import { url } from "../../context/config";

export default function DeviceInfo() {
  const { deviceId } = useParams();
  const navigate = useNavigate();

  const [device, setDevice] = useState(null);
  const [loading, setLoading] = useState(true);

  const api = axios.create({
    baseURL: `${url}/api`,
  });

  useEffect(() => {
    const fetchDevice = async () => {
      try {
        const { data } = await api.get(`/devices/${deviceId}`);
        setDevice(data);
      } catch (error) {
        console.error(error);
        toast.error("Failed to fetch device details");
      } finally {
        setLoading(false);
      }
    };
    fetchDevice();
  }, [deviceId]);

  if (loading) {
    return <p className="p-6 text-gray-500">Loading device info...</p>;
  }

  if (!device) {
    return (
      <div className="p-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm text-gray-600 hover:text-blue-600"
        >
          <ArrowLeft className="h-4 w-4" /> Back
        </button>
        <p className="text-gray-500 mt-4">Device not found.</p>
      </div>
    );
  }

  const isExpired =
    device.warrantyEndDate &&
    new Date(device.warrantyEndDate) < new Date();

  return (
    <div className="p-6 space-y-6">
      {/* 🔙 Back */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-sm text-gray-600 hover:text-blue-600"
      >
        <ArrowLeft className="h-4 w-4" /> Back
      </button>

      <div className="bg-white border border-slate-200 shadow-sm rounded-lg p-6">
        {/* Header section */}
        <div className="flex flex-col md:flex-row justify-between gap-6">
          {/* Left: Device Info */}
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              {device.type || "Unnamed Device"}
            </h1>
            <p className="text-gray-600 text-sm mb-1">
              <strong>Serial No:</strong> {device.serial}
            </p>
            <p className="text-gray-600 text-sm mb-1">
              <strong>SKU:</strong> {device.sku}
            </p>
            <p className="text-gray-600 text-sm mb-3">
              <strong>Status:</strong>{" "}
              <span
                className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded ${
                  device.status === "inward"
                    ? "bg-green-100 text-green-700"
                    : "bg-blue-100 text-blue-700"
                }`}
              >
                {device.status === "inward" ? "Inward" : "Outward"}
              </span>
            </p>

            {device.projectName ? (
              <div className="bg-blue-50 border border-blue-100 rounded-md p-3 mb-3">
                <p className="text-sm text-gray-800">
                  <strong>Assigned To:</strong> {device.projectName}
                </p>
                {device.assignedDate && (
                  <p className="text-sm text-gray-600">
                    <strong>Assigned Date:</strong> {device.assignedDate}
                  </p>
                )}
                {device.warrantyEndDate && (
                  <p
                    className={`text-sm mt-1 font-medium ${
                      isExpired ? "text-red-600" : "text-green-600"
                    }`}
                  >
                    <strong>Warranty:</strong>{" "}
                    {isExpired
                      ? `Expired on ${device.warrantyEndDate}`
                      : `Valid till ${device.warrantyEndDate}`}
                  </p>
                )}
              </div>
            ) : (
              <p className="text-sm text-gray-400 italic">
                Not assigned to any project
              </p>
            )}
          </div>

          {/* Right: Barcode + Image */}
          <div className="flex flex-col items-center md:items-end gap-3">
            <img
              src={device.imageUrl || "/placeholder-device.png"}
              alt="Device"
              className="w-48 h-36 object-cover border border-slate-200 rounded-md"
            />
            <Barcode value={device.sku} height={60} width={1.5} />
            <p className="text-xs text-gray-500 mt-1">{device.sku}</p>
          </div>
        </div>

        <hr className="my-6" />

        {/* 🔧 Technical Specs */}
        <div>
          <h2 className="text-lg font-semibold text-gray-800 mb-3">
            Device Specifications
          </h2>

          {device.specs ? (
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-gray-700">
              <li>
                <strong>Model:</strong> {device.specs.model || "N/A"}
              </li>
              <li>
                <strong>Processor:</strong> {device.specs.processor || "N/A"}
              </li>
              <li>
                <strong>RAM:</strong> {device.specs.ram || "N/A"}
              </li>
              <li>
                <strong>Storage:</strong> {device.specs.storage || "N/A"}
              </li>
              <li>
                <strong>Graphics:</strong> {device.specs.gpu || "N/A"}
              </li>
              <li>
                <strong>OS:</strong> {device.specs.os || "N/A"}
              </li>
            </ul>
          ) : (
            <p className="text-sm text-gray-500 italic">
              No technical specifications available for this device.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
