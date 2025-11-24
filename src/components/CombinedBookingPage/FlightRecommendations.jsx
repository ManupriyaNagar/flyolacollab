"use client";

import React, { useState, useEffect } from "react";
import { 
  FaPlane, 
  FaStar, 
  FaClock, 
  FaMapMarkerAlt,
  FaArrowRight,
  FaHeart,
  FaShare
} from "react-icons/fa";
import BASE_URL from "@/baseUrl/baseUrl";

const FlightRecommendations = ({ currentBooking }) => {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const token = localStorage.getItem("token");
        const headers = {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        };

        const response = await fetch(`${BASE_URL}/flight-schedules`, { headers });
        if (response.ok) {
          const schedules = await response.json();
          
          // Filter and recommend similar or alternative flights
          const filtered = schedules
            .filter(schedule => 
              schedule.id !== currentBooking?.id &&
              (schedule.departure_location === currentBooking?.departure ||
               schedule.arrival_location === currentBooking?.arrival)
            )
            .slice(0, 4)
            .map(schedule => ({
              ...schedule,
              rating: (Math.random() * 2 + 3).toFixed(1), // Mock rating 3-5
              duration: `${Math.floor(Math.random() * 3 + 1)}h ${Math.floor(Math.random() * 60)}m`,
              airline: "Flyola Airlines",
              aircraft: "Boeing 737-800"
            }));

          setRecommendations(filtered);
        }
      } catch (error) {
      } finally {
        setLoading(false);
      }
    };

    if (currentBooking) {
      fetchRecommendations();
    }
  }, [currentBooking]);

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 rounded w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (recommendations.length === 0) return null;

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <FaPlane className="text-blue-600 text-2xl mr-3" />
          <div>
            <h3 className="text-xl font-bold text-gray-800">Alternative Flights</h3>
            <p className="text-gray-600">Similar routes you might consider</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {recommendations.map((flight, index) => (
          <div 
            key={flight.id} 
            className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 hover:shadow-md transition-all duration-300 cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <FaPlane className="text-blue-600 text-sm" />
                </div>
                <div>
                  <div className="font-semibold text-gray-800">{flight.airline}</div>
                  <div className="text-xs text-gray-500">{flight.aircraft}</div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button className="p-1 hover:bg-gray-100 rounded">
                  <FaHeart className="text-gray-400 hover:text-red-500 text-sm" />
                </button>
                <button className="p-1 hover:bg-gray-100 rounded">
                  <FaShare className="text-gray-400 hover:text-blue-500 text-sm" />
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-4">
                <div className="text-center">
                  <div className="font-bold text-gray-800">{flight.departure_location}</div>
                  <div className="text-sm text-gray-500">{flight.departure_time}</div>
                </div>
                <div className="flex flex-col items-center">
                  <div className="text-xs text-gray-500 mb-1">{flight.duration}</div>
                  <div className="flex items-center">
                    <div className="w-8 h-px bg-gray-300"></div>
                    <FaArrowRight className="text-gray-400 text-xs mx-1" />
                    <div className="w-8 h-px bg-gray-300"></div>
                  </div>
                </div>
                <div className="text-center">
                  <div className="font-bold text-gray-800">{flight.arrival_location}</div>
                  <div className="text-sm text-gray-500">{flight.arrival_time}</div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="flex items-center">
                  <FaStar className="text-yellow-400 text-sm mr-1" />
                  <span className="text-sm font-medium">{flight.rating}</span>
                </div>
                <div className="text-xs text-gray-500">
                  ({Math.floor(Math.random() * 500 + 100)} reviews)
                </div>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-blue-600">₹{flight.price}</div>
                <div className="text-xs text-gray-500">per person</div>
              </div>
            </div>

            <div className="mt-3 pt-3 border-t border-gray-100">
              <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors group-hover:bg-blue-700">
                Select This Flight
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 text-center">
        <button className="text-blue-600 hover:text-blue-700 font-medium text-sm">
          View All Alternative Flights →
        </button>
      </div>
    </div>
  );
};

export default FlightRecommendations;