import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Upload, FileText, Image, Send, X, AlertCircle } from "lucide-react";
import toast from "react-hot-toast";

const API_URL = import.meta.env.VITE_BACKEND_URL;

const RMASubmit = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    serialNumber: "",
    invoiceNumber: "",
    poNumber: "",
    reason: "",
    description: "",
  });
  const [files, setFiles] = useState([]);
  const [filePreviews, setFilePreviews] = useState([]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    
    // Validate file types
    const validFiles = selectedFiles.filter((file) => {
      const fileType = file.type;
      const isValid = 
        fileType.startsWith("image/") || 
        fileType === "application/pdf";
      
      if (!isValid) {
        toast.error(`Invalid file type: ${file.name}. Only images and PDFs are allowed.`);
      }
      return isValid;
    });

    // Validate file size (max 10MB per file)
    const validSizedFiles = validFiles.filter((file) => {
      const maxSize = 10 * 1024 * 1024; // 10MB
      if (file.size > maxSize) {
        toast.error(`File too large: ${file.name}. Max size is 10MB.`);
        return false;
      }
      return true;
    });

    setFiles((prev) => [...prev, ...validSizedFiles]);

    // Create previews
    validSizedFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setFilePreviews((prev) => [
          ...prev,
          {
            name: file.name,
            type: file.type,
            url: e.target.result,
          },
        ]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeFile = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
    setFilePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.serialNumber || !formData.invoiceNumber || !formData.poNumber) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (files.length === 0) {
      toast.error("Please upload at least one file (invoice, PO, or product photo)");
      return;
    }

    setLoading(true);

    try {
      const submitData = new FormData();
      submitData.append("serialNumber", formData.serialNumber);
      submitData.append("invoiceNumber", formData.invoiceNumber);
      submitData.append("poNumber", formData.poNumber);
      submitData.append("reason", formData.reason);
      submitData.append("description", formData.description);

      files.forEach((file) => {
        submitData.append("attachments", file);
      });

      const token = localStorage.getItem("authToken");
      const response = await fetch(`${API_URL}/api/rma/submit`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: submitData,
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("RMA request submitted successfully!");
        navigate("/rma/list");
      } else {
        toast.error(data.message || "Failed to submit RMA request");
      }
    } catch (error) {
      console.error("RMA submission error:", error);
      toast.error("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <FileText className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Submit RMA Request</h1>
              <p className="text-sm text-gray-500 mt-1">
                Return Merchandise Authorization - Submit your return request
              </p>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="space-y-6">
            {/* Serial Number */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Serial Number <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="serialNumber"
                value={formData.serialNumber}
                onChange={handleInputChange}
                required
                placeholder="Enter device serial number"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              />
            </div>

            {/* Invoice Number */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Invoice Number <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="invoiceNumber"
                value={formData.invoiceNumber}
                onChange={handleInputChange}
                required
                placeholder="Enter invoice number"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              />
            </div>

            {/* PO Number */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                PO Number <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="poNumber"
                value={formData.poNumber}
                onChange={handleInputChange}
                required
                placeholder="Enter purchase order number"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              />
            </div>

            {/* Reason */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Reason for Return
              </label>
              <select
                name="reason"
                value={formData.reason}
                onChange={handleInputChange}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              >
                <option value="">Select a reason</option>
                <option value="Defective">Defective/Not Working</option>
                <option value="Damaged">Damaged During Shipping</option>
                <option value="Wrong Item">Wrong Item Received</option>
                <option value="Performance Issues">Performance Issues</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
                placeholder="Provide detailed description of the issue..."
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition resize-none"
              />
            </div>

            {/* File Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Attachments (Invoice, PO, Photos) <span className="text-red-500">*</span>
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition">
                <input
                  type="file"
                  id="file-upload"
                  multiple
                  accept="image/*,.pdf"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <label
                  htmlFor="file-upload"
                  className="cursor-pointer flex flex-col items-center gap-2"
                >
                  <Upload className="h-10 w-10 text-gray-400" />
                  <p className="text-sm text-gray-600">
                    <span className="font-semibold text-blue-600">Click to upload</span> or drag and drop
                  </p>
                  <p className="text-xs text-gray-500">PNG, JPG, PDF up to 10MB each</p>
                </label>
              </div>

              {/* File Previews */}
              {filePreviews.length > 0 && (
                <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-4">
                  {filePreviews.map((file, index) => (
                    <div key={index} className="relative group">
                      <div className="border border-gray-200 rounded-lg p-3 hover:shadow-md transition">
                        {file.type.startsWith("image/") ? (
                          <img
                            src={file.url}
                            alt={file.name}
                            className="w-full h-32 object-cover rounded-md mb-2"
                          />
                        ) : (
                          <div className="w-full h-32 bg-red-50 rounded-md mb-2 flex items-center justify-center">
                            <FileText className="h-12 w-12 text-red-500" />
                          </div>
                        )}
                        <p className="text-xs text-gray-600 truncate">{file.name}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeFile(index)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-lg hover:bg-red-600 transition"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Info Alert */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex gap-3">
              <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-blue-800">
                <p className="font-medium mb-1">Important Information:</p>
                <ul className="list-disc list-inside space-y-1 text-blue-700">
                  <li>Please ensure all information is accurate</li>
                  <li>Upload clear photos of the defective item</li>
                  <li>Include invoice and PO documents</li>
                  <li>Admin will review your request within 24-48 hours</li>
                </ul>
              </div>
            </div>

            {/* Submit Buttons */}
            <div className="flex gap-4 pt-4">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className={`flex-1 px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition flex items-center justify-center gap-2 ${
                  loading ? "opacity-70 cursor-not-allowed" : ""
                }`}
              >
                <Send className="h-5 w-5" />
                {loading ? "Submitting..." : "Submit RMA Request"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RMASubmit;
