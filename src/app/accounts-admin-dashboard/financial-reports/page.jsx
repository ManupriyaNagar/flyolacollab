"use client";

import { FaDollarSign, FaChartLine, FaFileInvoiceDollar, FaAngleUp,  } from 'react-icons/fa';

export default function FinancialReports() {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Financial Reports</h1>
        <p className="text-gray-600">Comprehensive financial analysis and reporting</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-6 rounded-xl text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100">Total Revenue</p>
              <p className="text-2xl font-bold">₹45.2L</p>
              <p className="text-sm text-green-200">+15.2% vs last month</p>
            </div>
            <FaDollarSign className="text-3xl text-green-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-blue-500 to-cyan-600 p-6 rounded-xl text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100">Net Profit</p>
              <p className="text-2xl font-bold">₹12.8L</p>
              <p className="text-sm text-blue-200">+8.7% growth</p>
            </div>
            <FaChartLine className="text-3xl text-blue-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-500 to-pink-600 p-6 rounded-xl text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100">Operating Expenses</p>
              <p className="text-2xl font-bold">₹32.4L</p>
              <p className="text-sm text-purple-200">-3.2% reduction</p>
            </div>
            <FaFileInvoiceDollar className="text-3xl text-purple-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-orange-500 to-red-600 p-6 rounded-xl text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100">Profit Margin</p>
              <p className="text-2xl font-bold">28.3%</p>
              <p className="text-sm text-orange-200">Industry leading</p>
            </div>
            <FaAngleUp className="text-3xl text-orange-200" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Revenue Breakdown</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Flight Bookings</span>
              <div className="flex items-center gap-2">
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{width: '75%'}}></div>
                </div>
                <span className="text-sm font-medium">₹33.9L</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Charter Services</span>
              <div className="flex items-center gap-2">
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-500 h-2 rounded-full" style={{width: '20%'}}></div>
                </div>
                <span className="text-sm font-medium">₹9.0L</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Additional Services</span>
              <div className="flex items-center gap-2">
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div className="bg-purple-500 h-2 rounded-full" style={{width: '5%'}}></div>
                </div>
                <span className="text-sm font-medium">₹2.3L</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Expense Categories</h3>
          <div className="space-y-4">
            <div className="p-3 bg-red-50 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-red-900">Fuel Costs</span>
                <span className="text-lg font-bold text-red-600">₹18.5L</span>
              </div>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-blue-900">Staff Salaries</span>
                <span className="text-lg font-bold text-blue-600">₹8.2L</span>
              </div>
            </div>
            <div className="p-3 bg-green-50 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-green-900">Maintenance</span>
                <span className="text-lg font-bold text-green-600">₹3.8L</span>
              </div>
            </div>
            <div className="p-3 bg-purple-50 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-purple-900">Other Expenses</span>
                <span className="text-lg font-bold text-purple-600">₹1.9L</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Financial Transactions</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              <tr>
                <td className="px-4 py-2 text-sm text-gray-500">2024-01-15</td>
                <td className="px-4 py-2 text-sm font-medium text-gray-900">Flight Booking Revenue</td>
                <td className="px-4 py-2"><span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">Income</span></td>
                <td className="px-4 py-2 text-sm font-medium text-green-600">+₹2,45,000</td>
              </tr>
              <tr>
                <td className="px-4 py-2 text-sm text-gray-500">2024-01-14</td>
                <td className="px-4 py-2 text-sm font-medium text-gray-900">Fuel Purchase</td>
                <td className="px-4 py-2"><span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs">Expense</span></td>
                <td className="px-4 py-2 text-sm font-medium text-red-600">-₹1,85,000</td>
              </tr>
              <tr>
                <td className="px-4 py-2 text-sm text-gray-500">2024-01-13</td>
                <td className="px-4 py-2 text-sm font-medium text-gray-900">Charter Service</td>
                <td className="px-4 py-2"><span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">Income</span></td>
                <td className="px-4 py-2 text-sm font-medium text-green-600">+₹3,20,000</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}