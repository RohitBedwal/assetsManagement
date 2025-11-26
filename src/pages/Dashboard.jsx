import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line
} from 'recharts';
import { Monitor, CheckCircle, TrendingUp, RefreshCcw, Download, Clipboard, ShoppingBasket, PieChart as PieChartIcon, Users, Plus, MoreVertical, HardDrive } from 'lucide-react';

const Dashboard = () => {
  const [timeframe, setTimeframe] = useState('Daily');
  const [categories, setCategories] = useState([]);
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDownloadModal, setShowDownloadModal] = useState(false);

  const api = axios.create({
    baseURL: `${import.meta.env.VITE_BACKEND_URL}/api`,
    headers: { "Content-Type": "application/json" },
  });

  // Fetch categories and devices
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [categoriesRes, devicesRes] = await Promise.all([
        api.get('/categories'),
        api.get('/devices')
      ]);
      setCategories(categoriesRes.data);
      setDevices(devicesRes.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Chart Data Sets
  const dailyData = [
    { date: '01/09', amount: 12500 },
    { date: '02/09', amount: 11000 },
    { date: '03/09', amount: 45000 },
    { date: '04/09', amount: 52000 },
    { date: '05/09', amount: 22000 },
    { date: '06/09', amount: 15000 },
    { date: '07/09', amount: 35000 },
  ];

  const monthlyData = [
    { date: 'Jan', amount: 125000 },
    { date: 'Feb', amount: 180000 },
    { date: 'Mar', amount: 155000 },
    { date: 'Apr', amount: 220000 },
    { date: 'May', amount: 205000 },
    { date: 'Jun', amount: 250000 },
    { date: 'Jul', amount: 270000 },
  ];

  const yearlyData = [
    { date: '2020', amount: 1850000 },
    { date: '2021', amount: 2100000 },
    { date: '2022', amount: 2500000 },
    { date: '2023', amount: 2900000 },
    { date: '2024', amount: 3100000 },
  ];

  const getChartData = () => {
    switch (timeframe) {
      case 'Monthly': return monthlyData;
      case 'Yearly': return yearlyData;
      default: return dailyData;
    }
  };

  // Calculate real assets data from categories
  const assetsData = categories.map((cat, index) => {
    const colors = ['#3B82F6', '#10B981', '#8B5CF6', '#EF4444', '#F59E0B', '#F97316', '#06B6D4', '#EC4899'];
    const totalDevices = categories.reduce((sum, c) => sum + (c.total || 0), 0);
    const percentage = totalDevices > 0 ? ((cat.total || 0) / totalDevices * 100).toFixed(1) : 0;
    
    return {
      name: cat.name,
      value: parseFloat(percentage),
      count: cat.total || 0,
      color: colors[index % colors.length]
    };
  }).filter(item => item.count > 0); // Only show categories with devices

  // Calculate metrics
  const totalDevices = devices.length;
  const activeDevices = devices.filter(d => d.status === 'DEPLOYED').length;
  const inStockDevices = devices.filter(d => d.status === 'IN_STOCK').length;
  const totalProjects = [...new Set(devices.filter(d => d.projectName).map(d => d.projectName))].length;

  // ✅ CSV Export Function
  const downloadCSV = () => {
    setShowDownloadModal(true);
  };

  const confirmDownload = () => {
    const data = getChartData();
    const csvRows = [
      ['Date', 'Amount'],
      ...data.map(item => [item.date, item.amount])
    ];
    const csvContent = csvRows.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Cost_Distribution_${timeframe}.csv`);
    link.click();
    toast.success(`CSV file downloaded successfully! (${timeframe} data)`);
    setShowDownloadModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Stats Row - Belanjo Style */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {/* Total Devices Card */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all">
          <div className="flex justify-between items-start mb-4">
            <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
              <Monitor className="w-5 h-5" />
            </div>
            <span className="bg-green-50 text-green-600 text-xs font-bold px-2 py-1 rounded">
              {categories.length} categories
            </span>
          </div>
          <h3 className="text-2xl font-bold text-gray-800">
            {loading ? '...' : totalDevices.toLocaleString()}
          </h3>
          <p className="text-sm text-gray-400 mt-1">Total Devices</p>
        </div>

        {/* Active Projects Card */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all">
          <div className="flex justify-between items-start mb-4">
            <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center text-purple-600">
              <Clipboard className="w-5 h-5" />
            </div>
            <span className="bg-blue-50 text-blue-600 text-xs font-bold px-2 py-1 rounded">
              {activeDevices} deployed
            </span>
          </div>
          <h3 className="text-2xl font-bold text-gray-800">
            {loading ? '...' : totalProjects}
          </h3>
          <p className="text-sm text-gray-400 mt-1">Active Projects</p>
        </div>

        {/* Active Devices Card */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all">
          <div className="flex justify-between items-start mb-4">
            <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center text-green-500">
              <CheckCircle className="w-5 h-5" />
            </div>
            <span className="bg-green-50 text-green-600 text-xs font-bold px-2 py-1 rounded">
              {totalDevices > 0 ? `${((activeDevices / totalDevices) * 100).toFixed(1)}%` : '0%'}
            </span>
          </div>
          <h3 className="text-2xl font-bold text-gray-800">
            {loading ? '...' : activeDevices.toLocaleString()}
          </h3>
          <p className="text-sm text-gray-400 mt-1">Active Devices</p>
        </div>

        {/* Device Summary Card - Blue Gradient */}
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-2xl shadow-lg shadow-blue-200 text-white relative overflow-hidden">
          <div className="flex justify-between items-start mb-4">
            <span className="text-sm font-semibold opacity-90">Device Summary</span>
            <HardDrive className="w-5 h-5 opacity-80" />
          </div>
          
          <div className="space-y-3 mb-4">
            <div className="flex items-center justify-between bg-white/10 p-2.5 rounded-lg backdrop-blur-sm">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-400"></div>
                <span className="text-xs font-medium">Inward (In Stock)</span>
              </div>
              <span className="text-sm font-bold">{inStockDevices}</span>
            </div>
            <div className="flex items-center justify-between bg-white/10 p-2.5 rounded-lg backdrop-blur-sm">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-amber-400"></div>
                <span className="text-xs font-medium">Outward (Deployed)</span>
              </div>
              <span className="text-sm font-bold">{activeDevices}</span>
            </div>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-white/20">
            <span className="text-xs opacity-80">Total Devices</span>
            <span className="text-xl font-bold">{totalDevices}</span>
          </div>

          {/* Decorative circles */}
          <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-white/5 rounded-full"></div>
          <div className="absolute top-10 right-10 w-10 h-10 bg-white/5 rounded-full"></div>
        </div>
      </div>

      {/* Charts Section - Belanjo Style */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Main Cost Distribution Chart */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm lg:col-span-2">
          <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
            <h3 className="font-bold text-gray-800">Cost Distribution</h3>
            <div className="flex items-center gap-2">
              <button
                onClick={downloadCSV}
                className="px-3 py-1.5 text-xs font-medium rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                Download CSV
              </button>
              <div className="flex bg-gray-100 rounded-lg p-1 gap-1">
                {['Daily', 'Monthly', 'Yearly'].map((option) => (
                  <button
                    key={option}
                    onClick={() => setTimeframe(option)}
                    className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all whitespace-nowrap ${
                      timeframe === option
                        ? 'bg-white shadow-sm text-gray-900'
                        : 'text-gray-500 hover:text-gray-900'
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          </div>
          
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={getChartData()} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.05}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
                <XAxis 
                  dataKey="date" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 12, fill: '#9CA3AF' }}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 12, fill: '#9CA3AF' }}
                  tickFormatter={(value) => `${value / 1000}k`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #E5E7EB',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                  formatter={(value) => [`$${value.toLocaleString()}`, 'Cost']}
                />
                <Area
                  type="monotone"
                  dataKey="amount"
                  stroke="#3B82F6"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorAmount)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Assets Distribution Donut Chart */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-bold text-gray-800">Assets Distribution</h3>
            <button 
              onClick={downloadCSV}
              className="text-gray-400 hover:text-gray-600"
            >
              <Download className="w-4 h-4" />
            </button>
          </div>
          <p className="text-sm text-gray-400 mb-6">Breakdown by category</p>
          
          {loading ? (
            <div className="h-64 flex items-center justify-center">
              <div className="text-center">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <p className="text-sm text-gray-500 mt-2">Loading...</p>
              </div>
            </div>
          ) : assetsData.length === 0 ? (
            <div className="h-64 flex items-center justify-center">
              <div className="text-center">
                <Monitor className="h-12 w-12 text-gray-300 mx-auto mb-2" />
                <p className="text-sm text-gray-500">No devices yet</p>
              </div>
            </div>
          ) : (
            <div className="relative">
              <div className="h-64 flex justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={assetsData}
                      cx="50%"
                      cy="50%"
                      innerRadius={55}
                      outerRadius={85}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {assetsData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#fff',
                        border: '1px solid #E5E7EB',
                        borderRadius: '8px',
                        fontSize: '12px',
                        padding: '8px 12px'
                      }}
                      formatter={(value, name) => [`${value}% (${assetsData.find(d => d.name === name)?.count || 0} devices)`, name]}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              
              {/* Scrollable Legend */}
              <div className="mt-4 max-h-32 overflow-y-auto pr-2 space-y-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                {assetsData.map((item, index) => (
                  <div key={index} className="flex items-center gap-2 text-xs">
                    <div
                      className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-gray-600 flex-1 truncate" title={item.name}>
                      {item.name}
                    </span>
                    <span className="text-gray-500 flex-shrink-0">{item.count}</span>
                    <span className="font-semibold text-gray-800 flex-shrink-0">{item.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

      </div>

      {/* Recent Devices Table - Belanjo Style */}

      <div className="h-10"></div> {/* Bottom Spacer */}

      {/* Download Confirmation Modal */}
      {showDownloadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/30 backdrop-blur-sm transition-opacity"
            onClick={() => setShowDownloadModal(false)}
          />
          <div className="relative bg-white rounded-2xl shadow-xl p-6 max-w-md w-full mx-4">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center flex-shrink-0">
                <Download className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-1">
                  Download CSV File?
                </h3>
                <p className="text-sm text-gray-600">
                  Download <span className="font-semibold text-gray-900">{timeframe}</span> Cost Distribution data as CSV file.
                </p>
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowDownloadModal(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDownload}
                className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Download
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
