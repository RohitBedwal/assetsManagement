import React, { useState } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';
import { Monitor, CheckCircle, AlertTriangle, RefreshCcw, ChevronDown, Download } from 'lucide-react';

const Dashboard = () => {
  const [timeframe, setTimeframe] = useState('Daily');
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Chart Data Sets
  const dailyData = [
    { date: '01/09', amount: 12000 },
    { date: '02/09', amount: 8000 },
    { date: '03/09', amount: 45000 },
    { date: '04/09', amount: 52000 },
    { date: '05/09', amount: 23000 },
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

  const assetsData = [
    { name: 'Laptops', value: 450, color: '#3B82F6' },
    { name: 'Desktops', value: 280, color: '#10B981' },
    { name: 'Servers', value: 85, color: '#F59E0B' },
    { name: 'Network Equipment', value: 120, color: '#EF4444' },
    { name: 'Mobile Devices', value: 200, color: '#8B5CF6' },
  ];

  // ✅ CSV Export Function
  const downloadCSV = () => {
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
  };

  const MetricCard = ({ title, value, icon: Icon, iconColor, bgColor }) => (
    <div className="bg-white shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-800">{value}</p>
        </div>
        <div className={`${bgColor} p-3`}>
          <Icon className={`h-6 w-6 ${iconColor}`} />
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-blue-600 mb-2">Dashboard</h1>
          <p className="text-gray-600">Overview of your asset management system</p>
        </div>

        {/* ✅ Download Button */}
        <button
          onClick={downloadCSV}
          className="flex items-center gap-2 border border-gray-300 text-gray-700 text-sm px-4 py-2 rounded-sm bg-white hover:bg-gray-50 transition"
        >
          <Download className="h-4 w-4" />
          Download CSV
        </button>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <MetricCard
          title="Total Devices"
          value="1,235"
          icon={Monitor}
          iconColor="text-blue-600"
          bgColor="bg-blue-100"
        />
        <MetricCard
          title="Active Projects"
          value="54"
          icon={CheckCircle}
          iconColor="text-green-600"
          bgColor="bg-green-100"
        />
        <MetricCard
          title="Active Devices"
          value="1,187"
          icon={CheckCircle}
          iconColor="text-emerald-600"
          bgColor="bg-emerald-100"
        />
        <MetricCard
          title="Replacements"
          value="23"
          icon={RefreshCcw}
          iconColor="text-yellow-600"
          bgColor="bg-yellow-100"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Cost Distribution Chart */}
        <div className="bg-white shadow-sm border border-gray-200 p-6 relative">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-blue-600">COST DISTRIBUTION</h3>

            {/* Custom Dropdown */}
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center justify-between gap-1 border border-gray-300 text-sm px-3 py-1.5 text-gray-700 bg-gray-50 hover:bg-gray-100 focus:ring-2 focus:ring-blue-400 transition-all"
              >
                {timeframe}
                <ChevronDown className="h-4 w-4 text-gray-500" />
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-1 w-32 bg-white border border-gray-200 shadow-md z-10">
                  {['Daily', 'Monthly', 'Yearly'].map((option) => (
                    <button
                      key={option}
                      onClick={() => {
                        setTimeframe(option);
                        setDropdownOpen(false);
                      }}
                      className={`block w-full text-left px-3 py-2 text-sm hover:bg-blue-50 ${
                        timeframe === option ? 'text-blue-600 font-semibold' : 'text-gray-700'
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="h-80 relative">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={getChartData()} margin={{ top: 20, right: 30, left: 20, bottom: 40 }}>
                <CartesianGrid strokeDasharray="2 2" stroke="#d1d5db" opacity={0.5} />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#9ca3af' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#9ca3af' }} tickFormatter={(value) => `${value / 1000}K`} />
                <Tooltip
                  content={({ active, payload, label }) =>
                    active && payload && payload.length ? (
                      <div className="bg-white p-3 border border-gray-200 shadow-lg">
                        <p className="text-gray-600 text-sm">{label}</p>
                        <p className="text-blue-600 font-semibold">
                          {payload[0].value.toLocaleString()}
                        </p>
                      </div>
                    ) : null
                  }
                />
                <Line
                  type="monotone"
                  dataKey="amount"
                  stroke="#6366f1"
                  strokeWidth={1}
                  dot={{ fill: '#6366f1', strokeWidth: 0, r: 3 }}
                  activeDot={{ r: 5, fill: '#6366f1' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Assets Distribution Pie Chart */}
        <div className="bg-white shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-blue-600 mb-2">ASSETS DISTRIBUTION</h3>
          <div className="h-80 relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={assetsData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(1)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {assetsData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value, name) => [`${value} devices`, name]}
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #e5e7eb',
                    borderRadius: '6px',
                    fontSize: '12px'
                  }}
                />
                <Legend
                  verticalAlign="bottom"
                  height={36}
                  formatter={(value) => <span className="text-sm text-gray-600">{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
