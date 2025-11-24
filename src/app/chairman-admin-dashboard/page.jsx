"use client";

import Link from 'next/link';
import { FaChartBar, FaFileContract,  FaShieldAlt, FaUsers, FaGavel, FaTransgender } from 'react-icons/fa';

export default function ChairmanAdminDashboard() {
  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Chairman Dashboard</h1>
        <p className="text-gray-600">Strategic oversight and executive governance</p>
      </div>

      {/* Executive KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-6 rounded-xl text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-indigo-100">Revenue Growth</p>
              <p className="text-2xl font-bold">+22.5%</p>
            </div>
            <FaTransgender className="text-3xl text-indigo-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-6 rounded-xl text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100">Market Position</p>
              <p className="text-2xl font-bold">#2</p>
            </div>
            <FaChartBar className="text-3xl text-green-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-blue-500 to-cyan-600 p-6 rounded-xl text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100">Board Compliance</p>
              <p className="text-2xl font-bold">98%</p>
            </div>
            <FaGavel className="text-3xl text-blue-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-500 to-pink-600 p-6 rounded-xl text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100">Risk Score</p>
              <p className="text-2xl font-bold">Low</p>
            </div>
            <FaShieldAlt className="text-3xl text-purple-200" />
          </div>
        </div>
      </div>

      {/* Executive Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link href="/chairman-admin-dashboard/strategic-reports">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow cursor-pointer">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                <FaChartBar className="text-indigo-600 text-xl" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Strategic Reports</h3>
                <p className="text-gray-600">Executive insights and performance analytics</p>
              </div>
            </div>
          </div>
        </Link>

        <Link href="/chairman-admin-dashboard/policy-management">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow cursor-pointer">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <FaFileContract className="text-purple-600 text-xl" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Policy Management</h3>
                <p className="text-gray-600">Governance and organizational policies</p>
              </div>
            </div>
          </div>
        </Link>
      </div>

      {/* Board Updates */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Board Activities</h3>
        <div className="space-y-4">
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">Q4 Strategic Review approved</p>
              <p className="text-xs text-gray-500">Board Resolution #2024-15</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">New compliance policy ratified</p>
              <p className="text-xs text-gray-500">Effective January 2025</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">Executive compensation review scheduled</p>
              <p className="text-xs text-gray-500">Next board meeting agenda</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}