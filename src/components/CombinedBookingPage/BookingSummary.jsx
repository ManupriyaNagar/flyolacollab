"use client";

import React, { useState, useEffect } from "react";
import { 
  FaPlane, 
  FaUsers, 
  FaMapMarkerAlt, 
  FaCalendarAlt,
  FaStar,
  FaTag,
  FaShieldAlt
} from "react-icons/fa";
import BASE_URL from "@/baseUrl/baseUrl";


import BookingPolicies from "./BookingPolicies";

const BookingSummary = ({ bookingData, travelerDetails, currentStep }) => {

  const [coupons, setCoupons] = useState([]);
  const [airports, setAirports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdditionalData = async () => {
      try {
        const token = localStorage.getItem("token");
        const headers = {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        };

        // Fetch reviews, coupons, and airports in parallel
        const [reviewsRes, couponsRes, airportsRes] = await Promise.allSettled([
          fetch(`${BASE_URL}/reviews`, { headers }),
          fetch(`${BASE_URL}/coupans`, { headers }),
          fetch(`${BASE_URL}/airport`, { headers })
        ]);


        if (couponsRes.status === 'fulfilled' && couponsRes.value.ok) {
          const couponsData = await couponsRes.value.json();
          setCoupons(couponsData.slice(0, 2)); // Show only 2 active coupons
        }

        if (airportsRes.status === 'fulfilled' && airportsRes.value.ok) {
          const airportsData = await airportsRes.value.json();
          setAirports(airportsData);
        }
      } catch (error) {
      } finally {
        setLoading(false);
      }
    };

    fetchAdditionalData();
  }, []);

  const getAirportInfo = (airportCode) => {
    return airports.find(airport => 
      airport.code === airportCode || 
      airport.name?.toLowerCase().includes(airportCode.toLowerCase())
    );
  };

  const departureAirport = getAirportInfo(bookingData?.departure);
  const arrivalAirport = getAirportInfo(bookingData?.arrival);

  if (!bookingData) return null;

  return (
    <div className="space-y-6">
      {/* Flight Summary Card */}
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
        <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
          <FaPlane className="mr-2 text-blue-600" />
          Flight Summary
        </h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <FaMapMarkerAlt className="text-green-500 mr-2" />
              <div>
                <div className="font-semibold text-gray-800">{bookingData.departure}</div>
                {departureAirport && (
                  <div className="text-sm text-gray-500">{departureAirport.name}</div>
                )}
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-500">Departure</div>
              <div className="font-medium">{bookingData.departureTime}</div>
            </div>
          </div>

          <div className="flex items-center justify-center">
            <div className="w-full h-px bg-gray-300 relative">
              <FaPlane className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white text-blue-600 px-1" />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <FaMapMarkerAlt className="text-red-500 mr-2" />
              <div>
                <div className="font-semibold text-gray-800">{bookingData.arrival}</div>
                {arrivalAirport && (
                  <div className="text-sm text-gray-500">{arrivalAirport.name}</div>
                )}
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-500">Arrival</div>
              <div className="font-medium">{bookingData.arrivalTime}</div>
            </div>
          </div>

          <div className="border-t pt-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="flex items-center text-gray-600">
                <FaCalendarAlt className="mr-2" />
                Date
              </span>
              <span className="font-medium">{bookingData.selectedDate}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center text-gray-600">
                <FaUsers className="mr-2" />
                Passengers
              </span>
              <span className="font-medium">{travelerDetails.length}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Price Breakdown */}
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Price Breakdown</h3>
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-600">Base Fare ({travelerDetails.length} passengers)</span>
            <span>₹{(parseFloat(bookingData.totalPrice) * 1).toFixed(2)}</span>
          </div>
         
          <div className="border-t pt-3 flex justify-between font-bold text-lg">
            <span>Total Amount</span>
            <span className="text-blue-600">₹{bookingData.totalPrice}</span>
          </div>
        </div>
      </div>

      {/* Flight Amenities */}


      {/* Available Coupons */}
      {coupons.length > 0 && (
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
            <FaTag className="mr-2 text-orange-500" />
            Available Offers
          </h3>
          <div className="space-y-3">
            {coupons.map((coupon, index) => (
              <div key={index} className="border border-dashed border-orange-300 rounded-lg p-3 bg-orange-50">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-orange-800">{coupon.code || `SAVE${index + 1}`}</div>
                    <div className="text-sm text-orange-600">
                      {coupon.description || `Get ${coupon.percent_off || 10}% off on your booking`}
                    </div>
                  </div>
                  <button className="text-xs bg-orange-500 text-white px-2 py-1 rounded">
                    Apply
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

   
      {/* Related Flights */}
     

      {/* Booking Policies */}
      <BookingPolicies />

      {/* Security & Support */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
        <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center">
          <FaShieldAlt className="mr-2 text-blue-600" />
          Secure Booking
        </h3>
        <div className="space-y-2 text-sm text-gray-600">
          <div className="flex items-center">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
            SSL Encrypted Payment
          </div>
          <div className="flex items-center">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
            24/7 Customer Support
          </div>
          <div className="flex items-center">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
            Instant Confirmation
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingSummary;