"use client";

import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export default function ServiceSelector({ services, selectedService, onServiceChange }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className={cn('mx-4', 'sm:mx-6', 'md:mx-20', 'z-40', 'lg:mx-40', '-mb-20', 'relative', )}
    >
      <Card className={cn('bg-white/50', 'backdrop-blur-xl', 'shadow-lg', 'border', 'border-white/20', 'z-50' )} >
        <CardContent className="p-1">
          <div className={cn('flex', 'flex-wrap', 'items-center', 'justify-center', 'gap-2', 'sm:gap-4')}>
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
                  className={cn(
                    "flex flex-col items-center justify-center",
                    "w-[80px] h-[80px] sm:w-[110px] sm:h-[110px]",
                    "rounded-xl transition-all duration-300",
                    "gap-2 text-center",
                    isActive
                      ? "bg-white text-blue-600 shadow-lg transform scale-101 border-b-6 border-blue-800"
                      : "bg-gray-50 text-gray-600 hover:bg-gray-100 hover:text-gray-800"
                  )}
                >
                  <IconComponent className={cn(
                    "text-md sm:text-lg",
                    isActive ? "text-blue-500" : "text-gray-600"
                  )} />
                  <span className={cn(
                    'text-xs sm:text-xs font-medium leading-tight line-clamp-2'
                  )}>
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
