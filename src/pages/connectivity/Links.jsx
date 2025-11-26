import React from "react";
import { Link as LinkIcon, Plus } from "lucide-react";

export default function Links() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Connectivity Links</h1>
          <p className="text-gray-500 text-sm mt-1">
            Manage and monitor connectivity links for your assets.
          </p>
        </div>
        <button className="flex items-center gap-2 bg-blue-600 px-4 py-2 rounded-lg text-sm font-semibold text-white hover:bg-blue-700 transition-colors shadow-sm">
          <Plus className="h-4 w-4" />
          Add Link
        </button>
      </div>

      {/* Table Card */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-bold text-gray-800">All Connectivity Links</h3>
          <i className="text-gray-400 cursor-pointer">⋮</i>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-xs text-gray-400 border-b border-gray-100">
                <th className="pb-3 font-medium">Link Name</th>
                <th className="pb-3 font-medium">Type</th>
                <th className="pb-3 font-medium">Status</th>
                <th className="pb-3 font-medium">Created</th>
                <th className="pb-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              <tr>
                <td colSpan={5} className="py-12 text-center">
                  <div className="flex flex-col items-center justify-center">
                    <LinkIcon className="h-12 w-12 text-gray-300 mb-3" />
                    <h3 className="text-base font-medium text-gray-700 mb-2">No links yet</h3>
                    <p className="text-sm text-gray-500 mb-4">Get started by creating your first connectivity link</p>
                    <button className="inline-flex items-center gap-2 bg-blue-600 px-4 py-2 rounded-lg text-sm font-semibold text-white hover:bg-blue-700 transition-colors">
                      <Plus className="h-4 w-4" />
                      Add Link
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
