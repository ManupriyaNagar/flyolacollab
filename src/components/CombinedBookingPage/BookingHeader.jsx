"use client";

import React from "react";
import {
  FaPlane,
  FaShieldAlt,
  FaClock,
  FaHeadset,
  FaStar,
  FaMapMarkerAlt
} from "react-icons/fa";

const BookingHeader = ({ bookingData, currentStep }) => {
  const stepTitles = {
    1: "Review Your Flight",
    2: "Traveler Information",
    3: "Payment & Confirmation"
  };

  const stepDescriptions = {
    1: "Verify your flight details and amenities",
    2: "Enter passenger details and preferences",
    3: "Complete your secure payment"
  };

  return (
    <div className="mb-8">
      {/* Main Header */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full mb-4">
          <FaPlane className="text-white text-2xl" />
        </div>
        <h1 className="text-4xl font-bold text-gray-800 mb-2">
          {stepTitles[currentStep]}
        </h1>
        <p className="text-lg text-gray-600 mb-4">
          {stepDescriptions[currentStep]}
        </p>
      </div>

      {/* Flight Route Summary */}
      {bookingData && (
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 border border-gray-100">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center space-x-6 mb-4 md:mb-0">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-800">{bookingData.departure}</div>
                <div className="text-sm text-gray-500">Departure</div>
                <div className="text-sm font-medium text-blue-600">{bookingData.departureTime}</div>
              </div>

              <div className="flex items-center space-x-2">
                <div className="w-12 h-px bg-gray-300"></div>
                <FaPlane className="text-blue-600 text-lg" />
                <div className="w-12 h-px bg-gray-300"></div>
              </div>

              <div className="text-center">
                <div className="text-2xl font-bold text-gray-800">{bookingData.arrival}</div>
                <div className="text-sm text-gray-500">Arrival</div>
                <div className="text-sm font-medium text-blue-600">{bookingData.arrivalTime}</div>
              </div>
            </div>

            <div className="text-center md:text-right">
              <div className="text-3xl font-bold text-blue-600">₹{bookingData.totalPrice}</div>
              <div className="text-sm text-gray-500">Total Amount</div>
            </div>
          </div>
        </div>
      )}

      {/* Trust Indicators */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="flex items-center justify-center p-3 bg-white rounded-lg shadow-sm border border-gray-100">
          <FaShieldAlt className="text-green-500 mr-2" />
          <span className="text-sm font-medium text-gray-700">Secure Booking</span>
        </div>
        <div className="flex items-center justify-center p-3 bg-white rounded-lg shadow-sm border border-gray-100">
          <FaClock className="text-blue-500 mr-2" />
          <span className="text-sm font-medium text-gray-700">Instant Confirmation</span>
        </div>
        <div className="flex items-center justify-center p-3 bg-white rounded-lg shadow-sm border border-gray-100">
          <FaHeadset className="text-purple-500 mr-2" />
          <span className="text-sm font-medium text-gray-700">24/7 Support</span>
        </div>
        <div className="flex items-center justify-center p-3 bg-white rounded-lg shadow-sm border border-gray-100">
          <FaStar className="text-yellow-500 mr-2" />
          <span className="text-sm font-medium text-gray-700">5-Star Service</span>
        </div>
      </div>
    </div>
  );
};

export default BookingHeader;