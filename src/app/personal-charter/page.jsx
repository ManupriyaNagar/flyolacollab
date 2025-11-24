"use client";

import React, { useState } from 'react';


const PersonalCharterPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    departure: '',
    destination: '',
    date: '',
    returnDate: '',
    passengers: '',
    tripType: 'one-way',
    specialRequests: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  const features = [
    {
      title: "Luxurious Fleet",
      description: "State-of-the-art private jets with premium amenities and cutting-edge technology",
      icon: "✈️",
      details: ["Premium leather seating", "Advanced entertainment systems", "Climate control", "Spacious cabins"]
    },
    {
      title: "Personalized Service",
      description: "Tailored service to meet your specific preferences and requirements",
      icon: "🎯",
      details: ["Custom catering options", "Personalized itineraries", "Dedicated crew", "Special occasion arrangements"]
    },
    {
      title: "Flexible Scheduling",
      description: "Fly according to your schedule with 24/7 availability and last-minute bookings",
      icon: "🕒",
      details: ["On-demand departures", "Flexible timing", "Last-minute changes", "Multi-destination trips"]
    },
    {
      title: "Privacy & Comfort",
      description: "Complete privacy and unmatched comfort for you and your companions",
      icon: "🛋️",
      details: ["Private cabin space", "Confidential travel", "Comfortable seating", "Quiet environment"]
    }
  ];

  const aircraftOptions = [
    {
      name: "Light Jets",
      capacity: "4-6 passengers",
      range: "1,500-2,500 km",
      features: ["Perfect for short trips", "Cost-effective option", "Quick boarding"],
      price: "₹1,50,000 - ₹2,50,000",
      image: "/api/placeholder/300/200"
    },
    {
      name: "Mid-Size Jets",
      capacity: "6-8 passengers",
      range: "2,500-4,000 km",
      features: ["Ideal for medium distances", "Enhanced comfort", "More luggage space"],
      price: "₹2,50,000 - ₹4,00,000",
      image: "/api/placeholder/300/200"
    },
    {
      name: "Heavy Jets",
      capacity: "8-14 passengers",
      range: "4,000+ km",
      features: ["Long-range capability", "Maximum luxury", "Full-service amenities"],
      price: "₹4,00,000 - ₹8,00,000",
      image: "/api/placeholder/300/200"
    }
  ];

  const occasions = [
    { name: "Business Travel", icon: "💼" },
    { name: "Family Vacation", icon: "👨‍👩‍👧‍👦" },
    { name: "Romantic Getaway", icon: "💕" },
    { name: "Special Celebrations", icon: "🎉" },
    { name: "Medical Transport", icon: "🏥" },
    { name: "Emergency Travel", icon: "🚨" }
  ];

  return (
    <div className="min-h-screen bg-gray-50">


      {/* Hero Section */}
      <div className="bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl font-bold mb-6">Personal Charter Services</h1>
            <p className="text-xl mb-8 max-w-3xl mx-auto">
              Experience the ultimate in personalized air travel. Our private charter services are designed
              to provide you with luxury, comfort, and convenience tailored to your individual needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-white text-purple-900 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors duration-200">
                Book Your Charter
              </button>
              <button className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white hover:text-purple-900 transition-colors duration-200">
                View Aircraft
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className=" px-4 sm:px-6 lg:px-8 py-16">

        {/* Features Section */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose Personal Charter?</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover the advantages of flying with our personalized charter services
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
                <div className="text-center mb-4">
                  <div className="text-4xl mb-2">{feature.icon}</div>
                  <h3 className="text-xl font-semibold text-gray-900">{feature.title}</h3>
                </div>
                <p className="text-gray-600 mb-4">{feature.description}</p>
                <ul className="space-y-1">
                  {feature.details.map((detail, idx) => (
                    <li key={idx} className="text-gray-600 flex items-center text-sm">
                      <span className="w-1.5 h-1.5 bg-purple-500 rounded-full mr-2"></span>
                      {detail}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* Aircraft Options */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Choose Your Aircraft</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {aircraftOptions.map((aircraft, index) => (
              <div key={index} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                <div className="h-48 bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center">
                  <span className="text-white text-xl font-semibold">{aircraft.name}</span>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{aircraft.name}</h3>
                  <p className="text-purple-600 font-semibold mb-3">{aircraft.price}</p>
                  <div className="space-y-2 mb-4">
                    <p className="text-gray-600"><strong>Capacity:</strong> {aircraft.capacity}</p>
                    <p className="text-gray-600"><strong>Range:</strong> {aircraft.range}</p>
                  </div>
                  <ul className="space-y-1 mb-4">
                    {aircraft.features.map((feature, idx) => (
                      <li key={idx} className="text-gray-600 flex items-center">
                        <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <button className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition-colors duration-200">
                    Select Aircraft
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Perfect For Section */}
        <section className="mb-16">
          <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-lg p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Perfect For Every Occasion</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
              {occasions.map((occasion, index) => (
                <div key={index} className="text-center">
                  <div className="bg-white rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow duration-300">
                    <div className="text-3xl mb-2">{occasion.icon}</div>
                    <p className="text-gray-700 font-medium text-sm">{occasion.name}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Booking Form */}
        <section className="mb-16">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Book Your Personal Charter</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Enter your full name"
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Enter your phone number"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Enter your email address"
                  />
                </div>

                <div>
                  <label htmlFor="passengers" className="block text-sm font-medium text-gray-700 mb-2">
                    Number of Passengers *
                  </label>
                  <select
                    id="passengers"
                    name="passengers"
                    required
                    value={formData.passengers}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="">Select passengers</option>
                    <option value="1">1 passenger</option>
                    <option value="2">2 passengers</option>
                    <option value="3-4">3-4 passengers</option>
                    <option value="5-8">5-8 passengers</option>
                    <option value="9+">9+ passengers</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="departure" className="block text-sm font-medium text-gray-700 mb-2">
                    Departure Location *
                  </label>
                  <input
                    type="text"
                    id="departure"
                    name="departure"
                    required
                    value={formData.departure}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Enter departure city/airport"
                  />
                </div>

                <div>
                  <label htmlFor="destination" className="block text-sm font-medium text-gray-700 mb-2">
                    Destination *
                  </label>
                  <input
                    type="text"
                    id="destination"
                    name="destination"
                    required
                    value={formData.destination}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Enter destination city/airport"
                  />
                </div>

                <div>
                  <label htmlFor="tripType" className="block text-sm font-medium text-gray-700 mb-2">
                    Trip Type *
                  </label>
                  <select
                    id="tripType"
                    name="tripType"
                    required
                    value={formData.tripType}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="one-way">One Way</option>
                    <option value="round-trip">Round Trip</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-2">
                    Departure Date *
                  </label>
                  <input
                    type="date"
                    id="date"
                    name="date"
                    required
                    value={formData.date}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                {formData.tripType === 'round-trip' && (
                  <div>
                    <label htmlFor="returnDate" className="block text-sm font-medium text-gray-700 mb-2">
                      Return Date *
                    </label>
                    <input
                      type="date"
                      id="returnDate"
                      name="returnDate"
                      required={formData.tripType === 'round-trip'}
                      value={formData.returnDate}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                )}
              </div>

              <div>
                <label htmlFor="specialRequests" className="block text-sm font-medium text-gray-700 mb-2">
                  Special Requests or Requirements
                </label>
                <textarea
                  id="specialRequests"
                  name="specialRequests"
                  rows={4}
                  value={formData.specialRequests}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                  placeholder="Any special catering, accessibility needs, or other requirements"
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full bg-purple-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-purple-700 transition-colors duration-200"
              >
                Submit Charter Request
              </button>
            </form>
          </div>
        </section>

        {/* Contact Section */}
        <section className="bg-gradient-to-br from-purple-600 to-indigo-700 rounded-lg p-8 text-white text-center">
          <h2 className="text-3xl font-bold mb-4">Ready for Your Personal Charter Experience?</h2>
          <p className="text-xl mb-6">
            Contact our personal charter specialists for customized solutions and instant quotes
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-6">
            <div className="flex items-center gap-2">
              <span className="text-lg">📞</span>
              <span className="text-lg font-semibold">+91 9311896389, +91 9202961237</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-lg">✉️</span>
              <span className="text-lg font-semibold">personal@flyola.com</span>
            </div>
          </div>
          <button className="bg-white text-purple-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-200">
            Get Instant Quote
          </button>
        </section>
      </div>


    </div>
  );
};

export default PersonalCharterPage;