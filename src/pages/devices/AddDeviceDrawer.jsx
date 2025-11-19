// src/pages/Devices/AddDeviceDrawer.jsx
import React, { useEffect, useState, useRef } from "react";
import { useLocation } from "react-router-dom";
import BarcodeScannerComponent from "react-qr-barcode-scanner";

export default function AddDeviceDrawer({ open, onClose, onAdd, loading }) {
  const location = useLocation();

  const [form, setForm] = useState({ type: "", serial: "", assignedTo: "", image: null });
  const [error, setError] = useState("");
  const [scanning, setScanning] = useState(false);
  const [photoPreview, setPhotoPreview] = useState(null);
  const videoRef = useRef(null);

  // ✅ Autofill serial if scanned from another route
  useEffect(() => {
    if (location.state?.scannedSerial) {
      setForm((f) => ({ ...f, serial: location.state.scannedSerial }));
    }
  }, [location.state]);

  // ✅ Form change handler
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    setError("");
  };

  // ✅ Barcode detection callback
  const handleBarcodeDetected = (err, result) => {
    if (result) {
      setForm((f) => ({ ...f, serial: result.text }));
      setScanning(false);
    }
  };

  // ✅ Capture image from webcam
  const handleCapturePhoto = async () => {
    const video = videoRef.current;
    if (!video) return;

    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0);

    canvas.toBlob((blob) => {
      const file = new File([blob], `device-${Date.now()}.jpg`, { type: "image/jpeg" });
      setForm((f) => ({ ...f, image: file }));
      setPhotoPreview(URL.createObjectURL(file));
    }, "image/jpeg");
  };

  // ✅ Submit handler
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.type || !form.serial) {
      setError("Device Type and Serial Number are required.");
      return;
    }

    const formData = new FormData();
    formData.append("type", form.type);
    formData.append("serial", form.serial);
    formData.append("assignedTo", form.assignedTo || "");
    if (form.image) formData.append("image", form.image);

    // Delegate to parent — backend upload handled there
    onAdd(formData);
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
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <h3 className="text-lg font-semibold text-gray-900">Add Device</h3>
          <button onClick={onClose} className="text-slate-600 hover:text-slate-800">
            ✕
          </button>
        </div>

        {/* Body */}
        <form
          onSubmit={handleSubmit}
          className="p-6 space-y-5 overflow-y-auto h-[calc(100%-64px)]"
        >
          {error && (
            <div className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded">{error}</div>
          )}

          {/* Device Type */}
          <div>
            <label className="block text-sm text-gray-600 mb-1">Device Type</label>
            <input
              name="type"
              value={form.type}
              onChange={handleChange}
              placeholder="Laptop, Camera, etc."
              className="w-full border border-slate-200 px-3 py-2 text-sm"
              disabled={loading}
            />
          </div>

          {/* Serial Number */}
          <div>
            <label className="block text-sm text-gray-600 mb-1 flex justify-between items-center">
              <span>Serial Number</span>
              <button
                type="button"
                onClick={() => setScanning((s) => !s)}
                className="text-blue-600 text-xs hover:underline"
              >
                {scanning ? "Stop Scanning" : "Scan Barcode"}
              </button>
            </label>

            <input
              name="serial"
              value={form.serial}
              onChange={handleChange}
              placeholder="e.g., SN12345"
              className="w-full border border-slate-200 px-3 py-2 text-sm mb-2"
              disabled={loading}
            />

            {scanning && (
              <div className="relative border border-slate-200 rounded-md overflow-hidden">
                <BarcodeScannerComponent
                  width="100%"
                  height={200}
                  onUpdate={handleBarcodeDetected}
                />
              </div>
            )}
          </div>

          {/* Assigned To */}
          <div>
            <label className="block text-sm text-gray-600 mb-1">
              Assigned To (Optional)
            </label>
            <input
              name="assignedTo"
              value={form.assignedTo}
              onChange={handleChange}
              placeholder="Employee / Project"
              className="w-full border border-slate-200 px-3 py-2 text-sm"
              disabled={loading}
            />
          </div>

          {/* Photo Capture */}
          <div>
            <label className="block text-sm text-gray-600 mb-1 flex justify-between items-center">
              <span>Device Image (Optional)</span>
              <button
                type="button"
                onClick={handleCapturePhoto}
                className="text-blue-600 text-xs hover:underline"
              >
                Capture Photo
              </button>
            </label>

            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              width="100%"
              height="200"
              className="rounded-md border border-slate-200"
              onCanPlay={(e) => {
                if (navigator.mediaDevices.getUserMedia) {
                  navigator.mediaDevices
                    .getUserMedia({ video: true })
                    .then((stream) => {
                      e.target.srcObject = stream;
                    });
                }
              }}
            />

            {photoPreview && (
              <div className="mt-3">
                <img
                  src={photoPreview}
                  alt="Captured Device"
                  className="w-full rounded-md border border-slate-200"
                />
              </div>
            )}
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`px-4 py-2 text-sm font-semibold text-white ${
                loading ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
              }`}
              disabled={loading}
            >
              {loading ? "Creating..." : "Create Device"}
            </button>
          </div>
        </form>
      </aside>
    </div>
  );
}
