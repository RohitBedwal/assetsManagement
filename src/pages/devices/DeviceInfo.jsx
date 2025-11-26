// src/pages/devices/DeviceInfo.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";

const API_URL = import.meta.env.VITE_BACKEND_URL;

export default function DeviceInfo() {
  const { deviceId } = useParams();
  const navigate = useNavigate();

  const [device, setDevice] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDevice = async () => {
      try {
        const { data } = await axios.get(`${API_URL}/api/devices/${deviceId}`);
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
    <div className="space-y-6">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-sm text-gray-600 hover:text-blue-600 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" /> Back
      </button>

      <div className="bg-white border border-gray-100 shadow-sm rounded-2xl p-6">
        {/* Header */}
        <div className="flex flex-col justify-between gap-6">
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              {device.categoryId?.name || "Asset"}
            </h1>

            <p className="text-gray-600 text-sm mb-1">
              <strong>Serial:</strong> {device.serial}
            </p>
            <p className="text-gray-600 text-sm mb-3">
              <strong>SKU:</strong> {device.sku}
            </p>

            <p className="text-gray-600 text-sm mb-3">
              <strong>Status:</strong>{" "}
              <span
                className={`px-2 py-1 text-xs font-medium rounded ${
                  device.status === "inward"
                    ? "bg-green-100 text-green-700"
                    : "bg-blue-100 text-blue-700"
                }`}
              >
                {device.status.toUpperCase()}
              </span>
            </p>

            {device.assignedTo ? (
              <div className="bg-blue-50 border border-blue-100 rounded-md p-3 mb-3">
                <p className="text-sm text-gray-800">
                  <strong>Assigned To:</strong> {device.assignedTo}
                </p>

                {device.assignedDate && (
                  <p className="text-sm text-gray-600">
                    <strong>Assigned:</strong> {device.assignedDate}
                  </p>
                )}
              </div>
            ) : (
              <p className="text-sm text-gray-400 italic">
                Not assigned
              </p>
            )}
          </div>
        </div>

        <hr className="my-6" />

        {/* Details */}
        <h2 className="text-lg font-semibold text-gray-800 mb-3">
          Additional Information
        </h2>

        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-gray-700">
          <Info label="Vendor" value={device.vendor} />
          <Info label="PO Number" value={device.purchaseOrderNumber} />
          <Info label="Purchase Date" value={device.purchaseDate} />
          <Info
            label="Warranty"
            value={
              device.warrantyEndDate
                ? `${device.warrantyEndDate} ${
                    isExpired ? "(Expired)" : "(Active)"
                  }`
                : "N/A"
            }
            expired={isExpired}
          />
          <Info label="AMC Expiry" value={device.amcExpiryDate} />
          <Info label="Installed At" value={device.installedAtSite} />
          <Info label="IP Address" value={device.ipAddress} />
          <Info label="MAC Address" value={device.macAddress} />
          <Info label="Firmware/OS" value={device.firmwareOSVersion} />
          <Info label="Rack ID" value={device.rackId} />
          <Info label="Rack Unit" value={device.rackUnit} />
          <Info label="Data Center" value={device.dataCenter} />
          <Info label="Notes" value={device.notes} />
        </ul>
      </div>
    </div>
  );
}

function Info({ label, value, expired }) {
  return (
    <li>
      <strong>{label}: </strong>
      <span className={expired ? "text-red-600 font-semibold" : ""}>
        {value || "N/A"}
      </span>
    </li>
  );
}
