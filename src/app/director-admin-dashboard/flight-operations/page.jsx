"use client";

import Link from 'next/link';
import { FaPlane, FaChartLine, FaUsers, FaCog } from 'react-icons/fa';

export default function FlightOperations() {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Flight Operations</h1>
        <p className="text-gray-600">Manage and monitor all flight operations</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 rounded-xl text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100">Active Flights</p>
              <p className="text-2xl font-bold">24</p>
            </div>
            <FaPlane className="text-3xl text-blue-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-500 to-green-600 p-6 rounded-xl text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100">On-Time Performance</p>
              <p className="text-2xl font-bold">94.2%</p>
            </div>
            <FaChartLine className="text-3xl text-green-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-6 rounded-xl text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100">Crew Utilization</p>
              <p className="text-2xl font-bold">87%</p>
            </div>
            <FaUsers className="text-3xl text-purple-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-6 rounded-xl text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100">Fleet Efficiency</p>
              <p className="text-2xl font-bold">91.8%</p>
            </div>
            <FaCog className="text-3xl text-orange-200" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Today's Flight Schedule</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Flight</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Route</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Departure</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              <tr>
                <td className="px-4 py-2 text-sm font-medium text-gray-900">FL001</td>
                <td className="px-4 py-2 text-sm text-gray-500">DEL → BOM</td>
                <td className="px-4 py-2"><span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">On Time</span></td>
                <td className="px-4 py-2 text-sm text-gray-500">09:30</td>
              </tr>
              <tr>
                <td className="px-4 py-2 text-sm font-medium text-gray-900">FL002</td>
                <td className="px-4 py-2 text-sm text-gray-500">BOM → BLR</td>
                <td className="px-4 py-2"><span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs">Delayed</span></td>
                <td className="px-4 py-2 text-sm text-gray-500">11:15</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}