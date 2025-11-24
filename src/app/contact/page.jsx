"use client";

import React, { useState } from 'react';


const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    serviceType: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission here
  };

  const contactInfo = [
    {
      title: "Phone Numbers",
      details: ["+91 9311896389", "+91 9202961237"],
      icon: "📞",
      description: "For booking Call us"
    },
    {
      title: "Email Address",
      details: ["info@flyola.com", "support@flyola.com"],
      icon: "✉️",
      description: "Send us your queries"
    },
    {
      title: "Office Hours",
      details: ["Monday - Sunday", "24/7 Available"],
      icon: "🕒",
      description: "We're always here for you"
    },
    {
      title: "Emergency Contact",
      details: ["+91 9311896389", "Available 24/7"],
      icon: "🚨",
      description: "For urgent flight requirements"
    }
  ];

  const serviceTypes = [
    "Personal Charter",
    "Business Class Charter", 
    "Hire Charter",
    "Helicopter Hire",
    "Joy Ride",
    "Scheduled Flight",
    "Other"
  ];

  return (
    <div className="min-h-screen bg-gray-50">

      
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold mb-4">Contact Flyola</h1>
          <p className="text-xl max-w-3xl mx-auto">
            Get in touch with our aviation experts for personalized service and competitive pricing
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        
        {/* Contact Information Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {contactInfo.map((info, index) => (
            <div key={index} className="bg-white rounded-lg shadow-lg p-6 text-center hover:shadow-xl transition-shadow duration-300">
              <div className="text-3xl mb-4">{info.icon}</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{info.title}</h3>
              <p className="text-gray-600 text-sm mb-3">{info.description}</p>
              {info.details.map((detail, idx) => (
                <p key={idx} className="text-gray-800 font-medium">{detail}</p>
              ))}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          {/* Contact Form */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Send us a Message</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter your phone number"
                  />
                </div>
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your email address"
                />
              </div>

              <div>
                <label htmlFor="serviceType" className="block text-sm font-medium text-gray-700 mb-2">
                  Service Type
                </label>
                <select
                  id="serviceType"
                  name="serviceType"
                  value={formData.serviceType}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select a service</option>
                  {serviceTypes.map((service, index) => (
                    <option key={index} value={service}>{service}</option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                  Subject *
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  required
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter message subject"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                  Message *
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={5}
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  placeholder="Enter your message or flight requirements"
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200"
              >
                Send Message
              </button>
            </form>
          </div>

          {/* Additional Information */}
          <div className="space-y-8">
            
            {/* Quick Contact */}
            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-lg p-8 text-white">
              <h3 className="text-2xl font-bold mb-4">Need Immediate Assistance?</h3>
              <p className="mb-6">
                For urgent flight bookings or immediate assistance, call us directly. Our team is available 24/7 to help you with your aviation needs.
              </p>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <span className="text-xl">📞</span>
                  <div>
                    <p className="font-semibold">Primary: +91 9311896389</p>
                    <p className="font-semibold">Secondary: +91 9202961237</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xl">✉️</span>
                  <p className="font-semibold">info@flyola.com</p>
                </div>
              </div>
            </div>

            {/* Services Overview */}
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Services</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                  <span className="text-gray-700">Personal Charter Flights</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                  <span className="text-gray-700">Business Class Charter</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                  <span className="text-gray-700">Helicopter Hire Services</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                  <span className="text-gray-700">Joy Ride Experiences</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                  <span className="text-gray-700">Scheduled Flight Services</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                  <span className="text-gray-700">Special Event Transportation</span>
                </div>
              </div>
            </div>

            {/* Social Media */}
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Follow Us</h3>
              <p className="text-gray-600 mb-4">Stay connected for latest updates and offers</p>
              <div className="flex space-x-4">
                <a 
                  href="https://www.facebook.com/flyola/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition-colors duration-200"
                >
                  <span className="text-xl">📘</span>
                </a>
                <a 
                  href="https://www.instagram.com/flyolaskytaxi/profilecard/?igsh=MXN5bW1yYzVoYWw2ag==" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-pink-600 text-white p-3 rounded-lg hover:bg-pink-700 transition-colors duration-200"
                >
                  <span className="text-xl">📷</span>
                </a>
                <a 
                  href="https://www.linkedin.com/company/105953525/admin/dashboard/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-blue-800 text-white p-3 rounded-lg hover:bg-blue-900 transition-colors duration-200"
                >
                  <span className="text-xl">💼</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-16 bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Frequently Asked Questions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">How far in advance should I book?</h4>
              <p className="text-gray-600 text-sm">We recommend booking at least 24-48 hours in advance, though we can accommodate last-minute requests subject to availability.</p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">What payment methods do you accept?</h4>
              <p className="text-gray-600 text-sm">We accept all major credit cards, debit cards, bank transfers, and online payment methods.</p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Do you provide ground transportation?</h4>
              <p className="text-gray-600 text-sm">Yes, we can arrange ground transportation to and from airports as part of our comprehensive service.</p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">What is your cancellation policy?</h4>
              <p className="text-gray-600 text-sm">Our cancellation policy varies based on timing. Please refer to our refund policy page for detailed information.</p>
            </div>
          </div>
        </div>
      </div>


    </div>
  );
};

export default ContactPage;