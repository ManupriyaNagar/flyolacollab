"use client";

import { FaCreditCard, FaMoneyBillWave, FaReceipt, FaExclamationTriangle } from 'react-icons/fa';

export default function PaymentManagement() {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Payment Management</h1>
        <p className="text-gray-600">Monitor and manage all payment transactions</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-6 rounded-xl text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100">Successful Payments</p>
              <p className="text-2xl font-bold">1,247</p>
              <p className="text-sm text-green-200">98.5% success rate</p>
            </div>
            <FaCreditCard className="text-3xl text-green-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-blue-500 to-cyan-600 p-6 rounded-xl text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100">Pending Payments</p>
              <p className="text-2xl font-bold">23</p>
              <p className="text-sm text-blue-200">Awaiting processing</p>
            </div>
            <FaMoneyBillWave className="text-3xl text-blue-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-yellow-500 to-orange-600 p-6 rounded-xl text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-yellow-100">Refunds Processed</p>
              <p className="text-2xl font-bold">45</p>
              <p className="text-sm text-yellow-200">This month</p>
            </div>
            <FaReceipt className="text-3xl text-yellow-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-red-500 to-pink-600 p-6 rounded-xl text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-100">Failed Payments</p>
              <p className="text-2xl font-bold">19</p>
              <p className="text-sm text-red-200">Requires attention</p>
            </div>
            <FaExclamationTriangle className="text-3xl text-red-200" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Payment Transactions</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Transaction ID</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Method</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              <tr>
                <td className="px-4 py-2 text-sm font-medium text-gray-900">TXN001234</td>
                <td className="px-4 py-2 text-sm text-gray-500">John Doe</td>
                <td className="px-4 py-2 text-sm font-medium text-gray-900">₹25,000</td>
                <td className="px-4 py-2 text-sm text-gray-500">Credit Card</td>
                <td className="px-4 py-2"><span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">Success</span></td>
                <td className="px-4 py-2 text-sm text-gray-500">2024-01-15</td>
              </tr>
              <tr>
                <td className="px-4 py-2 text-sm font-medium text-gray-900">TXN001235</td>
                <td className="px-4 py-2 text-sm text-gray-500">Jane Smith</td>
                <td className="px-4 py-2 text-sm font-medium text-gray-900">₹18,500</td>
                <td className="px-4 py-2 text-sm text-gray-500">UPI</td>
                <td className="px-4 py-2"><span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs">Pending</span></td>
                <td className="px-4 py-2 text-sm text-gray-500">2024-01-15</td>
              </tr>
              <tr>
                <td className="px-4 py-2 text-sm font-medium text-gray-900">TXN001236</td>
                <td className="px-4 py-2 text-sm text-gray-500">Mike Johnson</td>
                <td className="px-4 py-2 text-sm font-medium text-gray-900">₹32,000</td>
                <td className="px-4 py-2 text-sm text-gray-500">Net Banking</td>
                <td className="px-4 py-2"><span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">Success</span></td>
                <td className="px-4 py-2 text-sm text-gray-500">2024-01-14</td>
              </tr>
              <tr>
                <td className="px-4 py-2 text-sm font-medium text-gray-900">TXN001237</td>
                <td className="px-4 py-2 text-sm text-gray-500">Sarah Wilson</td>
                <td className="px-4 py-2 text-sm font-medium text-gray-900">₹15,750</td>
                <td className="px-4 py-2 text-sm text-gray-500">Credit Card</td>
                <td className="px-4 py-2"><span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs">Failed</span></td>
                <td className="px-4 py-2 text-sm text-gray-500">2024-01-14</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Methods Distribution</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Credit/Debit Cards</span>
              <div className="flex items-center gap-2">
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-500 h-2 rounded-full" style={{width: '65%'}}></div>
                </div>
                <span className="text-sm font-medium">65%</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">UPI Payments</span>
              <div className="flex items-center gap-2">
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{width: '25%'}}></div>
                </div>
                <span className="text-sm font-medium">25%</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Net Banking</span>
              <div className="flex items-center gap-2">
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div className="bg-purple-500 h-2 rounded-full" style={{width: '10%'}}></div>
                </div>
                <span className="text-sm font-medium">10%</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Alerts</h3>
          <div className="space-y-3">
            <div className="p-3 bg-red-50 rounded-lg border-l-4 border-red-500">
              <p className="text-sm font-medium text-red-900">High failure rate detected</p>
              <p className="text-xs text-red-700">Credit card payments failing at 5.2%</p>
            </div>
            <div className="p-3 bg-yellow-50 rounded-lg border-l-4 border-yellow-500">
              <p className="text-sm font-medium text-yellow-900">Pending refunds</p>
              <p className="text-xs text-yellow-700">3 refunds pending for over 48 hours</p>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg border-l-4 border-blue-500">
              <p className="text-sm font-medium text-blue-900">Payment gateway maintenance</p>
              <p className="text-xs text-blue-700">Scheduled maintenance on Jan 20, 2024</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}