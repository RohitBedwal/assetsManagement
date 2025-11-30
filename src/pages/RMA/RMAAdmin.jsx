import React, { useState, useEffect } from "react";
import { 
  Eye, 
  CheckCircle, 
  XCircle, 
  Clock, 
  FileText, 
  Download,
  Filter,
  Search,
  RefreshCcw,
  Package,
  Trash2,
  Upload,
  BarChart3,
  Edit,
  AlertTriangle
} from "lucide-react";
import toast from "react-hot-toast";
import { useUser } from "../../context/UserContext";
import axios from "axios";

const RMAAdmin = () => {
  const { user, isAdmin, loading: userLoading } = useUser();
  const [rmaRequests, setRmaRequests] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [rmaStats, setRmaStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRMA, setSelectedRMA] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [adminNotes, setAdminNotes] = useState("");

  const api = axios.create({
    baseURL: `${import.meta.env.VITE_BACKEND_URL}/api`,
    headers: { 
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("authToken")}`
    },
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

  useEffect(() => {
    console.log('🔍 RMA Admin useEffect Debug:', {
      user,
      userLoading,
      hasUser: !!user,
      userRole: user?.role,
      userRoles: user?.roles,
      isAdminResult: isAdmin()
    });
    
    // Wait for user context to finish loading
    if (userLoading) {
      console.log('⏳ Waiting for user context to load...');
      return;
    }
    
    if (!user) {
      console.log('❌ No user found, denying access');
      toast.error("Please login to access admin panel.");
      setLoading(false);
      return;
    }
    
    if (isAdmin() || user) { // Temporarily allow any authenticated user
      console.log('✅ User has access (admin or authenticated), fetching data...');
      fetchAllData();
    } else {
      console.log('❌ User is not admin:', {
        userRole: user?.role,
        userRoles: user?.roles,
        isAdmin: user?.isAdmin
      });
      toast.error("Access denied. Admin privileges required.");
      setLoading(false);
    }
  }, [user, userLoading]);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      await Promise.all([
        fetchRMARequests(),
        fetchPendingRequests(),
        fetchRMAStats()
      ]);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load admin data');
    } finally {
      setLoading(false); // Always stop loading
    }
  };

  const fetchRMARequests = async () => {
    try {
      console.log('📋 Fetching all RMA requests from backend...');
      const response = await api.get('/rma');
      
      console.log('📋 All RMAs response:', response.data);
      
      if (response.data) {
        const rmas = Array.isArray(response.data) ? response.data : [];
        setRmaRequests(rmas);
        console.log(`📋 Found ${rmas.length} total RMAs`);
        
        // Debug: Show status breakdown
        if (rmas.length > 0) {
          const statusCounts = rmas.reduce((acc, rma) => {
            const status = rma.status || 'unknown';
            acc[status] = (acc[status] || 0) + 1;
            return acc;
          }, {});
          console.log('📊 RMA Status Breakdown:', statusCounts);
          
          const pendingCount = statusCounts.pending || 0;
          console.log(`🟡 Pending RMAs found in main fetch: ${pendingCount}`);
          
          if (pendingCount === 0) {
            console.log('⚠️ No pending RMAs found. All statuses:', Object.keys(statusCounts));
          }
        }
      }
    } catch (error) {
      console.error('❌ Error fetching RMA requests:', error);
      
      if (error.code === 'ECONNREFUSED') {
        console.log('Backend server not running');
        setRmaRequests([]);
      } else {
        toast.error(error.response?.data?.message || 'Failed to load RMA requests');
        setRmaRequests([]);
      }
    }
  };

  const fetchPendingRequests = async () => {
    try {
      console.log('🟡 Fetching pending RMAs from backend...');
      const response = await api.get('/rma/admin/pending');
      
      console.log('🟡 Pending RMAs response:', response.data);
      
      if (response.data) {
        const rmas = response.data.rmas || response.data || [];
        setPendingRequests(Array.isArray(rmas) ? rmas : []);
        
        console.log(`🟡 Found ${Array.isArray(rmas) ? rmas.length : 0} pending RMAs`);
        
        // Also check if backend endpoint works, fallback to local filtering
        if ((!rmas || rmas.length === 0) && rmaRequests.length > 0) {
          const localPending = rmaRequests.filter(rma => 
            rma.status === 'pending_review'
          );
          console.log(`🔄 Fallback local filter found ${localPending.length} pending RMAs`);
          if (localPending.length > 0) {
            setPendingRequests(localPending);
          }
        }
      }
    } catch (error) {
      console.error('❌ Error fetching pending requests:', error);
      
      if (error.response?.status === 401) {
        toast.error('Admin authentication required.');
      } else if (error.response?.status === 403) {
        toast.error('Admin access denied.');
      } else if (error.response?.status === 404) {
        console.log('⚠️ Pending endpoint not found, using local filter');
        // Fallback: filter from all RMAs for pending_review status
        const localPending = rmaRequests.filter(rma => 
          rma.status === 'pending_review'
        );
        setPendingRequests(localPending);
        console.log(`🔄 Local filter found ${localPending.length} pending RMAs`);
      } else if (error.code === 'ECONNREFUSED') {
        console.log('Backend server not running');
        setPendingRequests([]);
      } else {
        toast.error(error.response?.data?.message || 'Failed to fetch pending requests');
        setPendingRequests([]);
      }
    }
  };

  const fetchRMAStats = async () => {
    try {
      console.log('Fetching RMA statistics...');
      const response = await api.get('/rma/stats/overview');
      
      console.log('RMA stats response:', response.data);
      
      if (response.data) {
        setRmaStats(response.data.stats || response.data);
      }
    } catch (error) {
      console.error("Error fetching RMA stats:", error);
      
      // Don't show error toast for stats as it's supplementary data
      if (error.code !== 'ECONNREFUSED') {
        console.log('Stats endpoint not available, using calculated stats');
      }
    }
  };

  // Enhanced admin functions using specific API endpoints
  const approveRMA = async (rmaId) => {
    if (updateLoading) return; // Prevent multiple clicks
    
    setUpdateLoading(true);
    try {
      const approvalData = {
        approvedBy: user?.name || 'Admin User',
        notes: adminNotes || 'RMA approved by admin'
      };
      
      console.log('✅ Approving RMA:', rmaId, 'with data:', approvalData);
      
      const response = await api.put(`/rma/${rmaId}/approve`, approvalData);
      
      console.log('✅ Approval response:', response.data);
      
      // Backend returns the updated RMA directly on success
      if (response.data && response.status === 200) {
        const rmaNumber = response.data.rmaNumber || rmaId;
        toast.success(`RMA ${rmaNumber} approved successfully`);
        
        // Update local state immediately
        setRmaRequests(prevRequests => 
          prevRequests.map(rma => 
            rma._id === rmaId ? { ...rma, status: 'approved', updatedAt: new Date().toISOString() } : rma
          )
        );
        
        // Update selected RMA if it's the one being updated
        if (selectedRMA && selectedRMA._id === rmaId) {
          setSelectedRMA(prev => ({ ...prev, status: 'approved', updatedAt: new Date().toISOString() }));
        }
        
        // Update pending requests state
        setPendingRequests(prevPending => 
          prevPending.filter(rma => rma._id !== rmaId)
        );
        
        // Close modal and reset
        setShowModal(false);
        setSelectedRMA(null);
        setAdminNotes("");
      } else {
        console.error('❌ Unexpected response structure:', response.data);
        toast.error("Failed to approve RMA");
      }
    } catch (error) {
      console.error("❌ Error approving RMA:", error);
      
      if (error.response?.status === 404) {
        toast.error('RMA not found');
      } else if (error.response?.status === 400) {
        toast.error(error.response.data?.message || 'Invalid approval data');
      } else {
        toast.error(error.response?.data?.message || 'Failed to approve RMA');
      }
    } finally {
      setUpdateLoading(false);
    }
  };

  const rejectRMA = async (rmaId) => {
    if (updateLoading) return; // Prevent multiple clicks
    
    setUpdateLoading(true);
    try {
      const rejectionData = {
        rejectedBy: user?.name || 'Admin User',
        rejectionReason: adminNotes || 'No reason provided'
      };
      
      console.log('❌ Rejecting RMA:', rmaId, 'with reason:', adminNotes);
      
      const response = await api.put(`/rma/${rmaId}/reject`, rejectionData);
      
      console.log('❌ Rejection response:', response.data);
      
      // Backend returns the updated RMA directly on success
      if (response.data && response.status === 200) {
        const rmaNumber = response.data.rmaNumber || rmaId;
        toast.success(`RMA ${rmaNumber} rejected`);
        
        // Update local state immediately
        setRmaRequests(prevRequests => 
          prevRequests.map(rma => 
            rma._id === rmaId ? { ...rma, status: 'rejected', updatedAt: new Date().toISOString() } : rma
          )
        );
        
        // Update selected RMA if it's the one being updated
        if (selectedRMA && selectedRMA._id === rmaId) {
          setSelectedRMA(prev => ({ ...prev, status: 'rejected', updatedAt: new Date().toISOString() }));
        }
        
        // Update pending requests state
        setPendingRequests(prevPending => 
          prevPending.filter(rma => rma._id !== rmaId)
        );
        
        // Close modal and reset
        setShowModal(false);
        setSelectedRMA(null);
        setAdminNotes("");
      } else {
        console.error('❌ Unexpected response structure:', response.data);
        toast.error("Failed to reject RMA");
      }
    } catch (error) {
      console.error("❌ Error rejecting RMA:", error);
      
      if (error.response?.status === 404) {
        toast.error('RMA not found');
      } else if (error.response?.status === 400) {
        toast.error(error.response.data?.message || 'Invalid rejection data');
      } else {
        toast.error(error.response?.data?.message || 'Failed to reject RMA');
      }
    } finally {
      setUpdateLoading(false);
    }
  };

  const updateRMAStatus = async (rmaId, newStatus) => {
    if (updateLoading) return; // Prevent multiple clicks
    
    setUpdateLoading(true);
    try {
      console.log('🔄 Updating RMA status:', { rmaId, newStatus, updatedBy: user?.name || user?.email || 'Admin User' });
      
      const response = await api.put(`/rma/${rmaId}/status`, { 
        status: newStatus,
        updatedBy: user?.name || user?.email || 'Admin User',
        adminNotes: adminNotes || `Status updated to ${newStatus}`
      });

      console.log('✅ Status update response:', response.data);

      // Backend returns the updated RMA directly, not wrapped in success/rma
      if (response.data && response.status === 200) {
        toast.success(`RMA status updated to ${newStatus.replace(/_/g, ' ')}`);
        
        // Update the local state immediately for real-time UI update
        setRmaRequests(prevRequests => 
          prevRequests.map(rma => 
            rma._id === rmaId ? { ...rma, status: newStatus, updatedAt: new Date().toISOString() } : rma
          )
        );
        
        // Update selected RMA if it's the one being updated
        if (selectedRMA && selectedRMA._id === rmaId) {
          setSelectedRMA(prev => ({ ...prev, status: newStatus, updatedAt: new Date().toISOString() }));
        }
        
        // Update pending requests state
        setPendingRequests(prevPending => 
          prevPending.filter(rma => rma._id !== rmaId)
        );
        
        // Close modal and reset
        setShowModal(false);
        setSelectedRMA(null);
        setAdminNotes("");
      } else {
        console.error('❌ Unexpected response structure:', response.data);
        toast.error("Failed to update RMA status");
      }
    } catch (error) {
      console.error("❌ Error updating RMA status:", error);
      toast.error(error.response?.data?.message || "Failed to update RMA status");
    } finally {
      setUpdateLoading(false);
    }
  };

  const deleteRMA = async (rmaId) => {
    setUpdateLoading(true);
    try {
      const response = await api.delete(`/rma/${rmaId}`);

      const data = response.data;
      if (data.success) {
        toast.success("RMA deleted successfully");
        fetchAllData();
        setShowModal(false);
        setSelectedRMA(null);
        setShowDeleteConfirm(false);
      } else {
        toast.error(data.message || "Failed to delete RMA");
      }
    } catch (error) {
      console.error("Error deleting RMA:", error);
      toast.error(error.response?.data?.message || "Failed to delete RMA");
    } finally {
      setUpdateLoading(false);
    }
  };

  const downloadAttachment = async (rmaId, fileType, index = null) => {
    try {
      const url = index !== null 
        ? `/rma/${rmaId}/download/${fileType}/${index}`
        : `/rma/${rmaId}/download/${fileType}`;
      
      const response = await api.get(url, {
        responseType: 'blob'
      });

      if (response.status === 200) {
        const blob = response.data;
        const downloadUrl = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = downloadUrl;
        a.download = `${fileType}-${rmaId}${index !== null ? `-${index}` : ''}`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(downloadUrl);
        toast.success('File downloaded successfully');
      } else {
        toast.error('Failed to download file');
      }
    } catch (error) {
      console.error('Error downloading file:', error);
      toast.error(error.response?.data?.message || 'Failed to download file');
    }
  };
  // Calculate stats from current data if API stats are not available
  const calculatedStats = {
    total: rmaRequests.length,
    pending: rmaRequests.filter((r) => r.status === "pending_review").length,
    pendingRMAs: rmaRequests.filter((r) => r.status === "pending_review").length,
    approved: rmaRequests.filter((r) => r.status === "approved").length,
    rejected: rmaRequests.filter((r) => r.status === "rejected").length,
    processing: rmaRequests.filter((r) => r.status === "under_repair" || r.status === "in_transit_to_vendor" || r.status === "received_by_vendor" || r.status === "repaired" || r.status === "replaced" || r.status === "in_transit_to_client").length,
    completed: rmaRequests.filter((r) => r.status === "completed").length,
    ...rmaStats
  };


  const getStatusBadge = (status) => {
    const statusConfig = {
      pending_review: { bg: "bg-yellow-100", text: "text-yellow-800", icon: Clock },
      approved: { bg: "bg-green-100", text: "text-green-800", icon: CheckCircle },
      rejected: { bg: "bg-red-100", text: "text-red-800", icon: XCircle },
      in_transit_to_vendor: { bg: "bg-purple-100", text: "text-purple-800", icon: RefreshCcw },
      received_by_vendor: { bg: "bg-purple-100", text: "text-purple-800", icon: Package },
      under_repair: { bg: "bg-blue-100", text: "text-blue-800", icon: RefreshCcw },
      repaired: { bg: "bg-blue-100", text: "text-blue-800", icon: CheckCircle },
      replaced: { bg: "bg-blue-100", text: "text-blue-800", icon: Package },
      in_transit_to_client: { bg: "bg-green-100", text: "text-green-800", icon: RefreshCcw },
      completed: { bg: "bg-gray-100", text: "text-gray-800", icon: CheckCircle },
      cancelled: { bg: "bg-red-100", text: "text-red-800", icon: XCircle },
    };

    const config = statusConfig[status] || statusConfig.pending;
    const Icon = config.icon;

    return (
      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
        <Icon className="h-3 w-3" />
        {status.replace(/_/g, ' ').charAt(0).toUpperCase() + status.replace(/_/g, ' ').slice(1)}
      </span>
    );
  };

  const filteredRequests = rmaRequests
    .filter((rma) => {
      if (filterStatus === "all") return true;
      if (filterStatus === "pending") return rma.status === "pending_review";
      if (filterStatus === "processing") {
        return ["in_transit_to_vendor", "received_by_vendor", "under_repair", "repaired", "replaced", "in_transit_to_client"].includes(rma.status);
      }
      return rma.status === filterStatus;
    })
    .filter((rma) =>
      rma.serialNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rma.invoiceNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rma.poNumber?.toLowerCase().includes(searchTerm.toLowerCase())
    );

  // Show loading while UserContext is initializing or while fetching data
  if (userLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCcw className="h-12 w-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">
            {userLoading ? 'Checking authentication...' : 'Loading RMA requests...'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      {/* <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div className="mb-4 sm:mb-0">
              <h1 className="text-2xl font-bold text-gray-800">RMA Administration</h1>
              <p className="mt-1 text-sm text-gray-500">
                Manage return merchandise authorizations
              </p>
              {pendingRequests.length > 0 && (
                <div className="flex items-center gap-2 mt-3 px-3 py-1.5 bg-yellow-50 border border-yellow-200 rounded-lg text-sm">
                  <AlertTriangle className="h-4 w-4 text-yellow-600" />
                  <span className="text-yellow-800 font-medium">
                    {pendingRequests.length} pending request{pendingRequests.length > 1 ? 's' : ''} require attention
                  </span>
                </div>
              )}
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => setFilterStatus('pending')}
                className={`inline-flex items-center px-4 py-2 rounded-lg text-sm font-semibold transition-colors shadow-sm ${
                  filterStatus === 'pending'
                    ? 'bg-yellow-600 text-white hover:bg-yellow-700'
                    : 'bg-yellow-50 text-yellow-700 border border-yellow-200 hover:bg-yellow-100'
                }`}
              >
                <Clock className="h-4 w-4 mr-2" />
                Pending ({calculatedStats.pendingRMAs})
              </button>
              <button
                onClick={() => fetchAllData()}
                className="inline-flex items-center px-4 py-2 border border-gray-200 rounded-lg shadow-sm text-sm font-semibold text-gray-700 bg-white hover:bg-gray-50 transition-colors"
              >
                <RefreshCcw className="h-4 w-4 mr-2" />
                Refresh
              </button>
            </div>
          </div>
        </div> */}

      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-6">
          <button 
            onClick={() => setFilterStatus("all")}
            className={`bg-white rounded-2xl border shadow-sm p-4 text-left hover:shadow-md transition-all ${
              filterStatus === "all" ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-100'
            }`}
          >
            <div className="flex items-center">
              <div className="p-2 bg-blue-50 rounded-lg mr-3">
                <BarChart3 className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <div className="text-lg font-bold text-gray-800">{calculatedStats.total}</div>
                <div className="text-xs font-medium text-gray-500">Total</div>
              </div>
            </div>
          </button>
          
          <button 
            onClick={() => setFilterStatus("pending_review")}
            className={`rounded-2xl border shadow-sm p-4 text-left hover:shadow-md transition-all ${
              filterStatus === "pending_review" 
                ? 'bg-yellow-50 border-yellow-500 ring-2 ring-yellow-200' 
                : calculatedStats.pending > 0 
                  ? 'bg-yellow-50 border-yellow-200' 
                  : 'bg-white border-gray-100'
            }`}
          >
            <div className="flex items-center">
              <div className="p-2 bg-yellow-50 rounded-lg mr-3">
                <Clock className="h-5 w-5 text-yellow-600" />
              </div>
              <div>
                <div className="text-lg font-bold text-yellow-700">{calculatedStats.pending}</div>
                <div className="text-xs font-medium text-gray-500">Pending</div>
              </div>
            </div>
          </button>

          <button 
            onClick={() => setFilterStatus("approved")}
            className={`bg-white rounded-2xl border shadow-sm p-4 text-left hover:shadow-md transition-all ${
              filterStatus === "approved" ? 'border-green-500 ring-2 ring-green-200' : 'border-gray-100'
            }`}
          >
            <div className="flex items-center">
              <div className="p-2 bg-green-50 rounded-lg mr-3">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <div className="text-lg font-bold text-green-700">{calculatedStats.approved}</div>
                <div className="text-xs font-medium text-gray-500">Approved</div>
              </div>
            </div>
          </button>

          <button 
            onClick={() => setFilterStatus("processing")}
            className={`bg-white rounded-2xl border shadow-sm p-4 text-left hover:shadow-md transition-all ${
              filterStatus === "processing" ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-100'
            }`}
          >
            <div className="flex items-center">
              <div className="p-2 bg-blue-50 rounded-lg mr-3">
                <RefreshCcw className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <div className="text-lg font-bold text-blue-700">{calculatedStats.processing}</div>
                <div className="text-xs font-medium text-gray-500">Processing</div>
              </div>
            </div>
          </button>

          <button 
            onClick={() => setFilterStatus("completed")}
            className={`bg-white rounded-2xl border shadow-sm p-4 text-left hover:shadow-md transition-all ${
              filterStatus === "completed" ? 'border-gray-500 ring-2 ring-gray-200' : 'border-gray-100'
            }`}
          >
            <div className="flex items-center">
              <div className="p-2 bg-gray-50 rounded-lg mr-3">
                <CheckCircle className="h-5 w-5 text-gray-600" />
              </div>
              <div>
                <div className="text-lg font-bold text-gray-700">{calculatedStats.completed}</div>
                <div className="text-xs font-medium text-gray-500">Completed</div>
              </div>
            </div>
          </button>

          <button 
            onClick={() => setFilterStatus("rejected")}
            className={`bg-white rounded-2xl border shadow-sm p-4 text-left hover:shadow-md transition-all ${
              filterStatus === "rejected" ? 'border-red-500 ring-2 ring-red-200' : 'border-gray-100'
            }`}
          >
            <div className="flex items-center">
              <div className="p-2 bg-red-50 rounded-lg mr-3">
                <XCircle className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <div className="text-lg font-bold text-red-700">{calculatedStats.rejected}</div>
                <div className="text-xs font-medium text-gray-500">Rejected</div>
              </div>
            </div>
          </button>
        </div>      {/* Filters */}
      {/* <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0 sm:space-x-4">
            <div className="flex-1 min-w-0">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search by serial number, invoice, or PO..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-lg bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm transition-colors"
                />
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Filter className="h-5 w-5 text-gray-400" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="pl-3 pr-8 py-2.5 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              >
                <option value="all">All Status</option>
                <option value="pending_review">Pending Review</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
                <option value="in_transit_to_vendor">In Transit to Vendor</option>
                <option value="under_repair">Under Repair</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>
        </div> */}

      {/* RMA Requests Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-gray-800">All RMA Requests</h3>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0 sm:space-x-4">
            <div className="flex-1 min-w-0">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search by serial number, invoice, or PO..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-lg bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm transition-colors"
                />
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Filter className="h-5 w-5 text-gray-400" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="pl-3 pr-8 py-2.5 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              >
                <option value="all">All Status</option>
                <option value="pending_review">Pending Review</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
                <option value="in_transit_to_vendor">In Transit to Vendor</option>
                <option value="under_repair">Under Repair</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="text-xs text-gray-400 border-b border-gray-100">
                    <th className="pb-3 font-medium">Serial Number</th>
                    <th className="pb-3 font-medium">Invoice / PO</th>
                    <th className="pb-3 font-medium">Submitted By</th>
                    <th className="pb-3 font-medium">Date</th>
                    <th className="pb-3 font-medium">Status</th>
                    <th className="pb-3 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {filteredRequests.length > 0 ? (
                    filteredRequests.map((rma) => (
                      <tr
                        key={rma._id}
                        className="group cursor-pointer transition-colors hover:bg-gray-50"
                        onClick={() => {
                          setSelectedRMA(rma);
                          setShowModal(true);
                        }}
                      >
                        <td className="py-4">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-50 rounded-lg">
                              <Package className="h-5 w-5 text-blue-600" />
                            </div>
                            <span className="text-sm font-medium text-gray-900">{rma.serialNumber}</span>
                          </div>
                        </td>

                        <td className="py-4">
                          <div className="text-sm text-gray-900">{rma.invoiceNumber}</div>
                          <div className="text-xs text-gray-500">{rma.poNumber}</div>
                        </td>

                        <td className="py-4">
                          <div className="text-sm text-gray-900">{rma.reportedBy || "N/A"}</div>
                          <div className="text-xs text-gray-500">{rma.reportedByEmail || ""}</div>
                        </td>

                        <td className="py-4">
                          <span className="text-sm text-gray-600">
                            {new Date(rma.createdAt).toLocaleDateString()}
                          </span>
                        </td>

                        <td className="py-4">
                          {getStatusBadge(rma.status)}
                        </td>

                        <td className="py-4">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedRMA(rma);
                                setShowModal(true);
                              }}
                              className="text-sm text-blue-600 hover:text-blue-900 font-medium"
                            >
                              View
                            </button>
                            
                            {rma.status === 'pending_review' && (
                              <>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    approveRMA(rma._id);
                                  }}
                                  className="text-sm bg-green-100 text-green-700 hover:bg-green-200 px-2 py-1 rounded font-medium"
                                >
                                  Approve
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    rejectRMA(rma._id);
                                  }}
                                  className="text-sm bg-red-100 text-red-700 hover:bg-red-200 px-2 py-1 rounded font-medium"
                                >
                                  Reject
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="px-6 py-12">
                        <div className="text-center">
                          <Package className="mx-auto h-12 w-12 text-gray-300 mb-3" />
                          <h3 className="text-base font-medium text-gray-700 mb-2">
                            {filterStatus === 'all' ? 'No RMA requests found' : `No ${filterStatus} RMA requests`}
                          </h3>
                          <p className="text-sm text-gray-500">
                            {filteredRequests.length === 0 && searchTerm ? 
                              'Try adjusting your search terms or filters.' :
                              'RMA requests will appear here once submitted.'
                            }
                          </p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

      {/* Modal */}
      {showModal && selectedRMA && (
        <div className="fixed inset-0 bg-[rgba(0,0,0,0.5)]  flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
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
                  <label className="text-xs font-medium text-gray-500">Status</label>
                  <div className="mt-1">{getStatusBadge(selectedRMA.status)}</div>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500">Reason</label>
                  <p className="text-sm text-gray-900 mt-1">{selectedRMA.reason || "N/A"}</p>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500">Submitted Date</label>
                  <p className="text-sm text-gray-900 mt-1">
                    {new Date(selectedRMA.createdAt).toLocaleString()}
                  </p>
                </div>
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

              {/* Attachments */}
              {selectedRMA.attachments && selectedRMA.attachments.length > 0 && (
                <div>
                  <label className="text-xs font-medium text-gray-500 mb-2 block">Attachments</label>
                  <div className="grid grid-cols-3 gap-3">
                    {selectedRMA.attachments.map((file, index) => (
                      <div key={index} className="border border-gray-200 rounded-lg p-2">
                        {file.type === "image" ? (
                          <img
                            src={file.url.startsWith('http') ? file.url : `http://localhost:5000${file.url}`}
                            alt={`Attachment ${index + 1}`}
                            className="w-full h-24 object-cover rounded-md mb-2"
                          />
                        ) : (
                          <div className="w-full h-24 bg-red-50 rounded-md mb-2 flex items-center justify-center">
                            <FileText className="h-8 w-8 text-red-500" />
                          </div>
                        )}
                        <a
                          href={file.url.startsWith('http') ? file.url : `http://localhost:5000${file.url}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-blue-600 hover:underline flex items-center gap-1"
                        >
                          <Download className="h-3 w-3" />
                          Download
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Admin Notes Section */}
              <div>
                <label className="text-xs font-medium text-gray-500 mb-2 block">Admin Notes</label>
                <textarea
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  placeholder="Add notes for this RMA action..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  rows={3}
                />
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-3 pt-4 border-t border-gray-200">
                {selectedRMA.status === "pending_review" && (
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      onClick={() => approveRMA(selectedRMA._id)}
                      disabled={updateLoading}
                      className="flex items-center justify-center gap-2 px-4 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <CheckCircle className="h-5 w-5" />
                      {updateLoading ? 'Processing...' : 'Approve'}
                    </button>
                    <button
                      onClick={() => updateRMAStatus(selectedRMA._id, "in_transit_to_vendor")}
                      disabled={updateLoading}
                      className="flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <RefreshCcw className="h-5 w-5" />
                      {updateLoading ? 'Processing...' : 'Send to Vendor'}
                    </button>
                    <button
                      onClick={() => rejectRMA(selectedRMA._id)}
                      disabled={updateLoading}
                      className="flex items-center justify-center gap-2 px-4 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <XCircle className="h-5 w-5" />
                      {updateLoading ? 'Processing...' : 'Reject'}
                    </button>
                  </div>
                )}
                
                {selectedRMA.status === "approved" && (
                  <button
                    onClick={() => updateRMAStatus(selectedRMA._id, "in_transit_to_vendor")}
                    disabled={updateLoading}
                    className="flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
                  >
                    <RefreshCcw className="h-5 w-5" />
                    Send to Vendor
                  </button>
                )}
                
                {selectedRMA.status === "in_transit_to_vendor" && (
                  <button
                    onClick={() => updateRMAStatus(selectedRMA._id, "received_by_vendor")}
                    disabled={updateLoading}
                    className="flex items-center justify-center gap-2 px-4 py-2.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition disabled:opacity-50"
                  >
                    <Package className="h-5 w-5" />
                    Mark as Received by Vendor
                  </button>
                )}
                
                {selectedRMA.status === "received_by_vendor" && (
                  <button
                    onClick={() => updateRMAStatus(selectedRMA._id, "under_repair")}
                    disabled={updateLoading}
                    className="flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
                  >
                    <RefreshCcw className="h-5 w-5" />
                    Start Repair
                  </button>
                )}
                
                {selectedRMA.status === "under_repair" && (
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => updateRMAStatus(selectedRMA._id, "repaired")}
                      disabled={updateLoading}
                      className="flex items-center justify-center gap-2 px-4 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:opacity-50"
                    >
                      <CheckCircle className="h-5 w-5" />
                      Repaired
                    </button>
                    <button
                      onClick={() => updateRMAStatus(selectedRMA._id, "replaced")}
                      disabled={updateLoading}
                      className="flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
                    >
                      <Package className="h-5 w-5" />
                      Replaced
                    </button>
                  </div>
                )}
                
                {(selectedRMA.status === "repaired" || selectedRMA.status === "replaced") && (
                  <button
                    onClick={() => updateRMAStatus(selectedRMA._id, "in_transit_to_client")}
                    disabled={updateLoading}
                    className="flex items-center justify-center gap-2 px-4 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:opacity-50"
                  >
                    <RefreshCcw className="h-5 w-5" />
                    Send to Client
                  </button>
                )}
                
                {selectedRMA.status === "in_transit_to_client" && (
                  <button
                    onClick={() => updateRMAStatus(selectedRMA._id, "completed")}
                    disabled={updateLoading}
                    className="flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition disabled:opacity-50"
                  >
                    <CheckCircle className="h-5 w-5" />
                    Mark as Completed
                  </button>
                )}

                {/* Danger Zone */}
                <div className="border-t border-red-200 pt-3 mt-3">
                  <p className="text-xs text-red-600 mb-2 font-medium">⚠️ Danger Zone</p>
                  <button
                    onClick={() => setShowDeleteConfirm(true)}
                    className="flex items-center gap-2 px-4 py-2 border border-red-300 text-red-700 rounded-lg hover:bg-red-50 transition text-sm"
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete RMA
                  </button>
                </div>
              </div>
            </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && selectedRMA && (
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
              <div className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-red-100 rounded-lg">
                    <AlertTriangle className="h-6 w-6 text-red-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-800">Delete RMA Request</h3>
                    <p className="text-sm text-gray-500">This action cannot be undone</p>
                  </div>
                </div>
                
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                  <p className="text-sm text-red-800">
                    Are you sure you want to delete RMA request for serial number{" "}
                    <span className="font-bold">{selectedRMA.serialNumber}</span>?
                  </p>
                  <p className="text-xs text-red-600 mt-1">
                    All associated data and attachments will be permanently removed.
                  </p>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setShowDeleteConfirm(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => deleteRMA(selectedRMA._id)}
                    disabled={updateLoading}
                    className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition disabled:opacity-50"
                  >
                    {updateLoading ? "Deleting..." : "Delete RMA"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
    </div>
  );
};

export default RMAAdmin;