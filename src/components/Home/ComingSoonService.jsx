"use client";

import { motion } from "framer-motion";
import { FaClock } from "react-icons/fa";

export default function ComingSoonService({ serviceName }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl p-4 border border-gray-200"
    >
      <div className="flex flex-col items-center justify-center text-center space-y-3 max-w-xl mx-auto">
        <div className="p-2 bg-white rounded-full shadow-sm border border-gray-200">
          <FaClock className="text-xl text-gray-400" />
        </div>

        <div className="space-y-1">
          <h2 className="text-lg font-bold text-gray-800 leading-tight">
            Coming Soon
          </h2>
          <p className="text-sm text-gray-600 leading-tight">
            {serviceName}
          </p>
        </div>

        <div className="w-full max-w-sm space-y-1">
          <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full w-1/2" />
          </div>
          <p className="text-xs text-gray-500">
            This service is currently under development
          </p>
        </div>

        <div className="pt-2 border-t border-gray-200 w-full">
          <p className="text-xs text-gray-600 leading-snug">
            For immediate booking needs, please use our{" "}
            <span className="font-semibold text-blue-600">Flight</span> or{" "}
            <span className="font-semibold text-orange-600">Helicopter</span> services.
          </p>
        </div>
      </div>
    </motion.div>
  );
}
