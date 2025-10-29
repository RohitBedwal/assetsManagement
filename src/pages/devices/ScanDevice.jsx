// src/pages/Devices/ScanDevice.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import BarcodeScannerComponent from "react-qr-barcode-scanner";
import { ArrowLeft, Loader2 } from "lucide-react";

export default function ScanDevice() {
  const [data, setData] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleScan = (result) => {
    if (result) {
      setLoading(true);
      setData(result.text);

      // Simulate fetching device details (you can replace with backend API)
      setTimeout(() => {
        navigate("/devices/add", { state: { scannedSerial: result.text } });
      }, 1000);
    }
  };

  const handleError = (err) => {
    console.error("Scanner Error:", err);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate("/devices")}
          className="flex items-center gap-2 text-sm text-gray-600 hover:text-blue-600 transition"
        >
          <ArrowLeft className="h-4 w-4" />
          {/* Back */}
        </button>
        <h1 className="text-2xl font-bold text-blue-600">Scan Device Barcode</h1>
      </div>

      {/* Scanner */}
      <div className="relative bg-black  overflow-hidden shadow-md max-w-md mx-auto mt-6">
        <BarcodeScannerComponent
          width={"100%"}
          height={300}
          onUpdate={(err, result) => {
            if (result) handleScan(result);
            else if (err) handleError(err);
          }}
        />
      </div>

      {/* Scanned Result */}
      {data && (
        <div className="text-center mt-6">
          <p className="text-sm text-gray-600">Scanned Serial Number:</p>
          <p className="font-semibold text-blue-600 text-lg mt-1">{data}</p>
          {loading && (
            <div className="flex justify-center mt-3 text-blue-600">
              <Loader2 className="animate-spin h-5 w-5" />
              <span className="ml-2 text-sm">Fetching device details...</span>
            </div>
          )}
        </div>
      )}

      {!data && (
        <p className="text-center text-gray-500 text-sm mt-4">
          Align the barcode inside the camera frame to scan automatically.
        </p>
      )}
    </div>
  );
}
