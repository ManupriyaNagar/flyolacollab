"use client";
import { FaHelicopter, FaCalendarAlt, FaMapMarkerAlt } from "react-icons/fa";
import { motion } from "framer-motion";

const Header2 = () => {
  return (
    <motion.header 
      className="bg-gradient-to-r from-red-700 via-red-700 to-pink-700 shadow-2xl border-b border-red-300 rounded-2xl mt-2 overflow-hidden relative"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-r from-red-900/20 to-pink-700/20">
        <div className="absolute inset-0 opacity-30">
          <div className="w-full h-full bg-repeat" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}></div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 relative z-10">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
          <div className="flex-1">
            <motion.h1 
              className="text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight mb-2"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <FaHelicopter className="inline mr-3 text-yellow-400 animate-pulse" /> 
              Helicopter Flights
            </motion.h1>
            <motion.p 
              className="text-lg sm:text-xl text-red-100 font-medium"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              Experience premium helicopter travel with scenic views
            </motion.p>
          </div>
          
          <motion.div 
            className="flex items-center space-x-6 mt-4 lg:mt-0"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <div className="flex items-center text-red-100">
              <FaCalendarAlt className="mr-2 text-yellow-400" />
              <span className="text-sm font-medium">Real-time Updates</span>
            </div>
            <div className="flex items-center text-red-100">
              <FaMapMarkerAlt className="mr-2 text-yellow-400" />
              <span className="text-sm font-medium">Multiple Routes</span>
            </div>
          </motion.div>
        </div>
        
        {/* Stats Bar */}
        <motion.div 
          className="mt-6 pt-4 border-t border-red-700/30"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-yellow-400">24/7</div>
              <div className="text-xs text-red-200">Support</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-yellow-400">100%</div>
              <div className="text-xs text-red-200">Secure</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-yellow-400">Premium</div>
              <div className="text-xs text-red-200">Service</div>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.header>
  );
};

export default Header2;