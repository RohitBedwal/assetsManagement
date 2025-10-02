import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { Monitor, CheckCircle, AlertTriangle } from 'lucide-react';

const Dashboard = () => {
  // Sample data for cost distribution (daily data like the example)
  const costData = [
    { date: '01/09', amount: 0 },
    { date: '02/09', amount: 12000 },
    { date: '03/09', amount: 8000 },
    { date: '04/09', amount: 45000 },
    { date: '05/09', amount: 52000 },
    { date: '06/09', amount: 23000 },
    { date: '07/09', amount: 15000 },
    { date: '08/09', amount: 8000 },
    { date: '09/09', amount: 35000 },
    { date: '10/09', amount: 38000 },
    { date: '11/09', amount: 42000 },
    { date: '12/09', amount: 28000 },
    { date: '13/09', amount: 18000 },
    { date: '14/09', amount: 25000 },
  ];

  // Sample data for assets distribution pie chart
  const assetsData = [
    { name: 'Laptops', value: 450, color: '#3B82F6' },
    { name: 'Desktops', value: 280, color: '#10B981' },
    { name: 'Servers', value: 85, color: '#F59E0B' },
    { name: 'Network Equipment', value: 120, color: '#EF4444' },
    { name: 'Mobile Devices', value: 200, color: '#8B5CF6' },
  ];

  const MetricCard = ({ title, value, icon: Icon, iconColor, bgColor }) => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
        </div>
        <div className={`${bgColor} p-3 rounded-lg`}>
          <Icon className={`h-6 w-6 ${iconColor}`} />
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Dashboard</h1>
        <p className="text-gray-600">Overview of your asset management system</p>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <MetricCard
          title="Total Devices"
          value="1,235"
          icon={Monitor}
          iconColor="text-blue-600"
          bgColor="bg-blue-100"
        />
        <MetricCard
          title="Active Devices"
          value="1,187"
          icon={CheckCircle}
          iconColor="text-green-600"
          bgColor="bg-green-100"
        />
        <MetricCard
          title="Warranties Expiring Soon"
          value="23"
          icon={AlertTriangle}
          iconColor="text-yellow-600"
          bgColor="bg-yellow-100"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Cost Distribution Chart */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-blue-600 mb-1">COST DISTRIBUTION</h3>
          <div className="h-80 relative">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart 
                data={costData}
                margin={{ top: 20, right: 30, left: 20, bottom: 40 }}
              >
                <CartesianGrid strokeDasharray="2 2" stroke="#d1d5db" horizontal={true} vertical={true} opacity={0.5} />
                <XAxis 
                  dataKey="date" 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 11, fill: '#9ca3af' }}
                  interval={0}
                />
                <YAxis 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 11, fill: '#9ca3af' }}
                  tickFormatter={(value) => `${value/1000}K`}
                  domain={[0, 'dataMax + 10000']}
                />
                <Tooltip 
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
                          <p className="text-gray-600 text-sm">{`${label}`}</p>
                          <p className="text-blue-600 font-semibold">{`value: ${payload[0].value.toLocaleString()}`}</p>
                        </div>
                      );
                    }
                    return null;
                  }}
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
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-blue-600 mb-1">ASSETS DISTRIBUTION</h3>
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

      {/* Additional Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900">98.5%</p>
            <p className="text-sm text-gray-600">Uptime</p>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900">156</p>
            <p className="text-sm text-gray-600">Vendors</p>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900">$2.4M</p>
            <p className="text-sm text-gray-600">Total Value</p>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900">48</p>
            <p className="text-sm text-gray-600">Maintenance Due</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;