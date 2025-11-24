"use client";

import React, { useState, useEffect } from "react";
import { 
  FaChartLine, 
  FaClock, 
  FaUsers, 
  FaPlane,


  FaInfoCircle,
  FaCalendarAlt
} from "react-icons/fa";
import BASE_URL from "@/baseUrl/baseUrl";

const FlightInsights = ({ bookingData }) => {
  const [insights, setInsights] = useState({
    priceHistory: [],
    popularTimes: [],
    routeStats: null,
    loading: true
  });

  useEffect(() => {
    const fetchInsights = async () => {
      try {
        const token = localStorage.getItem("token");
        const headers = {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        };

        // Fetch flight schedules for price comparison and route analysis
        const [schedulesRes, bookingsRes] = await Promise.allSettled([
          fetch(`${BASE_URL}/flight-schedules`, { headers }),
          fetch(`${BASE_URL}/bookings`, { headers })
        ]);

        let priceHistory = [];
        let routeStats = null;
        let popularTimes = [];

        if (schedulesRes.status === 'fulfilled' && schedulesRes.value.ok) {
          const schedules = await schedulesRes.value.json();
          
          // Filter similar routes for price comparison
          const similarRoutes = schedules.filter(schedule => 
            schedule.departure_location === bookingData.departure &&
            schedule.arrival_location === bookingData.arrival
          );

          // Generate price history (mock data based on similar routes)
          priceHistory = similarRoutes.slice(0, 7).map((route, index) => ({
            date: new Date(Date.now() - (6 - index) * 24 * 60 * 60 * 1000).toLocaleDateString(),
            price: parseFloat(route.price) + (Math.random() - 0.5) * 1000
          }));

          // Calculate route statistics
          if (similarRoutes.length > 0) {
            const prices = similarRoutes.map(r => parseFloat(r.price));
            const avgPrice = prices.reduce((a, b) => a + b, 0) / prices.length;
            const minPrice = Math.min(...prices);
            const maxPrice = Math.max(...prices);
            
            routeStats = {
              averagePrice: avgPrice,
              minPrice,
              maxPrice,
              totalFlights: similarRoutes.length,
              priceComparison: parseFloat(bookingData.totalPrice) < avgPrice ? 'below' : 'above'
            };
          }

          // Generate popular times data
          popularTimes = [
            { time: "06:00-09:00", popularity: 85, label: "Morning" },
            { time: "09:00-12:00", popularity: 65, label: "Late Morning" },
            { time: "12:00-15:00", popularity: 45, label: "Afternoon" },
            { time: "15:00-18:00", popularity: 75, label: "Evening" },
            { time: "18:00-21:00", popularity: 90, label: "Night" },
            { time: "21:00-24:00", popularity: 30, label: "Late Night" }
          ];
        }

        setInsights({
          priceHistory,
          popularTimes,
          routeStats,
          loading: false
        });

      } catch (error) {
        setInsights(prev => ({ ...prev, loading: false }));
      }
    };

    if (bookingData) {
      fetchInsights();
    }
  }, [bookingData]);

  if (insights.loading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 rounded w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
      <div className="flex items-center mb-6">
        <FaChartLine className="text-blue-600 text-2xl mr-3" />
        <div>
          <h3 className="text-xl font-bold text-gray-800">Flight Insights</h3>
          <p className="text-gray-600">Market analysis and route information</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {/* Price Comparison */}
        {insights.routeStats && (
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-semibold text-blue-800">Price Analysis</h4>
              {insights.routeStats.priceComparison === 'below' ? (
                <FaTrendingDown className="text-green-500" />
              ) : (
                <FaTrendingUp className="text-red-500" />
              )}
            </div>
            <div className="space-y-1">
              <div className="text-sm text-blue-700">
                Your Price: <span className="font-bold">₹{bookingData.totalPrice}</span>
              </div>
              <div className="text-sm text-blue-600">
                Average: ₹{insights.routeStats.averagePrice.toFixed(0)}
              </div>
              <div className={`text-xs font-medium ${
                insights.routeStats.priceComparison === 'below' 
                  ? 'text-green-600' 
                  : 'text-red-600'
              }`}>
                {insights.routeStats.priceComparison === 'below' 
                  ? '↓ Below average price' 
                  : '↑ Above average price'
                }
              </div>
            </div>
          </div>
        )}

        {/* Route Popularity */}
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-semibold text-green-800">Route Popularity</h4>
            <FaUsers className="text-green-600" />
          </div>
          <div className="space-y-1">
            <div className="text-sm text-green-700">
              Available Flights: <span className="font-bold">{insights.routeStats?.totalFlights || 0}</span>
            </div>
            <div className="text-sm text-green-600">
              {bookingData.departure} → {bookingData.arrival}
            </div>
            <div className="text-xs font-medium text-green-600">
              ⭐ Popular route
            </div>
          </div>
        </div>

        {/* Best Time to Fly */}
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 border border-purple-200">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-semibold text-purple-800">Best Time</h4>
            <FaClock className="text-purple-600" />
          </div>
          <div className="space-y-1">
            <div className="text-sm text-purple-700">
              Your Time: <span className="font-bold">{bookingData.departureTime}</span>
            </div>
            <div className="text-sm text-purple-600">
              Peak: 18:00-21:00
            </div>
            <div className="text-xs font-medium text-purple-600">
              ✓ Good timing choice
            </div>
          </div>
        </div>
      </div>

      {/* Price History Chart */}
      {insights.priceHistory.length > 0 && (
        <div className="mb-6">
          <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
            <FaCalendarAlt className="mr-2 text-blue-600" />
            7-Day Price Trend
          </h4>
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-end justify-between h-32 space-x-2">
              {insights.priceHistory.map((day, index) => {
                const maxPrice = Math.max(...insights.priceHistory.map(d => d.price));
                const height = (day.price / maxPrice) * 100;
                const isCurrentPrice = Math.abs(day.price - parseFloat(bookingData.totalPrice)) < 500;
                
                return (
                  <div key={index} className="flex-1 flex flex-col items-center">
                    <div 
                      className={`w-full rounded-t transition-all duration-300 ${
                        isCurrentPrice 
                          ? 'bg-blue-600' 
                          : 'bg-gray-300 hover:bg-blue-400'
                      }`}
                      style={{ height: `${height}%` }}
                      title={`₹${day.price.toFixed(0)}`}
                    ></div>
                    <div className="text-xs text-gray-600 mt-1 text-center">
                      {day.date.split('/').slice(0, 2).join('/')}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Popular Flight Times */}
      <div>
        <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
          <FaClock className="mr-2 text-green-600" />
          Popular Departure Times
        </h4>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {insights.popularTimes.map((timeSlot, index) => (
            <div 
              key={index} 
              className="bg-gray-50 rounded-lg p-3 border border-gray-200 hover:border-blue-300 transition-colors"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-800">{timeSlot.label}</span>
                <span className="text-xs text-gray-600">{timeSlot.popularity}%</span>
              </div>
              <div className="text-xs text-gray-600 mb-2">{timeSlot.time}</div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${timeSlot.popularity}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Helpful Tips */}
      <div className="mt-6 bg-blue-50 rounded-lg p-4 border border-blue-200">
        <div className="flex items-start">
          <FaInfoCircle className="text-blue-600 mr-3 mt-1" />
          <div>
            <h5 className="font-semibold text-blue-800 mb-2">Travel Tips</h5>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Book 2-3 weeks in advance for better prices</li>
              <li>• Tuesday and Wednesday flights are typically cheaper</li>
              <li>• Early morning flights have fewer delays</li>
              <li>• Check weather conditions before travel</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlightInsights;