"use client";

import BASE_URL from "@/baseUrl/baseUrl";
import {
    ArrowTrendingUpIcon,
    CalendarIcon,
    ChartBarIcon,
    CurrencyRupeeIcon,
    TicketIcon
} from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function CouponUsageHistoryPage() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [selectedCoupon, setSelectedCoupon] = useState(null);
  const [dateRange, setDateRange] = useState({
    startDate: "",
    endDate: ""
  });

  useEffect(() => {
    fetchUsageStats();
  }, []);

  const fetchUsageStats = async (filters = {}) => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      
      const queryParams = new URLSearchParams();
      if (filters.startDate) queryParams.append('startDate', filters.startDate);
      if (filters.endDate) queryParams.append('endDate', filters.endDate);
      if (filters.couponId) queryParams.append('couponId', filters.couponId);

      const response = await fetch(`${BASE_URL}/coupons/stats/usage?${queryParams}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const data = await response.json();
      setStats(data);
    } catch (error) {
      toast.error("Failed to fetch coupon usage statistics");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDateFilter = () => {
    if (dateRange.startDate && dateRange.endDate) {
      fetchUsageStats(dateRange);
    } else {
      toast.warning("Please select both start and end dates");
    }
  };

  const clearFilters = () => {
    setDateRange({ startDate: "", endDate: "" });
    setSelectedCoupon(null);
    fetchUsageStats();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading coupon usage statistics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8 bg-gradient-to-br from-slate-50 via-purple-50 to-indigo-100 min-h-screen">
      <ToastContainer />
      
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-3 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl shadow-lg">
            <ChartBarIcon className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
              Coupon Usage Analytics
            </h1>
            <p className="text-gray-600 mt-1">Track discount performance and savings</p>
          </div>
        </div>
      </div>

      {/* Date Filter */}
      <div className="bg-white rounded-2xl shadow-xl border border-purple-100 p-6 mb-6">
        <div className="flex flex-wrap gap-4 items-end">
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Start Date
            </label>
            <input
              type="date"
              value={dateRange.startDate}
              onChange={(e) => setDateRange({...dateRange, startDate: e.target.value})}
              className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            />
          </div>
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              End Date
            </label>
            <input
              type="date"
              value={dateRange.endDate}
              onChange={(e) => setDateRange({...dateRange, endDate: e.target.value})}
              className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            />
          </div>
          <button
            onClick={handleDateFilter}
            className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-semibold"
          >
            Apply Filter
          </button>
          <button
            onClick={clearFilters}
            className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-semibold"
          >
            Clear
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl shadow-xl p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <CurrencyRupeeIcon className="w-10 h-10 opacity-80" />
            <div className="text-right">
              <p className="text-sm opacity-90">Total Discount</p>
              <p className="text-3xl font-bold">₹{stats?.summary?.totalDiscount || 0}</p>
            </div>
          </div>
          <div className="text-sm opacity-90">
            Total savings provided to customers
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-xl p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <TicketIcon className="w-10 h-10 opacity-80" />
            <div className="text-right">
              <p className="text-sm opacity-90">Total Usage</p>
              <p className="text-3xl font-bold">{stats?.summary?.totalUsage || 0}</p>
            </div>
          </div>
          <div className="text-sm opacity-90">
            Number of times coupons used
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl shadow-xl p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <ArrowTrendingUpIcon className="w-10 h-10 opacity-80" />
            <div className="text-right">
              <p className="text-sm opacity-90">Avg Discount</p>
              <p className="text-3xl font-bold">₹{stats?.summary?.averageDiscount || 0}</p>
            </div>
          </div>
          <div className="text-sm opacity-90">
            Average discount per usage
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl shadow-xl p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <ChartBarIcon className="w-10 h-10 opacity-80" />
            <div className="text-right">
              <p className="text-sm opacity-90">Original Amount</p>
              <p className="text-3xl font-bold">₹{stats?.summary?.totalOriginalAmount || 0}</p>
            </div>
          </div>
          <div className="text-sm opacity-90">
            Total booking value before discount
          </div>
        </div>
      </div>

      {/* Coupon Performance Table */}
      <div className="bg-white rounded-2xl shadow-xl border border-purple-100 p-6 mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <TicketIcon className="w-6 h-6 text-purple-600" />
          Coupon Performance
        </h2>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gradient-to-r from-purple-50 to-indigo-50 border-b-2 border-purple-200">
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Coupon Code</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Type</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Value</th>
                <th className="px-6 py-4 text-right text-sm font-bold text-gray-700">Usage Count</th>
                <th className="px-6 py-4 text-right text-sm font-bold text-gray-700">Total Discount</th>
                <th className="px-6 py-4 text-right text-sm font-bold text-gray-700">Avg Discount</th>
              </tr>
            </thead>
            <tbody>
              {stats?.usageByCoupon?.map((item, index) => (
                <tr 
                  key={index} 
                  className="border-b border-gray-100 hover:bg-purple-50 transition-colors cursor-pointer"
                  onClick={() => setSelectedCoupon(item)}
                >
                  <td className="px-6 py-4">
                    <div className="font-bold text-purple-600">{item.couponCode}</div>
                    <div className="text-xs text-gray-500">{item.description}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      item.couponType === 'percentage' 
                        ? 'bg-blue-100 text-blue-800' 
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {item.couponType}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-semibold">
                    {item.couponType === 'percentage' ? `${item.couponValue}%` : `₹${item.couponValue}`}
                  </td>
                  <td className="px-6 py-4 text-right font-semibold text-gray-900">
                    {item.usageCount}
                  </td>
                  <td className="px-6 py-4 text-right font-bold text-green-600">
                    ₹{item.totalDiscount}
                  </td>
                  <td className="px-6 py-4 text-right font-semibold text-gray-700">
                    ₹{item.avgDiscount}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {(!stats?.usageByCoupon || stats.usageByCoupon.length === 0) && (
          <div className="text-center py-12">
            <TicketIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600">No coupon usage data available</p>
          </div>
        )}
      </div>

      {/* Recent Usage History */}
      <div className="bg-white rounded-2xl shadow-xl border border-purple-100 p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <CalendarIcon className="w-6 h-6 text-purple-600" />
          Recent Usage History
        </h2>
        
        <div className="space-y-3">
          {stats?.recentUsage?.slice(0, 20).map((usage, index) => (
            <div 
              key={index} 
              className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-purple-50 rounded-xl border border-gray-200 hover:shadow-md transition-shadow"
            >
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-1">
                  <span className="px-3 py-1 bg-purple-600 text-white rounded-lg text-sm font-bold">
                    {usage.couponCode}
                  </span>
                  <span className="text-xs text-gray-500">
                    Booking #{usage.bookingId}
                  </span>
                </div>
                <div className="text-xs text-gray-600">
                  {new Date(usage.usedAt).toLocaleString()}
                </div>
              </div>
              
              <div className="text-right">
                <div className="text-sm text-gray-500 line-through">
                  ₹{usage.originalAmount}
                </div>
                <div className="text-lg font-bold text-green-600">
                  -₹{usage.discountAmount}
                </div>
                <div className="text-sm font-semibold text-gray-900">
                  Final: ₹{usage.finalAmount}
                </div>
              </div>
            </div>
          ))}
        </div>

        {(!stats?.recentUsage || stats.recentUsage.length === 0) && (
          <div className="text-center py-12">
            <CalendarIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600">No recent usage history</p>
          </div>
        )}
      </div>
    </div>
  );
}
