"use client";

import Link from 'next/link';
import { FaDollarSign, FaFileInvoiceDollar, FaChartPie, FaCreditCard,  FaCalculator, FaAngleUp } from 'react-icons/fa';

export default function AccountsAdminDashboard() {
  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Accounts Dashboard</h1>
        <p className="text-gray-600">Financial management and accounting oversight</p>
      </div>

      {/* Financial KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-6 rounded-xl text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100">Total Revenue</p>
              <p className="text-2xl font-bold">₹45.2L</p>
              <p className="text-sm text-green-200">+15.2% growth</p>
            </div>
            <FaDollarSign className="text-3xl text-green-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-blue-500 to-cyan-600 p-6 rounded-xl text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100">Net Profit</p>
              <p className="text-2xl font-bold">₹12.8L</p>
              <p className="text-sm text-blue-200">28.3% margin</p>
            </div>
            <FaChartPie className="text-3xl text-blue-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-500 to-pink-600 p-6 rounded-xl text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100">Expenses</p>
              <p className="text-2xl font-bold">₹32.4L</p>
              <p className="text-sm text-purple-200">-3.2% reduction</p>
            </div>
            <FaCalculator className="text-3xl text-purple-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-orange-500 to-red-600 p-6 rounded-xl text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100">Pending Payments</p>
              <p className="text-2xl font-bold">23</p>
              <p className="text-sm text-orange-200">₹4.2L value</p>
            </div>
            <FaCreditCard className="text-3xl text-orange-200" />
          </div>
        </div>
      </div>

      {/* Financial Management */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link href="/accounts-admin-dashboard/financial-reports">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow cursor-pointer">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <FaFileInvoiceDollar className="text-green-600 text-xl" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Financial Reports</h3>
                <p className="text-gray-600">Generate comprehensive financial reports</p>
              </div>
            </div>
          </div>
        </Link>

        <Link href="/accounts-admin-dashboard/payment-management">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow cursor-pointer">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <FaCreditCard className="text-blue-600 text-xl" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Payment Management</h3>
                <p className="text-gray-600">Monitor and manage payment transactions</p>
              </div>
            </div>
          </div>
        </Link>
      </div>

      {/* Financial Summary */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Financial Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <FaAngleUp className="text-3xl text-green-600 mx-auto mb-2" />
            <p className="text-sm text-green-800 font-medium">Revenue Growth</p>
            <p className="text-2xl font-bold text-green-600">+18.5%</p>
            <p className="text-xs text-green-600">vs last quarter</p>
          </div>
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <FaChartPie className="text-3xl text-blue-600 mx-auto mb-2" />
            <p className="text-sm text-blue-800 font-medium">Profit Margin</p>
            <p className="text-2xl font-bold text-blue-600">28.3%</p>
            <p className="text-xs text-blue-600">Industry leading</p>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <FaCalculator className="text-3xl text-purple-600 mx-auto mb-2" />
            <p className="text-sm text-purple-800 font-medium">Cost Efficiency</p>
            <p className="text-2xl font-bold text-purple-600">92.1%</p>
            <p className="text-xs text-purple-600">Optimized operations</p>
          </div>
        </div>
      </div>

      {/* Recent Financial Activity */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Financial Activity</h3>
        <div className="space-y-4">
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">Large payment received: ₹2,45,000</p>
              <p className="text-xs text-gray-500">Charter service booking - 5 minutes ago</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">Monthly financial report generated</p>
              <p className="text-xs text-gray-500">January 2024 summary - 1 hour ago</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">Refund processed: ₹18,500</p>
              <p className="text-xs text-gray-500">Flight cancellation refund - 2 hours ago</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}