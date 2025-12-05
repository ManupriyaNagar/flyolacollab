"use client";

import BASE_URL from "@/baseUrl/baseUrl";
import { useEffect, useState } from "react";
import {
    FaCalendarAlt,
    FaCheckCircle,
    FaClock,
    FaInfoCircle,
    FaMapMarkerAlt,
    FaPlane,
    FaUsers
} from "react-icons/fa";

const TourReviewStep = ({
  bookingData,
  handleNextStep,
  handlePreviousStep,
  step,
}) => {
  const [flightDetails, setFlightDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFlightDetails = async () => {
      try {
        const token = localStorage.getItem("token");
        const headers = {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        };

        // Fetch additional flight schedule details
        const response = await fetch(
          `${BASE_URL}/flight-schedules/${bookingData.id}`,
          { headers }
        );
        
        if (response.ok) {
          const data = await response.json();
          setFlightDetails(data);
        }
      } catch (error) {
      } finally {
        setLoading(false);
      }
    };

    if (bookingData?.id) {
      fetchFlightDetails();
    } else {
      setLoading(false);
    }
  }, [bookingData?.id]);

  const totalPassengers = bookingData.passengers.adults + bookingData.passengers.children + bookingData.passengers.infants;

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
      <div className="flex items-center mb-6">
        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
          <FaPlane className="text-blue-600 text-xl" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Review Your Flight</h2>
          <p className="text-gray-600">Please verify your flight details before proceeding</p>
        </div>
      </div>

      {/* Flight Route Card */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 mb-6 border border-blue-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-800">{bookingData.departure}</div>
              <div className="text-sm text-gray-600">Departure</div>
              <div className="text-sm font-medium text-blue-600">{bookingData.departureTime}</div>
            </div>
            <div className="flex-1 flex items-center justify-center px-4">
              <div className="w-full h-px bg-blue-300 relative">
                <FaPlane className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-blue-50 text-blue-600 px-2" />
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-800">{bookingData.arrival}</div>
              <div className="text-sm text-gray-600">Arrival</div>
              <div className="text-sm font-medium text-blue-600">{bookingData.arrivalTime}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Flight Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="space-y-4">
          <div className="flex items-center p-4 bg-gray-50 rounded-lg">
            <FaCalendarAlt className="text-blue-500 mr-3" />
            <div>
              <div className="text-sm text-gray-600">Travel Date</div>
              <div className="font-semibold text-gray-800">{bookingData.selectedDate}</div>
            </div>
          </div>
          
          <div className="flex items-center p-4 bg-gray-50 rounded-lg">
            <FaUsers className="text-green-500 mr-3" />
            <div>
              <div className="text-sm text-gray-600">Passengers</div>
              <div className="font-semibold text-gray-800">
                {totalPassengers} Passenger{totalPassengers > 1 ? 's' : ''}
              </div>
              <div className="text-xs text-gray-500">
                {bookingData.passengers.adults > 0 && `${bookingData.passengers.adults} Adult${bookingData.passengers.adults > 1 ? 's' : ''}`}
                {bookingData.passengers.children > 0 && `, ${bookingData.passengers.children} Child${bookingData.passengers.children > 1 ? 'ren' : ''}`}
                {bookingData.passengers.infants > 0 && `, ${bookingData.passengers.infants} Infant${bookingData.passengers.infants > 1 ? 's' : ''}`}
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center p-4 bg-gray-50 rounded-lg">
            <FaClock className="text-purple-500 mr-3" />
            <div>
              <div className="text-sm text-gray-600">Flight Duration</div>
              <div className="font-semibold text-gray-800">
                {flightDetails?.duration || "2h 30m"}
              </div>
            </div>
          </div>

          <div className="flex items-center p-4 bg-gray-50 rounded-lg">
            <FaMapMarkerAlt className="text-red-500 mr-3" />
            <div>
              <div className="text-sm text-gray-600">Flight Number</div>
              <div className="font-semibold text-gray-800">
                {flightDetails?.flight_number || `FL${bookingData.id}`}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Important Information */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
        <div className="flex items-start">
          <FaInfoCircle className="text-yellow-600 mr-3 mt-1" />
          <div>
            <h4 className="font-semibold text-yellow-800 mb-2">Important Information</h4>
            <ul className="text-sm text-yellow-700 space-y-1">
              <li>• Please arrive at the airport at least 1 hours before departure</li>
              <li>• Carry a valid government-issued photo ID</li>
              <li>• Check-in closes 30 minutes before departure</li>
              <li>• All prices are in Indian Rupees and subject to change</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Terms and Conditions */}
      <div className="bg-gray-50 rounded-lg p-4 mb-6">
        <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
          <FaCheckCircle className="text-green-500 mr-2" />
          Terms & Conditions
        </h4>
        <div className="text-sm text-gray-600 space-y-2">
          <div className="flex items-start">
            <div className="w-2 h-2 bg-gray-400 rounded-full mr-2 mt-2"></div>
            <span>Cancellation charges apply as per airline policy</span>
          </div>
          <div className="flex items-start">
            <div className="w-2 h-2 bg-gray-400 rounded-full mr-2 mt-2"></div>
            <span>
              {bookingData?.bookingType === 'helicopter' 
                ? 'Baggage policy: 2kg per passenger' 
                : 'Baggage allowance: 7kg per passenger'}
            </span>
          </div>
          {bookingData?.bookingType === 'helicopter' && (
            <div className="flex items-start">
              <div className="w-2 h-2 bg-orange-400 rounded-full mr-2 mt-2"></div>
              <span className="font-medium text-orange-700">Weight policy: ₹500 per kg over 75kg per passenger</span>
            </div>
          )}
          <div className="flex items-start">
            <div className="w-2 h-2 bg-gray-400 rounded-full mr-2 mt-2"></div>
            <span>Seat selection is subject to availability</span>
          </div>
          {bookingData?.bookingType === 'helicopter' && (
            <div className="flex items-start">
              <div className="w-2 h-2 bg-gray-400 rounded-full mr-2 mt-2"></div>
              <span className="font-medium">Match passenger details exactly with ID documents</span>
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <button
          onClick={handlePreviousStep}
          className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={step === 1}
        >
          Previous
        </button>
        <button
          onClick={handleNextStep}
          className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl"
        >
          Continue to Traveler Info →
        </button>
      </div>
    </div>
  );
};

export default TourReviewStep;
