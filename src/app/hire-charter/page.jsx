"use client";

import React, { useState } from 'react';


const HireCharterPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    charterType: '',
    departure: '',
    destination: '',
    date: '',
    passengers: '',
    message: ''
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

  const charterTypes = [
    {
      title: "Business Charter",
      description: "Executive travel solutions with premium amenities and flexible scheduling",
      features: ["Wi-Fi connectivity", "Conference facilities", "Gourmet catering", "Priority boarding"],
      icon: "💼",
      price: "Starting from ₹2,50,000"
    },
    {
      title: "Leisure Charter",
      description: "Luxury travel for vacations, special occasions, and personal trips",
      features: ["Comfortable seating", "Entertainment systems", "Custom itineraries", "Scenic routes"],
      icon: "🏖️",
      price: "Starting from ₹2,00,000"
    },
    {
      title: "Group Charter",
      description: "Perfect for corporate events, weddings, and large group travel",
      features: ["Large capacity", "Group discounts", "Event coordination", "Flexible timing"],
      icon: "👥",
      price: "Starting from ₹3,50,000"
    },
    {
      title: "VIP Charter",
      description: "Ultra-luxury service for high-profile clients and special occasions",
      features: ["Premium aircraft", "Concierge service", "Enhanced privacy", "Luxury amenities"],
      icon: "⭐",
      price: "Starting from ₹5,00,000"
    },
    {
      title: "Medical Charter",
      description: "Emergency medical transport with specialized equipment and medical staff",
      features: ["Medical equipment", "Trained staff", "24/7 availability", "Quick response"],
      icon: "🚑",
      price: "Contact for pricing"
    },
    {
      title: "Cargo Charter",
      description: "Dedicated cargo flights for urgent and high-value shipments",
      features: ["Large cargo capacity", "Secure transport", "Time-critical delivery", "Special handling"],
      icon: "📦",
      price: "Contact for pricing"
    }
  ];

  const benefits = [
    {
      title: "Flexible Scheduling",
      description: "Depart and arrive on your schedule, not ours",
      icon: "🕒"
    },
    {
      title: "Direct Flights",
      description: "Fly directly to your destination without layovers",
      icon: "✈️"
    },
    {
      title: "Privacy & Comfort",
      description: "Enjoy complete privacy with luxury amenities",
      icon: "🛋️"
    },
    {
      title: "Time Efficiency",
      description: "Skip long queues and reach destinations faster",
      icon: "⚡"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">


      {/* Hero Section */}
      <div className="bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900 text-white py-20">
        <div className=" px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl font-bold mb-6">Hire Your Private Charter</h1>
            <p className="text-xl mb-8 max-w-3xl mx-auto">
              Experience the ultimate in private aviation with our comprehensive charter services.
              From business trips to special occasions, we provide tailored solutions for every need.
            </p>
            <button className="bg-white text-blue-900 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors duration-200">
              Get Instant Quote
            </button>
          </div>
        </div>
      </div>

      <div className=" px-4 sm:px-6 lg:px-8 py-16">

        {/* Charter Types */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Charter Services</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Choose from our comprehensive range of charter services designed to meet your specific travel requirements
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {charterTypes.map((charter, index) => (
              <div key={index} className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
                <div className="text-center mb-4">
                  <div className="text-4xl mb-2">{charter.icon}</div>
                  <h3 className="text-xl font-bold text-gray-900">{charter.title}</h3>
                  <p className="text-blue-600 font-semibold">{charter.price}</p>
                </div>
                <p className="text-gray-600 mb-4">{charter.description}</p>
                <ul className="space-y-2 mb-4">
                  {charter.features.map((feature, idx) => (
                    <li key={idx} className="text-gray-600 flex items-center">
                      <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                      {feature}
                    </li>
                  ))}
                </ul>
                <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200">
                  Select This Charter
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Benefits Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Why Choose Charter Services?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl mb-4">{benefit.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{benefit.title}</h3>
                <p className="text-gray-600">{benefit.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Booking Process */}
        <section className="mb-16">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Simple Booking Process</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-blue-600">1</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Choose Service</h3>
                <p className="text-gray-600">Select the charter type that best fits your needs</p>
              </div>
              <div className="text-center">
                <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-blue-600">2</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Get Quote</h3>
                <p className="text-gray-600">Receive instant pricing based on your requirements</p>
              </div>
              <div className="text-center">
                <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-blue-600">3</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Confirm Booking</h3>
                <p className="text-gray-600">Secure your charter with payment and confirmation</p>
              </div>
              <div className="text-center">
                <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-blue-600">4</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Fly in Style</h3>
                <p className="text-gray-600">Enjoy your premium charter experience</p>
              </div>
            </div>
          </div>
        </section>

        {/* Charter Request Form */}
        <section className="mb-16">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Request Your Charter</h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your email address"
                />
              </div>

              <div>
                <label htmlFor="charterType" className="block text-sm font-medium text-gray-700 mb-2">
                  Charter Type *
                </label>
                <select
                  id="charterType"
                  name="charterType"
                  required
                  value={formData.charterType}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select charter type</option>
                  <option value="business">Business Charter</option>
                  <option value="leisure">Leisure Charter</option>
                  <option value="group">Group Charter</option>
                  <option value="vip">VIP Charter</option>
                  <option value="medical">Medical Charter</option>
                  <option value="cargo">Cargo Charter</option>
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter destination city/airport"
                />
              </div>

              <div>
                <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-2">
                  Preferred Date *
                </label>
                <input
                  type="date"
                  id="date"
                  name="date"
                  required
                  value={formData.date}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select passengers</option>
                  <option value="1-2">1-2 passengers</option>
                  <option value="3-4">3-4 passengers</option>
                  <option value="5-8">5-8 passengers</option>
                  <option value="9-12">9-12 passengers</option>
                  <option value="13+">13+ passengers</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                  Additional Requirements
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  placeholder="Any special requirements or additional information"
                ></textarea>
              </div>

              <div className="md:col-span-2">
                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200"
                >
                  Submit Charter Request
                </button>
              </div>
            </form>
          </div>
        </section>

        {/* Contact Section */}
        <section className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-lg p-8 text-white text-center">
          <h2 className="text-3xl font-bold mb-4">Need Immediate Assistance?</h2>
          <p className="text-xl mb-6">
            Our charter specialists are available 24/7 to help you with urgent bookings and custom requirements
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <div className="flex items-center gap-2">
              <span className="text-lg">📞</span>
              <span className="text-lg font-semibold">+91 9311896389, +91 9202961237</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-lg">✉️</span>
              <span className="text-lg font-semibold">charter@flyola.com</span>
            </div>
          </div>
        </section>
      </div>


    </div>
  );
};

export default HireCharterPage;