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
  Shield,
  Search,
  Filter,
  Download,
  AlertTriangle,
  Truck
} from "lucide-react";
import toast from "react-hot-toast";
import { useUser } from "../../context/UserContext";
import axios from "axios";

const RMAList = () => {
  const navigate = useNavigate();
  const { user, isAdmin } = useUser();
  const [rmaRequests, setRmaRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRMA, setSelectedRMA] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");

  const api = axios.create({
    baseURL: `${import.meta.env.VITE_BACKEND_URL}/api`,
    headers: { "Content-Type": "application/json" },
  });

  useEffect(() => {
    fetchRMARequests();
    
    // Listen for real-time notifications
    if (window.socket) {
      const handleRMANotification = (data) => {
        console.log("🔔 RMA Notification received:", data);
        if (data.type?.includes('rma')) {
          toast.success(`RMA Update: ${data.message}`, {
            duration: 5000,
          });
          // Refresh the list after notification
          setTimeout(() => {
            fetchRMARequests();
          }, 1000);
        }
      };

      window.socket.on("notification", handleRMANotification);
      window.socket.on("admin:newRMA", handleRMANotification);
      
      return () => {
        window.socket.off("notification", handleRMANotification);
        window.socket.off("admin:newRMA", handleRMANotification);
      };
    }
  }, [statusFilter, priorityFilter, typeFilter]);

  const fetchRMARequests = async () => {
    setLoading(true);
    try {
      const params = {};
      if (statusFilter) params.status = statusFilter;
      if (priorityFilter) params.priority = priorityFilter;
      if (typeFilter) params.rmaType = typeFilter;

      const response = await api.get("/rma", { params });
      
      if (response.data) {
        setRmaRequests(Array.isArray(response.data) ? response.data : []);
      }
    } catch (error) {
      console.error("Error fetching RMA requests:", error);
      toast.error("Failed to fetch RMA requests");
      setRmaRequests([]);
    } finally {
      setLoading(false);
    }
  };

  // Filter RMAs based on search query
  const filteredRMAs = rmaRequests.filter(rma => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      rma.rmaNumber?.toLowerCase().includes(query) ||
      rma.serialNumber?.toLowerCase().includes(query) ||
      rma.reportedBy?.toLowerCase().includes(query) ||
      rma.issueDescription?.toLowerCase().includes(query)
    );
  });

  const getStatusIcon = (status) => {
    switch (status) {
      case "pending_review": return <Clock className="h-4 w-4 text-yellow-500" />;
      case "approved": return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "rejected": return <XCircle className="h-4 w-4 text-red-500" />;
      case "in_transit_to_vendor": return <Truck className="h-4 w-4 text-blue-500" />;
      case "under_repair": return <RefreshCcw className="h-4 w-4 text-orange-500" />;
      case "completed": return <CheckCircle className="h-4 w-4 text-green-600" />;
      default: return <Package className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending_review": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "approved": return "bg-green-100 text-green-800 border-green-200";
      case "rejected": return "bg-red-100 text-red-800 border-red-200";
      case "in_transit_to_vendor": return "bg-blue-100 text-blue-800 border-blue-200";
      case "under_repair": return "bg-orange-100 text-orange-800 border-orange-200";
      case "completed": return "bg-green-100 text-green-800 border-green-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "critical": return "bg-red-100 text-red-700 border-red-200";
      case "high": return "bg-orange-100 text-orange-700 border-orange-200";
      case "medium": return "bg-blue-100 text-blue-700 border-blue-200";
      case "low": return "bg-gray-100 text-gray-700 border-gray-200";
      default: return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const viewDetails = async (rmaId) => {
    try {
      const response = await api.get(`/rma/${rmaId}`);
      setSelectedRMA(response.data);
      setShowModal(true);
    } catch (error) {
      console.error("Error fetching RMA details:", error);
      toast.error("Failed to fetch RMA details");
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="text-sm text-gray-500 mt-2">Loading RMA requests...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Package className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">RMA Requests</h1>
              <p className="text-sm text-gray-500 mt-1">
                Manage your Return Merchandise Authorization requests
              </p>
            </div>
          </div>
          <button
            onClick={() => navigate("/rma/submit")}
            className="flex items-center gap-2 bg-blue-600 px-4 py-2 rounded-lg text-sm font-semibold text-white hover:bg-blue-700 transition-colors"
          >
            <Plus className="h-4 w-4" />
            Submit RMA
          </button>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by RMA number, serial number, or reporter..."
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Status</option>
            <option value="pending_review">Pending Review</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
            <option value="in_transit_to_vendor">In Transit</option>
            <option value="under_repair">Under Repair</option>
            <option value="completed">Completed</option>
          </select>

          {/* Priority Filter */}
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Priority</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="critical">Critical</option>
          </select>

          {/* Type Filter */}
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Types</option>
            <option value="repair">Repair</option>
            <option value="replacement">Replacement</option>
            <option value="refund">Refund</option>
          </select>

          <button
            onClick={fetchRMARequests}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2"
          >
            <RefreshCcw className="h-4 w-4" />
            Refresh
          </button>
        </div>
      </div>

      {/* RMA List */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-bold text-gray-800">
            RMA Requests ({filteredRMAs.length})
          </h3>
          {isAdmin() && (
            <button
              onClick={() => navigate("/rma/admin")}
              className="flex items-center gap-2 bg-red-600 px-3 py-2 rounded-lg text-sm font-medium text-white hover:bg-red-700 transition-colors"
            >
              <Shield className="h-4 w-4" />
              Admin Panel
            </button>
          )}
        </div>

        {filteredRMAs.length === 0 ? (
          <div className="text-center py-12">
            <Package className="mx-auto h-12 w-12 text-gray-400 mb-3" />
            <h3 className="text-base font-medium text-gray-700 mb-2">
              {searchQuery ? 'No RMAs match your search' : 'No RMA requests found'}
            </h3>
            <p className="text-sm text-gray-500 mb-4">
              {searchQuery 
                ? 'Try adjusting your search terms or filters.' 
                : 'Submit your first RMA request to get started.'
              }
            </p>
            {!searchQuery && (
              <button
                onClick={() => navigate("/rma/submit")}
                className="inline-flex items-center gap-2 bg-blue-600 px-4 py-2 rounded-lg text-sm font-semibold text-white hover:bg-blue-700 transition-colors"
              >
                <Plus className="h-4 w-4" />
                Submit RMA
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredRMAs.map((rma) => (
              <div
                key={rma._id}
                className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <FileText className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">{rma.rmaNumber}</h4>
                      <p className="text-xs text-gray-500">Serial: {rma.serialNumber}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 rounded-md text-xs font-medium border ${getStatusColor(rma.status)}`}>
                      {rma.status?.replace(/_/g, ' ').toUpperCase()}
                    </span>
                    <span className={`px-2 py-1 rounded-md text-xs font-medium border ${getPriorityColor(rma.priority)}`}>
                      {rma.priority?.toUpperCase()}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <User className="h-4 w-4" />
                    <span>{rma.reportedBy}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Package className="h-4 w-4" />
                    <span>{rma.rmaType?.charAt(0).toUpperCase() + rma.rmaType?.slice(1)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar className="h-4 w-4" />
                    <span>{formatDate(rma.createdAt)}</span>
                  </div>
                </div>

                {rma.issueDescription && (
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                    {rma.issueDescription}
                  </p>
                )}

                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(rma.status)}
                    <span className="text-xs text-gray-500">
                      Updated {formatDate(rma.updatedAt)}
                    </span>
                  </div>
                  <button
                    onClick={() => viewDetails(rma._id)}
                    className="flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm font-medium"
                  >
                    <Eye className="h-4 w-4" />
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {showModal && selectedRMA && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 rounded-t-xl">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-800">
                  RMA Details - {selectedRMA.rmaNumber}
                </h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition"
                >
                  <Plus className="h-6 w-6 rotate-45" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-gray-800 mb-3">Basic Information</h3>
                  <div className="space-y-2 text-sm">
                    <div><span className="font-medium">Serial Number:</span> {selectedRMA.serialNumber}</div>
                    <div><span className="font-medium">RMA Type:</span> {selectedRMA.rmaType}</div>
                    <div><span className="font-medium">Status:</span> 
                      <span className={`ml-2 px-2 py-1 rounded text-xs ${getStatusColor(selectedRMA.status)}`}>
                        {selectedRMA.status?.replace(/_/g, ' ').toUpperCase()}
                      </span>
                    </div>
                    <div><span className="font-medium">Priority:</span> 
                      <span className={`ml-2 px-2 py-1 rounded text-xs ${getPriorityColor(selectedRMA.priority)}`}>
                        {selectedRMA.priority?.toUpperCase()}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-800 mb-3">Contact Information</h3>
                  <div className="space-y-2 text-sm">
                    <div><span className="font-medium">Reported By:</span> {selectedRMA.reportedBy}</div>
                    <div><span className="font-medium">Email:</span> {selectedRMA.reportedByEmail || 'N/A'}</div>
                    <div><span className="font-medium">Phone:</span> {selectedRMA.reportedByPhone || 'N/A'}</div>
                    <div><span className="font-medium">Created:</span> {formatDate(selectedRMA.createdAt)}</div>
                  </div>
                </div>
              </div>

              {/* Issue Description */}
              <div>
                <h3 className="font-semibold text-gray-800 mb-3">Issue Description</h3>
                <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                  {selectedRMA.issueDescription || 'No description provided'}
                </p>
              </div>

              {/* Additional Info */}
              {(selectedRMA.reason || selectedRMA.description) && (
                <div>
                  <h3 className="font-semibold text-gray-800 mb-3">Additional Information</h3>
                  <div className="space-y-2 text-sm">
                    {selectedRMA.reason && (
                      <div><span className="font-medium">Reason:</span> {selectedRMA.reason}</div>
                    )}
                    {selectedRMA.description && (
                      <div><span className="font-medium">Additional Notes:</span> {selectedRMA.description}</div>
                    )}
                  </div>
                </div>
              )}

              {/* Status History */}
              {selectedRMA.statusHistory && selectedRMA.statusHistory.length > 0 && (
                <div>
                  <h3 className="font-semibold text-gray-800 mb-3">Status History</h3>
                  <div className="space-y-2">
                    {selectedRMA.statusHistory.map((history, index) => (
                      <div key={index} className="flex items-center gap-3 text-sm p-2 bg-gray-50 rounded">
                        {getStatusIcon(history.status)}
                        <span className="font-medium">{history.status?.replace(/_/g, ' ')}</span>
                        <span className="text-gray-500">by {history.updatedBy}</span>
                        <span className="text-gray-400 text-xs ml-auto">{formatDate(history.timestamp)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RMAList;