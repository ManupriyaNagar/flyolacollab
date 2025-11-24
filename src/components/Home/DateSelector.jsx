"use client";

import { motion } from "framer-motion";

export default function DateSelector({ 
  label, 
  date, 
  onClick, 
  delay = 0.7,
  showReturnPrompt = false,
  onReturnPromptClick 
}) {
  if (!date) {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    date = tomorrow.toISOString().split('T')[0];
  }

  const selectedDate = new Date(date + 'T00:00:00');
  const day = selectedDate.getDate();
  const month = selectedDate.toLocaleString("en-US", { month: "short" });
  const yearShort = selectedDate.getFullYear().toString().slice(-2);
  const weekday = selectedDate.toLocaleString("en-US", { weekday: "long" });

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay }}
      className="relative flex flex-col rounded-sm border border-gray-200 bg-white px-4 py-3 shadow-sm cursor-pointer"
      onClick={onClick}
    >
      <label className="mb-2 text-sm text-gray-950 flex items-center gap-1">
        {label}
      </label>

      {showReturnPrompt ? (
        <div 
          onClick={(e) => {
            e.stopPropagation();
            onReturnPromptClick?.();
          }}
          className="w-full h-14 rounded-xl flex items-center justify-center cursor-pointer hover:border-blue-300 hover:bg-blue-50 transition-all duration-300 bg-white px-3"
        >
          <span className="text-xs text-gray-900 font-semibold text-center leading-tight">
            Tap to add a return for bigger<br />discount
          </span>
        </div>
      ) : (
        <div className="flex flex-col">
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-bold leading-none">{day}</span>
            <span className="text-lg font-semibold leading-none">
              {month}
              <span className="align-top text-sm font-semibold ml-0.5">
                '{yearShort}
              </span>
            </span>
          </div>
          <span className="mt-1 text-sm text-gray-500">{weekday}</span>
        </div>
      )}
    </motion.div>
  );
}
