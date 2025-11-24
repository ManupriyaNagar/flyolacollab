"use client";

import React, { useState, useEffect } from "react";
import { FaPlane, FaClock, FaRupeeSign, FaArrowRight } from "react-icons/fa";
import BASE_URL from "@/baseUrl/baseUrl";

const RelatedFlights = ({ currentBooking }) => {
  const [relatedFlights, setRelatedFlights] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRelatedFlights = async () => {
      try {
        const token = localStorage.getItem("token");
        const headers = {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        };

        // Fetch flight schedules to show related flights
        const response = await fetch(`${BASE_URL}/flight-schedules`, { headers });
        if (response.ok) {
          const data = await response.json();
          // Filter out current flight and show similar routes or popular destinations
          const filtered = data
            .filter(flight => flight.id !== currentBooking?.id)
            .slice(0, 3); // Show only 3 related flights
          setRelatedFlights(filtered);
        }
      } catch (error) {
      } finally {
        setLoading(false);
      }
    };

    if (currentBooking) {
      fetchRelatedFlights();
    }
  }, [currentBooking]);

  if (loading || relatedFlights.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
      <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
        <FaPlane className="mr-2 text-blue-600" />
        You Might Also Like
      </h3>
      <div className="space-y-4">
        {relatedFlights.map((flight, index) => (
          <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="text-center">
                  <div className="font-semibold text-gray-800">{flight.departure_city || 'DEL'}</div>
                  <div className="text-xs text-gray-500">{flight.departure_time}</div>
                </div>
                <FaArrowRight className="text-gray-400" />
                <div className="text-center">
                  <div className="font-semibold text-gray-800">{flight.arrival_city || 'BOM'}</div>
                  <div className="text-xs text-gray-500">{flight.arrival_time}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center text-green-600 font-semibold">
                  <FaRupeeSign className="text-sm" />
                  {flight.price || '5,999'}
                </div>
                <div className="text-xs text-gray-500 flex items-center">
                  <FaClock className="mr-1" />
                  {flight.duration || '2h 30m'}
                </div>
              </div>
            </div>
            <button className="w-full mt-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors duration-200 text-sm font-medium">
              View Details
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RelatedFlights;