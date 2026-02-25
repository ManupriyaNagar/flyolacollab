"use client";
import { cn } from "@/lib/utils";
import { useEffect } from "react";
import { FaCheckCircle, FaExclamationCircle, FaInfoCircle, FaTimes } from "react-icons/fa";

/**
 * Toast Notification Component
 * Displays temporary notifications
 */
export default function Toast({ 
  show, 
  message, 
  type = "info", 
  onClose,
  duration = 4000 
}) {
  useEffect(() => {
    if (show && duration > 0) {
      const timer = setTimeout(() => {
        onClose?.();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [show, duration, onClose]);

  if (!show) return null;

  const config = {
    success: {
      icon: FaCheckCircle,
      bgColor: "bg-green-50 border-green-500",
      textColor: "text-green-800",
      iconColor: "text-green-500"
    },
    error: {
      icon: FaExclamationCircle,
      bgColor: "bg-red-50 border-red-500",
      textColor: "text-red-800",
      iconColor: "text-red-500"
    },
    warning: {
      icon: FaExclamationCircle,
      bgColor: "bg-yellow-50 border-yellow-500",
      textColor: "text-yellow-800",
      iconColor: "text-yellow-500"
    },
    info: {
      icon: FaInfoCircle,
      bgColor: "bg-blue-50 border-blue-500",
      textColor: "text-blue-800",
      iconColor: "text-blue-500"
    }
  };

  const currentConfig = config[type] || config.info;
  const IconComponent = currentConfig.icon;

  return (
    <div className={cn(
      "fixed top-6 right-6 z-50",
      "max-w-md w-full sm:w-auto",
      "animate-slide-in-right",
      "shadow-2xl rounded-xl overflow-hidden",
      "transform transition-all duration-300"
    )}>
      <div className={cn(
        "p-4 flex items-start gap-3 border-l-4",
        currentConfig.bgColor
      )}>
        <div className="flex-shrink-0">
          <IconComponent className={cn("w-6 h-6", currentConfig.iconColor)} />
        </div>
        
        <div className="flex-1">
          <p className={cn("text-sm font-medium", currentConfig.textColor)}>
            {message}
          </p>
        </div>
        
        <button
          onClick={onClose}
          className={cn(
            "flex-shrink-0 ml-2",
            "text-gray-400 hover:text-gray-600",
            "transition-colors"
          )}
          aria-label="Close notification"
        >
          <FaTimes className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
