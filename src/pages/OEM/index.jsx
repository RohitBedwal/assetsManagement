import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";
import { 
  Plus, 
  Edit, 
  Trash2, 
  Search, 
  Building2,
  Phone,
  Mail,
  Globe,
  MapPin,
  Package,
  ArrowLeft,
  Users
} from "lucide-react";

const OEM = () => {
  const navigate = useNavigate();
  const [oems, setOems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingOEM, setEditingOEM] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    contactPerson: "",
    email: "",
    phone: "",
    website: "",
    address: "",
    country: "",
    supportEmail: "",
    supportPhone: "",
    notes: ""
  });

  const api = axios.create({
    baseURL: `${import.meta.env.VITE_BACKEND_URL}/api`,
    headers: { "Content-Type": "application/json" },
  });

  useEffect(() => {
    fetchOEMs();
  }, []);

  const fetchOEMs = async () => {
    setLoading(true);
    try {
      console.log('Fetching OEMs from backend...');
      // For now, we'll use sample data since OEM backend endpoints may not be implemented yet
      // Once backend is ready, uncomment the API call below:
      
      // const response = await api.get('/oem');
      // if (response.data) {
      //   setOems(Array.isArray(response.data) ? response.data : []);
      // }
      
      // Sample data for demo (remove when backend is ready)
      const sampleOEMs = [
        {
          _id: "1",
          name: "Dell Technologies",
          description: "Leading technology solutions provider",
          contactPerson: "John Smith",
          email: "contact@dell.com",
          phone: "+1-800-123-4567",
          website: "https://dell.com",
          address: "One Dell Way, Round Rock, TX 78682",
          country: "United States",
          supportEmail: "support@dell.com",
          supportPhone: "+1-800-624-9896",
          notes: "Primary laptop and server supplier"
        },
        {
          _id: "2",
          name: "HP Inc.",
          description: "Personal computing and printing solutions",
          contactPerson: "Sarah Johnson",
          email: "info@hp.com",
          phone: "+1-650-857-1501",
          website: "https://hp.com",
          address: "1501 Page Mill Road, Palo Alto, CA 94304",
          country: "United States",
          supportEmail: "support@hp.com",
          supportPhone: "+1-800-474-6836",
          notes: "Printing and desktop solutions"
        },
        {
          _id: "3",
          name: "Lenovo Group",
          description: "Intelligent transformation solutions",
          contactPerson: "Michael Chen",
          email: "contact@lenovo.com",
          phone: "+86-400-818-8818",
          website: "https://lenovo.com",
          address: "No. 6 Chuang Ye Road, Haidian District, Beijing",
          country: "China",
          supportEmail: "support@lenovo.com",
          supportPhone: "+1-855-253-6686",
          notes: "ThinkPad and workstation supplier"
        }
      ];
      
      setOems(sampleOEMs);
      console.log(`Loaded ${sampleOEMs.length} sample OEMs (replace with API call when backend is ready)`);
      
    } catch (error) {
      console.error("Error fetching OEMs:", error);
      
      if (error.response?.status === 404) {
        console.log('OEM endpoint not found - using sample data');
        setOems([]);
      } else if (error.code === 'ECONNREFUSED') {
        console.log('Backend server not running - using sample data');
        setOems([]);
      } else {
        toast.error(error.response?.data?.message || "Failed to fetch OEMs");
        setOems([]);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast.error("OEM name is required");
      return;
    }

    try {
      if (editingOEM) {
        // Update existing OEM
        setOems(prev => prev.map(oem => 
          oem._id === editingOEM._id 
            ? { ...editingOEM, ...formData }
            : oem
        ));
        toast.success("OEM updated successfully");
      } else {
        // Add new OEM
        const newOEM = {
          _id: Date.now().toString(),
          ...formData,
          createdAt: new Date().toISOString()
        };
        setOems(prev => [newOEM, ...prev]);
        toast.success("OEM added successfully");
      }
      
      resetForm();
      setShowModal(false);
    } catch (error) {
      console.error("Error saving OEM:", error);
      toast.error("Failed to save OEM");
    }
  };

  const handleEdit = (oem) => {
    setEditingOEM(oem);
    setFormData({
      name: oem.name || "",
      description: oem.description || "",
      contactPerson: oem.contactPerson || "",
      email: oem.email || "",
      phone: oem.phone || "",
      website: oem.website || "",
      address: oem.address || "",
      country: oem.country || "",
      supportEmail: oem.supportEmail || "",
      supportPhone: oem.supportPhone || "",
      notes: oem.notes || ""
    });
    setShowModal(true);
  };

  const handleDelete = async (oemId) => {
    if (!confirm("Are you sure you want to delete this OEM? This action cannot be undone.")) {
      return;
    }

    try {
      setOems(prev => prev.filter(oem => oem._id !== oemId));
      toast.success("OEM deleted successfully");
    } catch (error) {
      console.error("Error deleting OEM:", error);
      toast.error("Failed to delete OEM");
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      contactPerson: "",
      email: "",
      phone: "",
      website: "",
      address: "",
      country: "",
      supportEmail: "",
      supportPhone: "",
      notes: ""
    });
    setEditingOEM(null);
  };

  const filteredOEMs = oems.filter(oem =>
    oem.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    oem.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    oem.country?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    oem.contactPerson?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="text-sm text-gray-500 mt-2">Loading OEMs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center gap-3 mb-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="h-5 w-5 text-gray-600" />
          </button>
          <div className="p-2 bg-blue-100 rounded-lg">
            <Building2 className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">OEM Management</h1>
            <p className="text-sm text-gray-500 mt-1">
              Manage Original Equipment Manufacturers and their details
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search OEMs..."
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>
          <button
            onClick={() => {
              resetForm();
              setShowModal(true);
            }}
            className="flex items-center gap-2 bg-blue-600 px-4 py-2 rounded-lg text-sm font-semibold text-white hover:bg-blue-700 transition-colors shadow-sm"
          >
            <Plus className="h-4 w-4" />
            Add OEM
          </button>
        </div>
      </div>

      {/* OEMs Grid */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-bold text-gray-800">All OEMs ({filteredOEMs.length})</h3>
        </div>

        {filteredOEMs.length === 0 ? (
          <div className="text-center py-12">
            <Building2 className="mx-auto h-12 w-12 text-gray-400 mb-3" />
            <h3 className="text-base font-medium text-gray-700 mb-2">
              {searchQuery ? 'No OEMs found' : 'No OEMs yet'}
            </h3>
            <p className="text-sm text-gray-500 mb-4">
              {searchQuery 
                ? 'Try adjusting your search terms.' 
                : 'Get started by adding your first OEM manufacturer.'
              }
            </p>
            {!searchQuery && (
              <button
                onClick={() => {
                  resetForm();
                  setShowModal(true);
                }}
                className="inline-flex items-center gap-2 bg-blue-600 px-4 py-2 rounded-lg text-sm font-semibold text-white hover:bg-blue-700 transition-colors"
              >
                <Plus className="h-4 w-4" />
                Add OEM
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredOEMs.map((oem) => (
              <div key={oem._id} className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                      <Building2 className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">{oem.name}</h4>
                      <p className="text-xs text-gray-500">{oem.country || 'Unknown Location'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleEdit(oem)}
                      className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(oem._id)}
                      className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {oem.description && (
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">{oem.description}</p>
                )}

                <div className="space-y-2 text-xs text-gray-500">
                  {oem.contactPerson && (
                    <div className="flex items-center gap-2">
                      <Users className="h-3 w-3" />
                      <span>{oem.contactPerson}</span>
                    </div>
                  )}
                  {oem.email && (
                    <div className="flex items-center gap-2">
                      <Mail className="h-3 w-3" />
                      <span className="truncate">{oem.email}</span>
                    </div>
                  )}
                  {oem.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="h-3 w-3" />
                      <span>{oem.phone}</span>
                    </div>
                  )}
                  {oem.website && (
                    <div className="flex items-center gap-2">
                      <Globe className="h-3 w-3" />
                      <a
                        href={oem.website.startsWith('http') ? oem.website : `https://${oem.website}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline truncate"
                      >
                        {oem.website}
                      </a>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 rounded-t-xl">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-800">
                  {editingOEM ? 'Edit OEM' : 'Add New OEM'}
                </h2>
                <button
                  onClick={() => {
                    setShowModal(false);
                    resetForm();
                  }}
                  className="text-gray-400 hover:text-gray-600 transition"
                >
                  <Plus className="h-6 w-6 rotate-45" />
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    OEM Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    placeholder="e.g., Dell Technologies"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Country</label>
                  <input
                    type="text"
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    placeholder="e.g., United States"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Contact Person</label>
                  <input
                    type="text"
                    name="contactPerson"
                    value={formData.contactPerson}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    placeholder="Primary contact name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    placeholder="contact@oem.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    placeholder="+1 (555) 123-4567"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Website</label>
                  <input
                    type="url"
                    name="website"
                    value={formData.website}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    placeholder="https://www.oem.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Support Email</label>
                  <input
                    type="email"
                    name="supportEmail"
                    value={formData.supportEmail}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    placeholder="support@oem.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Support Phone</label>
                  <input
                    type="tel"
                    name="supportPhone"
                    value={formData.supportPhone}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    placeholder="Support phone number"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition resize-none"
                  placeholder="Brief description of the OEM..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition resize-none"
                  placeholder="Full address..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition resize-none"
                  placeholder="Additional notes or comments..."
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    resetForm();
                  }}
                  className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
                >
                  {editingOEM ? 'Update OEM' : 'Add OEM'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default OEM;