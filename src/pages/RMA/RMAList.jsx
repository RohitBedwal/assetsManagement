import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Plus, 
  Eye, 
  Clock, 
  CheckCircle, 
  XCircle, 
  RefreshCcw,
  Package,
  FileText,
  Calendar,
  User,
  Shield
} from "lucide-react";
import toast from "react-hot-toast";
import { useUser } from "../../context/UserContext";

const API_URL = import.meta.env.VITE_BACKEND_URL;

const RMAList = () => {
  const navigate = useNavigate();
  const { user, isAdmin } = useUser();
  const [rmaRequests, setRmaRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRMA, setSelectedRMA] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Temporary admin check for testing - remove this in production
  const isAdminForTesting = () => {
    return isAdmin() || user?.name === 'admin' || user?.email === 'admin@example.com';
  };

  useEffect(() => {
    fetchMyRMARequests();
    
    // Listen for socket events related to RMA
    if (window.socket) {
      const handleRMANotification = (data) => {
        console.log("🔔 RMA Notification received:", data);
        if (data.type === 'rma_created' || data.type === 'rma_updated') {
          toast.success(`RMA ${data.type === 'rma_created' ? 'Created' : 'Updated'}: ${data.message}`, {
            duration: 5000,
          });
          // Refresh the list after a short delay
          setTimeout(() => {
            fetchMyRMARequests();
          }, 1000);
        }
      };

      window.socket.on('notification', handleRMANotification);
      window.socket.on('rma-created', handleRMANotification);
      window.socket.on('rma-updated', handleRMANotification);

      return () => {
        if (window.socket) {
          window.socket.off('notification', handleRMANotification);
          window.socket.off('rma-created', handleRMANotification);
          window.socket.off('rma-updated', handleRMANotification);
        }
      };
    }
  }, [user]);

  const fetchMyRMARequests = async () => {
    try {
      const token = localStorage.getItem("authToken");
      
      if (!token) {
        toast.error("Authentication token not found");
        navigate("/login");
        return;
      }

      console.log("Fetching RMA requests from:", `${API_URL}/api/rma/my-requests`);
      console.log("User info:", user);
      console.log("Is Admin:", isAdmin());
      console.log("Is Admin For Testing:", isAdminForTesting());

      const response = await fetch(`${API_URL}/api/rma/my-requests`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      console.log("Response status:", response.status);
      const data = await response.json();
      console.log("Full API Response:", data);
      
      if (response.ok) {
        const requests = data.requests || data.data || data.rmas || [];
        const requestsArray = Array.isArray(requests) ? requests : [];
        setRmaRequests(requestsArray);
        console.log(`✅ Loaded ${requestsArray.length} RMA requests for user:`, user?.name || user?.email);
        console.log('RMA Requests:', requestsArray);
        
        // If admin and no requests found, let's also try fetching all requests
        if (isAdminForTesting() && requestsArray.length === 0) {
          console.log("🔍 Admin user with no personal requests, checking all requests...");
          fetchAllRequestsForAdmin();
        }
      } else {
        if (response.status === 401) {
          toast.error("Session expired. Please login again.");
          localStorage.removeItem("authToken");
          localStorage.removeItem("userInfo");
          navigate("/login");
        } else {
          toast.error(data.message || "Failed to fetch RMA requests");
          console.error("❌ API Error:", data);
        }
      }
    } catch (error) {
      console.error("❌ Error fetching RMA requests:", error);
      toast.error("Network error. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  // Additional function to fetch all requests if user is admin and has no personal requests
  const fetchAllRequestsForAdmin = async () => {
    try {
      const token = localStorage.getItem("authToken");
      console.log("🔍 Admin: Attempting to fetch all RMA requests...");
      
      const response = await fetch(`${API_URL}/api/rma/admin/all`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();
      console.log("Admin - All requests response:", data);
      
      if (response.ok) {
        const allRequests = data.requests || data.data || data.rmas || [];
        const allRequestsArray = Array.isArray(allRequests) ? allRequests : [];
        console.log(`📋 Found ${allRequestsArray.length} total RMA requests in system`);
        if (allRequestsArray.length > 0) {
          toast.info(`Found ${allRequestsArray.length} RMA requests in the system. Showing all requests as admin.`);
          setRmaRequests(allRequestsArray);
        }
      }
    } catch (error) {
      console.error("Error fetching all RMA requests:", error);
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { bg: "bg-yellow-100", text: "text-yellow-800", icon: Clock },
      approved: { bg: "bg-green-100", text: "text-green-800", icon: CheckCircle },
      rejected: { bg: "bg-red-100", text: "text-red-800", icon: XCircle },
      processing: { bg: "bg-blue-100", text: "text-blue-800", icon: RefreshCcw },
      completed: { bg: "bg-gray-100", text: "text-gray-800", icon: CheckCircle },
    };

    const config = statusConfig[status] || statusConfig.pending;
    const Icon = config.icon;

    return (
      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
        <Icon className="h-3 w-3" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCcw className="h-12 w-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading your RMA requests...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div className="mb-4 sm:mb-0">
              <h1 className="text-2xl font-bold text-gray-900">My RMA Requests</h1>
              <p className="mt-1 text-sm text-gray-600">
                Track your return merchandise authorization requests
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={fetchMyRMARequests}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <RefreshCcw className="h-4 w-4 mr-2" />
                Refresh
              </button>
              <button
                onClick={() => navigate("/rma/submit")}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <Plus className="h-4 w-4 mr-2" />
                New RMA Request
              </button>
            </div>
          </div>
        </div>

        {/* RMA Requests List */}
        {rmaRequests.length === 0 ? (
          <div className="bg-white shadow-sm rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">RMA Requests (0)</h3>
            </div>
            <div className="text-center py-12">
              <Package className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No RMA requests found</h3>
              <p className="mt-1 text-sm text-gray-500">
                You haven't submitted any RMA requests yet.
              </p>
              <div className="mt-6">
                <button
                  onClick={() => navigate("/rma/submit")}
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Submit New RMA Request
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white shadow-sm rounded-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">RMA Requests ({rmaRequests.length})</h3>
            </div>
            <div className="divide-y divide-gray-200">
              {Array.isArray(rmaRequests) && rmaRequests.length > 0 ? rmaRequests.map((rma) => (
                <div key={rma._id} className="px-6 py-4 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
                            <Package className="h-5 w-5 text-blue-600" />
                          </div>
                        </div>
                        <div className="ml-4 flex-1 min-w-0">
                          <div className="flex items-center">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {rma.serialNumber}
                            </p>
                            <div className="ml-2 flex-shrink-0">
                              {getStatusBadge(rma.status)}
                            </div>
                          </div>
                          <div className="mt-1 flex items-center text-sm text-gray-500">
                            <span>Invoice: {rma.invoiceNumber}</span>
                            <span className="mx-2">•</span>
                            <span>PO: {rma.poNumber}</span>
                            {rma.reason && (
                              <>
                                <span className="mx-2">•</span>
                                <span>Reason: {rma.reason}</span>
                              </>
                            )}
                          </div>
                          <div className="mt-1 text-xs text-gray-400">
                            <Calendar className="inline h-3 w-3 mr-1" />
                            {new Date(rma.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => {
                          setSelectedRMA(rma);
                          setShowModal(true);
                        }}
                        className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        <Eye className="h-3 w-3 mr-1" />
                        View
                      </button>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mt-4">
                    <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
                      <span>Progress</span>
                      <span className="font-medium">
                        {rma.status === "completed" ? "100%" : 
                         rma.status === "processing" ? "75%" : 
                         rma.status === "approved" ? "50%" : 
                         rma.status === "rejected" ? "0%" : "25%"}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                      <div
                        className={`h-1.5 rounded-full transition-all ${
                          rma.status === "completed" ? "bg-green-500 w-full" :
                          rma.status === "processing" ? "bg-blue-500 w-3/4" :
                          rma.status === "approved" ? "bg-green-500 w-1/2" :
                          rma.status === "rejected" ? "bg-red-500 w-0" :
                          "bg-yellow-500 w-1/4"
                        }`}
                      />
                    </div>
                    <div className="flex justify-between mt-1 text-xs">
                      <span className={rma.status === "pending" || rma.status === "approved" || rma.status === "processing" || rma.status === "completed" ? "text-gray-700 font-medium" : "text-gray-400"}>Submitted</span>
                      <span className={rma.status === "approved" || rma.status === "processing" || rma.status === "completed" ? "text-gray-700 font-medium" : "text-gray-400"}>Approved</span>
                      <span className={rma.status === "processing" || rma.status === "completed" ? "text-gray-700 font-medium" : "text-gray-400"}>Processing</span>
                      <span className={rma.status === "completed" ? "text-gray-700 font-medium" : "text-gray-400"}>Completed</span>
                    </div>
                  </div>
                </div>
              )) : (
                <div className="px-6 py-12 text-center">
                  <Package className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No RMA requests</h3>
                  <p className="mt-1 text-sm text-gray-500">Unable to display RMA requests. Please try refreshing the page.</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && selectedRMA && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-800">RMA Request Details</h2>
                <button
                  onClick={() => {
                    setShowModal(false);
                    setSelectedRMA(null);
                  }}
                  className="text-gray-400 hover:text-gray-600 transition"
                >
                  <XCircle className="h-6 w-6" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Status */}
              <div className="text-center py-4 bg-gray-50 rounded-lg">
                {getStatusBadge(selectedRMA.status)}
              </div>

              {/* Details */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-gray-500">Serial Number</label>
                  <p className="text-sm font-medium text-gray-900 mt-1">{selectedRMA.serialNumber}</p>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500">Invoice Number</label>
                  <p className="text-sm font-medium text-gray-900 mt-1">{selectedRMA.invoiceNumber}</p>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500">PO Number</label>
                  <p className="text-sm font-medium text-gray-900 mt-1">{selectedRMA.poNumber}</p>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500">Submitted Date</label>
                  <p className="text-sm text-gray-900 mt-1">
                    {new Date(selectedRMA.createdAt).toLocaleString()}
                  </p>
                </div>
                {selectedRMA.reason && (
                  <div className="col-span-2">
                    <label className="text-xs font-medium text-gray-500">Reason</label>
                    <p className="text-sm text-gray-900 mt-1">{selectedRMA.reason}</p>
                  </div>
                )}
              </div>

              {/* Description */}
              {selectedRMA.description && (
                <div>
                  <label className="text-xs font-medium text-gray-500">Description</label>
                  <p className="text-sm text-gray-900 mt-1 p-3 bg-gray-50 rounded-lg">
                    {selectedRMA.description}
                  </p>
                </div>
              )}

              {/* Admin Notes */}
              {selectedRMA.adminNotes && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <label className="text-xs font-medium text-blue-700 mb-2 block">Admin Notes</label>
                  <p className="text-sm text-blue-900">{selectedRMA.adminNotes}</p>
                </div>
              )}

              {/* Attachments */}
              {selectedRMA.attachments && selectedRMA.attachments.length > 0 && (
                <div>
                  <label className="text-xs font-medium text-gray-500 mb-2 block">Attachments</label>
                  <div className="grid grid-cols-3 gap-3">
                    {selectedRMA.attachments.map((file, index) => (
                      <div key={index} className="border border-gray-200 rounded-lg p-2">
                        {file.type === "image" ? (
                          <img
                            src={`${API_URL}${file.url}`}
                            alt={`Attachment ${index + 1}`}
                            className="w-full h-24 object-cover rounded-md mb-2"
                          />
                        ) : (
                          <div className="w-full h-24 bg-red-50 rounded-md mb-2 flex items-center justify-center">
                            <FileText className="h-8 w-8 text-red-500" />
                          </div>
                        )}
                        <a
                          href={`${API_URL}${file.url}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-blue-600 hover:underline"
                        >
                          View File
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Timeline */}
              <div>
                <label className="text-xs font-medium text-gray-500 mb-3 block">Status Timeline</label>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className={`p-1.5 rounded-full ${selectedRMA.status ? "bg-blue-100" : "bg-gray-100"}`}>
                      <Clock className={`h-4 w-4 ${selectedRMA.status ? "text-blue-600" : "text-gray-400"}`} />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Request Submitted</p>
                      <p className="text-xs text-gray-500">{new Date(selectedRMA.createdAt).toLocaleString()}</p>
                    </div>
                  </div>
                  {(selectedRMA.status === "approved" || selectedRMA.status === "processing" || selectedRMA.status === "completed") && (
                    <div className="flex items-start gap-3">
                      <div className="p-1.5 rounded-full bg-green-100">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">Approved by Admin</p>
                        <p className="text-xs text-gray-500">{new Date(selectedRMA.updatedAt).toLocaleString()}</p>
                      </div>
                    </div>
                  )}
                  {selectedRMA.status === "rejected" && (
                    <div className="flex items-start gap-3">
                      <div className="p-1.5 rounded-full bg-red-100">
                        <XCircle className="h-4 w-4 text-red-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">Request Rejected</p>
                        <p className="text-xs text-gray-500">{new Date(selectedRMA.updatedAt).toLocaleString()}</p>
                      </div>
                    </div>
                  )}
                  {selectedRMA.status === "completed" && (
                    <div className="flex items-start gap-3">
                      <div className="p-1.5 rounded-full bg-gray-100">
                        <CheckCircle className="h-4 w-4 text-gray-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">Request Completed</p>
                        <p className="text-xs text-gray-500">{new Date(selectedRMA.updatedAt).toLocaleString()}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RMAList;
