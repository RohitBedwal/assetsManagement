import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import Barcode from "react-barcode";
import { ArrowLeft } from "lucide-react";
import { useDevices } from "../../context/DeviceContext";

export default function DeviceInfo() {
  const { deviceId } = useParams();
  const navigate = useNavigate();
  const { devices } = useDevices();

  const device = devices.find((d) => d.id.toString() === deviceId);

  if (!device) {
    return (
      <div className="p-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm text-gray-600 hover:text-blue-600"
        >
          <ArrowLeft className="h-4 w-4" /> 
            {/* Back */}
        </button>
        <p className="text-gray-500 mt-4">Device not found.</p>
      </div>
    );
  }

  return (
    <div className=" space-y-6">
      {/* Back */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-sm text-gray-600 hover:text-blue-600"
      >
        <ArrowLeft className="h-4 w-4" /> Back
      </button>

      <div className="bg-white border border-slate-200  shadow-sm p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              {device.hostname}
            </h1>
            <p className="text-gray-600 text-sm mb-2">
              <strong>Type:</strong> {device.type}
            </p>
            <p className="text-gray-600 text-sm">
              <strong>Serial No:</strong> {device.serial}
            </p>
          </div>

          {/* Barcode */}
          <div className="flex flex-col items-center">
            <Barcode value={device.sku} height={60} width={1.5} />
            <p className="text-xs text-gray-500 mt-1">{device.sku}</p>
          </div>
        </div>

        <hr className="my-6" />

        <div>
          <p className="text-sm text-gray-600 mb-2">
            <strong>Status:</strong>{" "}
            <span
              className={`inline-flex items-center px-2 py-1  text-xs font-medium ${
                device.status === "inward"
                  ? "bg-green-100 text-green-700"
                  : "bg-blue-100 text-blue-700"
              }`}
            >
              {device.status === "inward" ? "Inward" : "Outward"}
            </span>
          </p>

          {device.projectName ? (
            <>
              <p className="text-sm text-gray-600">
                <strong>Assigned To:</strong> {device.projectName}
              </p>
              {device.assignedDate && (
                <p className="text-sm text-gray-500">
                  <strong>Outward Date:</strong> {device.assignedDate}
                </p>
              )}
            </>
          ) : (
            <p className="text-sm text-gray-400 italic">
              Not assigned to any project
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
