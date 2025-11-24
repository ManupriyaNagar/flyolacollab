"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";

export default function ServiceSelector({ services, selectedService, onServiceChange }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="mx-4 sm:mx-6 md:mx-20 z-40 lg:mx-40 -mb-20 relative "
    >
      <Card className="bg-white/50 backdrop-blur-xl  shadow-lg border border-white/20 z-50" >
        <CardContent className="p-1">
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4">
            {services.map((service, index) => {
              const IconComponent = service.icon;
              const isActive = selectedService === service.value;
              return (
                <motion.button
                  key={service.value}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 * index }}
                  onClick={() => onServiceChange(service.value)}
                  className={`flex flex-col items-center gap-2 p-3 sm:py-5 sm:p-3 rounded-xl transition-all duration-300 min-w-[80px] sm:min-w-[100px] ${
                    isActive
                      ? "bg-white text-blue-600 shadow-lg transform scale-101 border-b-6 border-blue-800"
                      : "bg-gray-50 text-gray-600 hover:bg-gray-100 hover:text-gray-800"
                  }`}
                >
                  <div className={`p-2 rounded-lg  ${
                    isActive ? "bg-trasnparent" : "bg-trasnparent"
                  }`}>
                    <IconComponent className={`text-md sm:text-lg ${
                      isActive ? "text-blue-500" : "text-gray-600"
                    }`} />
                  </div>
                  <span className="text-xs sm:text-xs font-medium text-center leading-tight">
                    {service.label}
                  </span>
                </motion.button>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
