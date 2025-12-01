// src/pages/devices/Category/AddDeviceDrawer.jsx
import React, { useState, useEffect } from "react";

export default function AddDeviceDrawer({ open, onClose, onAdd, loading, editingDevice }) {
  const [form, setForm] = useState({
    sku: "",
    serial: "",
    status: "inward",
    projectName: "",
    purchaseDate: "",
    warrantyEndDate: "",
    amcExpiryDate: "",
    vendor: "",
    purchaseOrderNumber: "",
    invoiceNumber: "",
    installedAtSite: "",
    ipAddress: "",
    macAddress: "",
    firmwareOSVersion: "",
    rackId: "",
    rackUnit: "",
    dataCenter: "",
    notes: "",
  });

  const [error, setError] = useState("");

  // Populate form when editing device is set
  useEffect(() => {
    if (editingDevice) {
      // Editing existing device
      setForm({
        sku: editingDevice.sku || "",
        serial: editingDevice.serial || "",
        status: editingDevice.status || "inward",
        projectName: editingDevice.projectName || "",
        purchaseDate: editingDevice.purchaseDate?.split('T')[0] || "",
        warrantyEndDate: editingDevice.warrantyEndDate?.split('T')[0] || "",
        amcExpiryDate: editingDevice.amcExpiryDate?.split('T')[0] || "",
        vendor: editingDevice.vendor || "",
        purchaseOrderNumber: editingDevice.purchaseOrderNumber || "",
        invoiceNumber: editingDevice.invoiceNumber || "",
        installedAtSite: editingDevice.installedAtSite || "",
        ipAddress: editingDevice.ipAddress || "",
        macAddress: editingDevice.macAddress || "",
        firmwareOSVersion: editingDevice.firmwareOSVersion || "",
        rackId: editingDevice.rackId || "",
        rackUnit: editingDevice.rackUnit || "",
        dataCenter: editingDevice.dataCenter || "",
        notes: editingDevice.notes || "",
      });
    }
  }, [editingDevice]);

  // Clear form when drawer closes after successful submission
  useEffect(() => {
    if (!open && !editingDevice) {
      // Drawer closed and no device being edited - reset form
      setForm({
        sku: "",
        serial: "",
        status: "inward",
        projectName: "",
        purchaseDate: "",
        warrantyEndDate: "",
        amcExpiryDate: "",
        vendor: "",
        purchaseOrderNumber: "",
        invoiceNumber: "",
        installedAtSite: "",
        ipAddress: "",
        macAddress: "",
        firmwareOSVersion: "",
        rackId: "",
        rackUnit: "",
        dataCenter: "",
        notes: "",
      });
      setError("");
    }
  }, [open, editingDevice]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const numberFields = ["rackUnit"];
    
    // Handle number fields
    if (numberFields.includes(name)) {
      return setForm((prev) => ({ ...prev, [name]: value ? Number(value) : "" }));
    }
    
    // Clear outward-related fields when status changes to inward
    if (name === "status" && value === "inward") {
      setForm((prev) => ({
        ...prev,
        [name]: value,
        // Clear outward-specific fields
        projectName: "",
        assignedDate: "",
        installedAtSite: "",
        ipAddress: "",
        macAddress: "",
        firmwareOSVersion: "",
        rackId: "",
        rackUnit: "",
        dataCenter: "",
      }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
    
    setError("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.sku.trim() || !form.serial.trim()) {
      setError("SKU and Serial Number are required!");
      return;
    }
    
    // Automatically set assignedDate when status is outward
    const formData = { ...form };
    if (form.status === "outward" && (!editingDevice || editingDevice.status !== "outward")) {
      formData.assignedDate = new Date().toISOString();
    }
    
    // Call parent handler - parent will close drawer and reset editingDevice
    onAdd(formData);
  };

  return (
    <div className={`fixed inset-0 z-50 transition-opacity ${open ? "" : "pointer-events-none"}`}>
      
      {/* Background overlay */}
      <div
        onClick={onClose}
        className={`absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      />

      {/* Drawer */}
      <aside
        className={`absolute right-0 top-0 h-full w-full max-w-4xl bg-white shadow-2xl transition-transform duration-300 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 px-8 py-4 bg-gradient-to-r from-blue-50 to-indigo-50">
          <div>
            <h3 className="text-xl font-bold text-gray-900">{editingDevice ? 'Edit Device' : 'Add New Device'}</h3>
            <p className="text-sm text-gray-600 mt-0.5">{editingDevice ? 'Update the device information below' : 'Fill in the device information below'}</p>
          </div>
          <button 
            onClick={onClose} 
            className="text-gray-400 hover:text-gray-600 hover:bg-white rounded-lg p-2 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col h-[calc(100%-80px)]">
          <div className="p-8 space-y-6 overflow-y-auto flex-1">
            {error && (
              <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 px-4 py-3 rounded-lg border border-red-100">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                {error}
              </div>
            )}

            {/* Basic Information */}
            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <span className="w-1 h-4 bg-blue-600 rounded-full"></span>
                Basic Information
              </h4>
              <div className="grid grid-cols-2 gap-4">
                <InputField label="SKU" name="sku" value={form.sku} onChange={handleChange} required />
                <InputField label="Serial Number" name="serial" value={form.serial} onChange={handleChange} required />
                <Dropdown
                  label="Status"
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                  options={["inward", "outward"]}
                  required
                />
                {form.status === "outward" && (
                  <InputField label="Project Name" name="projectName" value={form.projectName} onChange={handleChange} />
                )}
              </div>
            </div>

            {/* Purchase & Vendor Details - Only for inward status */}
            {form.status === "inward" && (
              <div>
                <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <span className="w-1 h-4 bg-green-600 rounded-full"></span>
                  Purchase & Vendor Details
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <InputField label="Vendor" name="vendor" value={form.vendor} onChange={handleChange} />
                  <InputField label="PO Number" name="purchaseOrderNumber" value={form.purchaseOrderNumber} onChange={handleChange} />
                  <InputField label="Invoice Number" name="invoiceNumber" value={form.invoiceNumber} onChange={handleChange} />
                  <DateField label="Purchase Date" name="purchaseDate" value={form.purchaseDate} onChange={handleChange} />
                  <DateField label="Warranty End Date" name="warrantyEndDate" value={form.warrantyEndDate} onChange={handleChange} />
                  <DateField label="AMC Expiry Date" name="amcExpiryDate" value={form.amcExpiryDate} onChange={handleChange} />
                </div>
              </div>
            )}

            {/* Location & Installation - Only for outward status */}
            {form.status === "outward" && (
              <div>
                <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <span className="w-1 h-4 bg-blue-600 rounded-full"></span>
                  Location & Installation
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <InputField label="Installed At" name="installedAtSite" value={form.installedAtSite} onChange={handleChange} />
                  <InputField label="Data Center" name="dataCenter" value={form.dataCenter} onChange={handleChange} />
                  <InputField label="Rack ID" name="rackId" value={form.rackId} onChange={handleChange} />
                  <InputField label="Rack Unit" name="rackUnit" value={form.rackUnit} onChange={handleChange} />
                </div>
              </div>
            )}

            {/* Network Configuration - Only for outward status */}
            {form.status === "outward" && (
              <div>
                <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <span className="w-1 h-4 bg-blue-600 rounded-full"></span>
                  Network Configuration
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <InputField label="IP Address" name="ipAddress" value={form.ipAddress} onChange={handleChange} />
                  <InputField label="MAC Address" name="macAddress" value={form.macAddress} onChange={handleChange} />
                  <InputField label="Firmware / OS Version" name="firmwareOSVersion" value={form.firmwareOSVersion} onChange={handleChange} />
                </div>
              </div>
            )}

            {/* Notes */}
            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <span className="w-1 h-4 bg-gray-600 rounded-full"></span>
                Additional Notes
              </h4>
              <textarea
                name="notes"
                value={form.notes}
                onChange={handleChange}
                placeholder="Add any additional notes or comments..."
                rows="4"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 px-8 py-4 border-t border-gray-200 bg-gray-50">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className={`px-6 py-2.5 text-sm font-semibold text-white rounded-lg transition-all ${
                loading ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700 shadow-sm"
              }`}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {editingDevice ? 'Updating...' : 'Saving...'}
                </span>
              ) : (
                `${editingDevice ? 'Update Device' : 'Add Device'}`
              )}
            </button>
          </div>
        </form>
      </aside>
    </div>
  );
}

// Reusable components
function InputField({ label, name, value, onChange, required }) {
  return (
    <div>
      <label className="text-sm font-medium block text-gray-700 mb-2">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <input
        name={name}
        value={value}
        required={required}
        onChange={onChange}
        className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
      />
    </div>
  );
}

function Dropdown({ label, name, value, onChange, options, required }) {
  return (
    <div>
      <label className="text-sm font-medium block text-gray-700 mb-2">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <select
        name={name}
        value={value}
        required={required}
        onChange={onChange}
        className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all capitalize"
      >
        {options.map((o) => (
          <option key={o} value={o} className="capitalize">{o}</option>
        ))}
      </select>
    </div>
  );
}

function DateField({ label, name, value, onChange }) {
  return (
    <div>
      <label className="text-sm font-medium block text-gray-700 mb-2">{label}</label>
      <input
        type="date"
        name={name}
        value={value}
        onChange={onChange}
        className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
      />
    </div>
  );
}
