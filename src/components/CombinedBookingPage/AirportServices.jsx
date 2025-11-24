"use client";

import React, { useState, useEffect } from "react";
import { 
  FaMapMarkerAlt, 
  FaCar, 
  FaUtensils, 
  FaShoppingBag,
  FaWifi,
  FaParking,
  FaCoffee,
  FaHotel,
  FaInfoCircle,
  FaClock,
  FaPhone,
  FaExternalLinkAlt
} from "react-icons/fa";
import BASE_URL from "@/baseUrl/baseUrl";

const AirportServices = ({ bookingData }) => {
  const [airports, setAirports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAirports = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`${BASE_URL}/airport`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const airportsData = await response.json();
          setAirports(airportsData);
        }
      } catch (error) {
      } finally {
        setLoading(false);
      }
    };

    fetchAirports();
  }, []);

  const getAirportInfo = (airportCode) => {
    return airports.find(airport => 
      airport.code === airportCode || 
      airport.name?.toLowerCase().includes(airportCode.toLowerCase())
    );
  };

  const departureAirport = getAirportInfo(bookingData?.departure);
  const arrivalAirport = getAirportInfo(bookingData?.arrival);

  const airportServices = [
    {
      icon: FaCar,
      title: "Transportation",
      description: "Taxi, bus, and rental car services",
      color: "text-blue-500"
    },
    {
      icon: FaUtensils,
      title: "Dining",
      description: "Restaurants, cafes, and food courts",
      color: "text-green-500"
    },
    {
      icon: FaShoppingBag,
      title: "Shopping",
      description: "Duty-free shops and retail stores",
      color: "text-purple-500"
    },
    {
      icon: FaWifi,
      title: "Free WiFi",
      description: "Complimentary internet access",
      color: "text-orange-500"
    },
    {
      icon: FaParking,
      title: "Parking",
      description: "Short and long-term parking options",
      color: "text-red-500"
    },
    {
      icon: FaCoffee,
      title: "Lounges",
      description: "Premium lounges and waiting areas",
      color: "text-brown-500"
    },
    {
      icon: FaHotel,
      title: "Hotels",
      description: "Airport hotels and nearby accommodations",
      color: "text-indigo-500"
    },
    {
      icon: FaInfoCircle,
      title: "Information",
      description: "Help desks and customer service",
      color: "text-teal-500"
    }
  ];

  const AirportCard = ({ airport, type, services }) => (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-200">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <FaMapMarkerAlt className="text-blue-600 mr-3 text-xl" />
          <div>
            <h4 className="font-bold text-gray-800">
              {airport?.name || `${bookingData[type]} Airport`}
            </h4>
            <p className="text-sm text-gray-600">{type === 'departure' ? 'Departure' : 'Arrival'} Airport</p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-lg font-bold text-blue-600">{bookingData[type]}</div>
          <div className="text-xs text-gray-500">Airport Code</div>
        </div>
      </div>

      {airport && (
        <div className="space-y-3 mb-4">
          <div className="flex items-center text-sm text-gray-600">
            <FaClock className="mr-2" />
            <span>Operating Hours: 24/7</span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <FaPhone className="mr-2" />
            <span>Contact: {airport.contact || '+91-XXX-XXX-XXXX'}</span>
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 gap-3">
        {services.slice(0, 4).map((service, index) => {
          const IconComponent = service.icon;
          return (
            <div key={index} className="flex items-center p-2 bg-white rounded border border-gray-200">
              <IconComponent className={`${service.color} mr-2`} />
              <span className="text-xs text-gray-700">{service.title}</span>
            </div>
          );
        })}
      </div>

      <button className="mt-4 w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm">
        <FaExternalLinkAlt className="mr-2" />
        View Airport Map
      </button>
    </div>
  );

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {[1, 2].map(i => (
              <div key={i} className="h-64 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
      <div className="flex items-center mb-6">
        <FaMapMarkerAlt className="text-blue-600 text-2xl mr-3" />
        <div>
          <h3 className="text-xl font-bold text-gray-800">Airport Services & Facilities</h3>
          <p className="text-gray-600">Everything you need to know about your airports</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <AirportCard 
          airport={departureAirport}
          type="departure"
          services={airportServices}
        />
        <AirportCard 
          airport={arrivalAirport}
          type="arrival"
          services={airportServices}
        />
      </div>

      {/* All Services Grid */}
      <div className="mb-6">
        <h4 className="font-semibold text-gray-800 mb-4">Available Services</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {airportServices.map((service, index) => {
            const IconComponent = service.icon;
            return (
              <div key={index} className="flex flex-col items-center p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-blue-300 transition-colors">
                <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center mb-3 shadow-sm">
                  <IconComponent className={`${service.color} text-xl`} />
                </div>
                <h5 className="font-medium text-gray-800 text-sm text-center mb-1">{service.title}</h5>
                <p className="text-xs text-gray-600 text-center">{service.description}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Travel Tips */}
      <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
        <div className="flex items-center mb-3">
          <FaInfoCircle className="text-blue-600 mr-2" />
          <h4 className="font-semibold text-blue-800">Airport Travel Tips</h4>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-700">
          <ul className="space-y-1">
            <li>• Arrive 2 hours early for domestic flights</li>
            <li>• Check-in online to save time</li>
            <li>• Keep documents ready for security</li>
            <li>• Download airport mobile apps</li>
          </ul>
          <ul className="space-y-1">
            <li>• Use airport WiFi for updates</li>
            <li>• Locate your gate upon arrival</li>
            <li>• Consider airport lounge access</li>
            <li>• Plan ground transportation in advance</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AirportServices;