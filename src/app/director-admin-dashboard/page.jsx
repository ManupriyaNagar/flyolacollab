"use client";

import Link from 'next/link';
import { FaPlane, FaChartLine, FaUsers, FaCog, FaShieldAlt, FaTachometerAlt } from 'react-icons/fa';

export default function DirectorAdminDashboard() {
  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Director Dashboard</h1>
        <p className="text-gray-600">Operations management and performance oversight</p>
      </div>

      {/* Operational KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-r from-blue-500 to-cyan-600 p-6 rounded-xl text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100">Fleet Utilization</p>
              <p className="text-2xl font-bold">87.3%</p>
            </div>
            <FaPlane className="text-3xl text-blue-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-6 rounded-xl text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100">On-Time Performance</p>
              <p className="text-2xl font-bold">94.2%</p>
            </div>
            <FaTachometerAlt className="text-3xl text-green-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-500 to-pink-600 p-6 rounded-xl text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100">Staff Efficiency</p>
              <p className="text-2xl font-bold">91.8%</p>
            </div>
            <FaUsers className="text-3xl text-purple-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-orange-500 to-red-600 p-6 rounded-xl text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100">Safety Score</p>
              <p className="text-2xl font-bold">99.8%</p>
            </div>
            <FaShieldAlt className="text-3xl text-orange-200" />
          </div>
        </div>
      </div>

      {/* Operations Management */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link href="/director-admin-dashboard/flight-operations">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow cursor-pointer">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <FaPlane className="text-blue-600 text-xl" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Flight Operations</h3>
                <p className="text-gray-600">Monitor and manage flight schedules</p>
              </div>
            </div>
          </div>
        </Link>

        <Link href="/director-admin-dashboard/performance-analytics">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow cursor-pointer">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <FaChartLine className="text-purple-600 text-xl" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Performance Analytics</h3>
                <p className="text-gray-600">Analyze operational performance metrics</p>
              </div>
            </div>
          </div>
        </Link>
      </div>

      {/* Operational Status */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Current Operations Status</h3>
        <div className="space-y-4">
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">All systems operational - 24 active flights</p>
              <p className="text-xs text-gray-500">Last updated: 2 minutes ago</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">Crew scheduling optimized for peak hours</p>
              <p className="text-xs text-gray-500">Efficiency increased by 8%</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">Weather advisory: Minor delays expected in Mumbai</p>
              <p className="text-xs text-gray-500">Contingency plans activated</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}