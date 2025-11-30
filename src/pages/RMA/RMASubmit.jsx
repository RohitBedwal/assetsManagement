import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Upload, FileText, Image, Send, X, AlertCircle, ArrowLeft } from "lucide-react";
import toast from "react-hot-toast";
import axios from "axios";
import { useUser } from "../../context/UserContext";

const RMASubmit = () => {
  const navigate = useNavigate();
  const { user } = useUser(); // Get authenticated user
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    serialNumber: "",
    invoiceNumber: "",
    poNumber: "",
    rmaType: "repair",
    reason: "",
    issueDescription: "",
    description: "",
    reportedBy: "",
    reportedByEmail: "",
    reportedByPhone: "",
    priority: "medium",
  });

  // Auto-populate user fields when component loads
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        reportedBy: user.name || "",
        reportedByEmail: user.email || ""
      }));
    }
  }, [user]);

  // Redirect if not authenticated
  useEffect(() => {
    if (!user) {
      toast.error("Please log in to access RMA submission");
      navigate("/login");
    }
  }, [user, navigate]);
  const [files, setFiles] = useState([]);
  const [filePreviews, setFilePreviews] = useState([]);

  const api = axios.create({
    baseURL: `${import.meta.env.VITE_BACKEND_URL}/api`,
    headers: {
      Authorization: `Bearer ${localStorage.getItem("authToken")}`
    }
  });

  // Add request interceptor to handle dynamic auth token updates
  api.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem("authToken");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Add response interceptor to handle auth errors
  api.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        localStorage.removeItem("authToken");
        toast.error("Session expired. Please login again.");
        window.location.href = "/login";
      }
      return Promise.reject(error);
    }
  );

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
    
    // Ensure user is authenticated
    if (!user || !user.name || !user.email) {
      toast.error("Please log in to submit RMA requests");
      navigate("/login");
      return;
    }
    
    if (!formData.serialNumber || !formData.rmaType || !formData.issueDescription) {
      toast.error("Please fill in all required fields");
      return;
    }

    setLoading(true);

    try {
      const submitData = new FormData();
      
      // Add all form fields
      Object.keys(formData).forEach(key => {
        if (formData[key]) {
          submitData.append(key, formData[key]);
        }
      });

      console.log('📝 Submitting RMA with user data:', {
        user: user.name,
        email: user.email,
        serialNumber: formData.serialNumber,
        rmaType: formData.rmaType
      });

      // Add files with proper field names that match your backend
      files.forEach((file) => {
        // Determine file type and add accordingly
        if (file.type === 'application/pdf' && file.name.toLowerCase().includes('invoice')) {
          submitData.append("invoice", file);
        } else if (file.type === 'application/pdf' && (file.name.toLowerCase().includes('po') || file.name.toLowerCase().includes('purchase'))) {
          submitData.append("purchaseOrder", file);
        } else if (file.type.startsWith('image/')) {
          submitData.append("photos", file);
        } else {
          submitData.append("additionalDocs", file);
        }
      });

      console.log('Submitting RMA to backend...');
      const response = await api.post("/rma/submit", submitData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log('RMA submission response:', response.data);
      
      if (response.data.success || response.data.rma) {
        const rmaNumber = response.data.rma?.rmaNumber || 'New RMA';
        toast.success(`${rmaNumber} submitted successfully! You will be notified once reviewed.`);
        navigate("/rma/list");
      } else {
        toast.error("RMA submitted but no confirmation received");
      }
    } catch (error) {
      console.error("RMA submission error:", error);
      
      if (error.response?.status === 404) {
        toast.error("RMA submission endpoint not found. Please check backend.");
      } else if (error.response?.status === 400) {
        toast.error(error.response.data?.message || "Invalid data. Please check all fields.");
      } else if (error.code === 'ECONNREFUSED') {
        toast.error("Backend server is not running. Please start the backend.");
      } else {
        toast.error(error.response?.data?.message || "Failed to submit RMA. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="h-5 w-5 text-gray-600" />
          </button>
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
      </div>      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="space-y-6">
          {/* Basic Information Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

            {/* RMA Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                RMA Type <span className="text-red-500">*</span>
              </label>
              <select
                name="rmaType"
                value={formData.rmaType}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              >
                <option value="repair">Repair</option>
                <option value="replacement">Replacement</option>
                <option value="refund">Refund</option>
              </select>
            </div>

            {/* Invoice Number */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Invoice Number
              </label>
              <input
                type="text"
                name="invoiceNumber"
                value={formData.invoiceNumber}
                onChange={handleInputChange}
                placeholder="Enter invoice number (optional)"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              />
            </div>

            {/* PO Number */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                PO Number
              </label>
              <input
                type="text"
                name="poNumber"
                value={formData.poNumber}
                onChange={handleInputChange}
                placeholder="Enter purchase order number (optional)"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              />
            </div>

            {/* Reported By */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Reported By <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="reportedBy"
                value={formData.reportedBy}
                onChange={handleInputChange}
                required
                readOnly
                placeholder="Your full name"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition bg-gray-50"
              />
              <p className="text-xs text-gray-500 mt-1">Automatically filled from your account</p>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                name="reportedByEmail"
                value={formData.reportedByEmail}
                onChange={handleInputChange}
                required
                readOnly
                placeholder="Your email address"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition bg-gray-50"
              />
              <p className="text-xs text-gray-500 mt-1">Automatically filled from your account</p>
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                name="reportedByPhone"
                value={formData.reportedByPhone}
                onChange={handleInputChange}
                placeholder="Your phone number"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              />
            </div>

            {/* Priority */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Priority
              </label>
              <select
                name="priority"
                value={formData.priority}
                onChange={handleInputChange}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
            </div>
          </div>

          {/* Reason */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Reason for RMA
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
              <option value="Hardware Failure">Hardware Failure</option>
              <option value="Software Issues">Software Issues</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Issue Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Issue Description <span className="text-red-500">*</span>
            </label>
            <textarea
              name="issueDescription"
              value={formData.issueDescription}
              onChange={handleInputChange}
              required
              rows={4}
              placeholder="Describe the specific issue with the device..."
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition resize-none"
            />
          </div>

          {/* Additional Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Additional Notes
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={3}
              placeholder="Any additional information or notes..."
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition resize-none"
            />
          </div>

            {/* File Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Attachments (Invoice, PO, Photos)
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
                  <li>Upload clear photos of the defective item (optional but recommended)</li>
                  <li>Include invoice and PO documents if available</li>
                  <li>Admin will review your request within 24-48 hours</li>
                  <li>You will receive notifications about status updates</li>
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
  );
};

export default RMASubmit;
