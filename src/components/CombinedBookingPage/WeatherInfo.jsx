"use client";

import React, { useState, useEffect } from "react";
import { 
  FaCloud, 
  FaSun, 
  FaCloudRain,
  FaThermometerHalf,
  FaEye,
  FaTint,
  FaWind,
  FaMapMarkerAlt
} from "react-icons/fa";

const WeatherInfo = ({ bookingData }) => {
  const [weather, setWeather] = useState({
    departure: null,
    arrival: null,
    loading: true,
    error: null
  });

  // Mock weather data generator (replace with real API in production)
  const generateMockWeather = (location) => {
    const conditions = ['sunny', 'cloudy', 'rainy', 'partly-cloudy'];
    const condition = conditions[Math.floor(Math.random() * conditions.length)];
    
    return {
      location,
      condition,
      temperature: Math.floor(Math.random() * 20) + 15, // 15-35°C
      humidity: Math.floor(Math.random() * 40) + 40, // 40-80%
      windSpeed: Math.floor(Math.random() * 15) + 5, // 5-20 km/h
      visibility: Math.floor(Math.random() * 5) + 5, // 5-10 km
      description: {
        'sunny': 'Clear skies',
        'cloudy': 'Overcast',
        'rainy': 'Light rain',
        'partly-cloudy': 'Partly cloudy'
      }[condition]
    };
  };

  const getWeatherIcon = (condition) => {
    switch (condition) {
      case 'sunny':
        return <FaSun className="text-yellow-500 text-2xl" />;
      case 'cloudy':
        return <FaCloud className="text-gray-500 text-2xl" />;
      case 'rainy':
        return <FaCloudRain className="text-blue-500 text-2xl" />;
      case 'partly-cloudy':
        return <FaCloud className="text-gray-400 text-2xl" />;
      default:
        return <FaSun className="text-yellow-500 text-2xl" />;
    }
  };

  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
        // In a real application, you would fetch from a weather API
        // For now, we'll use mock data
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay
        
        const departureWeather = generateMockWeather(bookingData.departure);
        const arrivalWeather = generateMockWeather(bookingData.arrival);

        setWeather({
          departure: departureWeather,
          arrival: arrivalWeather,
          loading: false,
          error: null
        });
      } catch (error) {
        setWeather(prev => ({
          ...prev,
          loading: false,
          error: "Unable to fetch weather information"
        }));
      }
    };

    if (bookingData) {
      fetchWeatherData();
    }
  }, [bookingData]);

  if (weather.loading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1, 2].map(i => (
              <div key={i} className="space-y-3">
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="h-20 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (weather.error) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
        <div className="text-center text-gray-500">
          <FaCloud className="text-4xl mx-auto mb-2 opacity-50" />
          <p>{weather.error}</p>
        </div>
      </div>
    );
  }

  const WeatherCard = ({ weatherData, title }) => (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-100">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center">
          <FaMapMarkerAlt className="text-blue-600 mr-2" />
          <h4 className="font-semibold text-gray-800">{title}</h4>
        </div>
        {getWeatherIcon(weatherData.condition)}
      </div>
      
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold text-gray-800">
            {weatherData.temperature}°C
          </span>
          <span className="text-sm text-gray-600 capitalize">
            {weatherData.description}
          </span>
        </div>
        
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="flex items-center">
            <FaTint className="text-blue-500 mr-2" />
            <span className="text-gray-600">
              {weatherData.humidity}% Humidity
            </span>
          </div>
          <div className="flex items-center">
            <FaWind className="text-gray-500 mr-2" />
            <span className="text-gray-600">
              {weatherData.windSpeed} km/h
            </span>
          </div>
          <div className="flex items-center">
            <FaEye className="text-green-500 mr-2" />
            <span className="text-gray-600">
              {weatherData.visibility} km
            </span>
          </div>
          <div className="flex items-center">
            <FaThermometerHalf className="text-red-500 mr-2" />
            <span className="text-gray-600">
              Feels like {weatherData.temperature + Math.floor(Math.random() * 6) - 3}°C
            </span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
      <div className="flex items-center mb-6">
        <FaCloud className="text-blue-600 text-2xl mr-3" />
        <div>
          <h3 className="text-xl font-bold text-gray-800">Weather Information</h3>
          <p className="text-gray-600">Current weather conditions at your destinations</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <WeatherCard 
          weatherData={weather.departure}
          title={`${bookingData.departure} (Departure)`}
        />
        <WeatherCard 
          weatherData={weather.arrival}
          title={`${bookingData.arrival} (Arrival)`}
        />
      </div>

      {/* Weather Advisory */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <h5 className="font-semibold text-yellow-800 mb-2 flex items-center">
          <FaCloud className="mr-2" />
          Travel Advisory
        </h5>
        <div className="text-sm text-yellow-700 space-y-1">
          {weather.departure?.condition === 'rainy' || weather.arrival?.condition === 'rainy' ? (
            <p>• Rain expected - carry an umbrella and allow extra travel time</p>
          ) : null}
          {weather.departure?.temperature < 10 || weather.arrival?.temperature < 10 ? (
            <p>• Cold weather - pack warm clothing</p>
          ) : null}
          {weather.departure?.temperature > 30 || weather.arrival?.temperature > 30 ? (
            <p>• Hot weather - stay hydrated and wear light clothing</p>
          ) : null}
          {weather.departure?.windSpeed > 15 || weather.arrival?.windSpeed > 15 ? (
            <p>• Windy conditions - possible flight delays</p>
          ) : null}
          <p>• Check weather updates before departure</p>
          <p>• Dress appropriately for both departure and arrival destinations</p>
        </div>
      </div>

      {/* 3-Day Forecast Preview */}
      <div className="mt-6">
        <h5 className="font-semibold text-gray-800 mb-3">3-Day Forecast</h5>
        <div className="grid grid-cols-3 gap-3">
          {['Today', 'Tomorrow', 'Day 3'].map((day, index) => {
            const temp = weather.departure?.temperature + Math.floor(Math.random() * 10) - 5;
            const condition = ['sunny', 'cloudy', 'partly-cloudy'][index];
            
            return (
              <div key={index} className="text-center bg-gray-50 rounded-lg p-3">
                <div className="text-sm font-medium text-gray-800 mb-1">{day}</div>
                <div className="mb-2">{getWeatherIcon(condition)}</div>
                <div className="text-sm text-gray-600">{temp}°C</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default WeatherInfo;