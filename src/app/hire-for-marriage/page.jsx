'use client';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useState } from 'react';
import { FaHelicopter, FaCalendarAlt, FaClock, FaUser, FaPhone, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';

export default function MarriageHelicopterHire() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    departure: '',
    arrival: '',
    date: '',
    time: '',
    eventDetails: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate form submission
    alert('Your helicopter hire request has been submitted successfully!');
    // Reset form
    setFormData({
      name: '',
      phone: '',
      email: '',
      address: '',
      departure: '',
      arrival: '',
      date: '',
      time: '',
      eventDetails: '',
    });
  };

  return (
    <section className="bg-gradient-to-b from-rose-50 to-rose-200 min-h-screen py-20 px-6 md:px-12">
      {/* Header Section */}
      <div className="text-center mb-16">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-5xl font-extrabold text-rose-900 tracking-tight"
        >
          Hire a Helicopter for Your Dream Wedding
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-lg md:text-xl text-rose-700 max-w-3xl mx-auto mt-4 leading-relaxed"
        >
          Make your marriage ceremony unforgettable with Jet Serve Aviation’s luxury helicopter charters. Arrive in style, soar above the ordinary, and create memories that last a lifetime.
        </motion.p>
        <svg
          className="w-24 h-24 mx-auto mt-6 text-rose-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
          />
        </svg>
      </div>

      {/* Hero Image Section */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="max-w-7xl mx-auto mb-16"
      >
        <div className="relative rounded-3xl overflow-hidden shadow-2xl">
          <img
            src="/helicopter-wedding.png"
            alt="Luxury Helicopter for Wedding"
            className="w-full  object-cover transition-transform duration-500 hover:scale-105"
          />
        
        </div>
      </motion.div>

      {/* Form Section */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
        className="max-w-7xl mx-auto bg-white p-8 rounded-3xl shadow-2xl border border-rose-100"
      >
        <h3 className="text-3xl font-bold text-rose-900 mb-6 text-center">
          Book Your Wedding Helicopter
        </h3>
        <form onSubmit={handleSubmit} className="grid gap-6">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="relative">
              <Label htmlFor="name" className="text-rose-700 font-medium">
                Full Name
              </Label>
              <div className="relative mt-1">
                <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-rose-500" />
                <Input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Enter your name"
                  value={formData.name}
                  onChange={handleChange}
                  className="pl-10 w-full rounded-lg border-rose-300 focus:ring-rose-500 focus:border-rose-500"
                  required
                />
              </div>
            </div>
            <div className="relative">
              <Label htmlFor="phone" className="text-rose-700 font-medium">
                Phone Number
              </Label>
              <div className="relative mt-1">
                <FaPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-rose-500" />
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder="Enter your phone number"
                  value={formData.phone}
                  onChange={handleChange}
                  className="pl-10 w-full rounded-lg border-rose-300 focus:ring-rose-500 focus:border-rose-500"
                  required
                />
              </div>
            </div>
          </div>
          <div className="relative">
            <Label htmlFor="email" className="text-rose-700 font-medium">
              Email Address
            </Label>
            <div className="relative mt-1">
              <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-rose-500" />
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="Enter your email address"
                value={formData.email}
                onChange={handleChange}
                className="pl-10 w-full rounded-lg border-rose-300 focus:ring-rose-500 focus:border-rose-500"
                required
              />
            </div>
          </div>
          <div className="relative">
            <Label htmlFor="address" className="text-rose-700 font-medium">
              Address
            </Label>
            <div className="relative mt-1">
              <FaMapMarkerAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-rose-500" />
              <Input
                id="address"
                name="address"
                type="text"
                placeholder="Enter your address"
                value={formData.address}
                onChange={handleChange}
                className="pl-10 w-full rounded-lg border-rose-300 focus:ring-rose-500 focus:border-rose-500"
                required
              />
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="relative">
              <Label htmlFor="departure" className="text-rose-700 font-medium">
                Departure Helipad/Airport
              </Label>
              <div className="relative mt-1">
                <FaHelicopter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-rose-500" />
                <Input
                  id="departure"
                  name="departure"
                  type="text"
                  placeholder="Enter departure helipad/airport"
                  value={formData.departure}
                  onChange={handleChange}
                  className="pl-10 w-full rounded-lg border-rose-300 focus:ring-rose-500 focus:border-rose-500"
                  required
                />
              </div>
            </div>
            <div className="relative">
              <Label htmlFor="arrival" className="text-rose-700 font-medium">
                Arrival Helipad/Airport
              </Label>
              <div className="relative mt-1">
                <FaHelicopter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-rose-500" />
                <Input
                  id="arrival"
                  name="arrival"
                  type="text"
                  placeholder="Enter arrival helipad/airport"
                  value={formData.arrival}
                  onChange={handleChange}
                  className="pl-10 w-full rounded-lg border-rose-300 focus:ring-rose-500 focus:border-rose-500"
                  required
                />
              </div>
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="relative">
              <Label htmlFor="date" className="text-rose-700 font-medium">
                Wedding Date
              </Label>
              <div className="relative mt-1">
                <FaCalendarAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-rose-500" />
                <Input
                  id="date"
                  name="date"
                  type="date"
                  value={formData.date}
                  onChange={handleChange}
                  className="pl-10 w-full rounded-lg border-rose-300 focus:ring-rose-500 focus:border-rose-500"
                  required
                />
              </div>
            </div>
            <div className="relative">
              <Label htmlFor="time" className="text-rose-700 font-medium">
                Departure Time
              </Label>
              <div className="relative mt-1">
                <FaClock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-rose-500" />
                <Input
                  id="time"
                  name="time"
                  type="time"
                  value={formData.time}
                  onChange={handleChange}
                  className="pl-10 w-full rounded-lg border-rose-300 focus:ring-rose-500 focus:border-rose-500"
                  required
                />
              </div>
            </div>
          </div>
          <div>
            <Label htmlFor="eventDetails" className="text-rose-700 font-medium">
              Marriage Event Details
            </Label>
            <textarea
              id="eventDetails"
              name="eventDetails"
              placeholder="Enter details about your wedding plans"
              value={formData.eventDetails}
              onChange={handleChange}
              className="mt-1 w-full rounded-lg border-rose-300 focus:ring-rose-500 focus:border-rose-500 p-3 min-h-[100px]"
              required
            />
          </div>
          <Button
            type="submit"
            className="mt-6 bg-gradient-to-r from-rose-600 to-rose-800 text-white px-8 py-3 rounded-lg hover:from-rose-700 hover:to-rose-900 transition-all duration-300 w-full font-medium text-lg"
          >
            Submit Request
          </Button>
        </form>
      </motion.div>

      {/* Call to Action */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.8 }}
        className="text-center mt-12"
      >
        <Button
          as="a"
          href="/contact"
          className="bg-rose-900 text-white px-8 py-3 rounded-lg hover:bg-rose-800 transition-colors duration-300 text-lg font-medium"
        >
          Contact Our Wedding Specialists
        </Button>
      </motion.div>

      {/* Decorative SVG Background */}
      <svg
        className="absolute bottom-0 left-0 w-full h-32 text-rose-300 opacity-20"
        fill="none"
        viewBox="0 0 1440 320"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fill="currentColor"
          d="M0,160L48,176C96,192,192,224,288,213.3C384,203,480,149,576,138.7C672,128,768,160,864,186.7C960,213,1056,235,1152,213.3C1248,192,1344,128,1392,96L1440,64L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
        />
      </svg>
    </section>
  );
}