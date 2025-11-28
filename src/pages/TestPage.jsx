import React from 'react';
import { useUser } from '../context/UserContext';

const TestPage = () => {
  const { user, isAdmin } = useUser();

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">🧪 Routing Test Page</h1>
          
          <div className="space-y-4">
            <div className="p-4 bg-green-50 rounded-lg">
              <h3 className="text-lg font-semibold text-green-800 mb-2">✅ Routing is Working!</h3>
              <p className="text-green-700">This page successfully loaded, which means the routing system is functional.</p>
            </div>

            <div className="p-4 bg-blue-50 rounded-lg">
              <h3 className="text-lg font-semibold text-blue-800 mb-2">👤 User Information</h3>
              <div className="space-y-2 text-sm">
                <p><strong>Name:</strong> {user?.name || 'Not available'}</p>
                <p><strong>Email:</strong> {user?.email || 'Not available'}</p>
                <p><strong>Role:</strong> {user?.role || 'Not available'}</p>
                <p><strong>Is Admin:</strong> {isAdmin() ? 'Yes' : 'No'}</p>
                <p><strong>Authentication Status:</strong> {user ? 'Authenticated' : 'Not authenticated'}</p>
              </div>
            </div>

            <div className="p-4 bg-yellow-50 rounded-lg">
              <h3 className="text-lg font-semibold text-yellow-800 mb-2">🔗 Navigation Test</h3>
              <div className="space-y-2">
                <a href="/rma/list" className="block text-blue-600 hover:underline">→ Go to RMA List</a>
                <a href="/rma/admin" className="block text-blue-600 hover:underline">→ Go to RMA Admin</a>
                <a href="/rma/submit" className="block text-blue-600 hover:underline">→ Go to RMA Submit</a>
                <a href="/" className="block text-blue-600 hover:underline">→ Go to Dashboard</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestPage;