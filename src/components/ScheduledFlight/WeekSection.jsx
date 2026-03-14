"use client";
import React, { useMemo, useRef, useState, useEffect } from "react";
import { format, addDays, isSameDay } from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

const WeekSection = ({
    selectedDate = new Date(),
    onDateChange,
    priceData = {}, // Optional: { '2024-04-17': 732400 }
}) => {
    const scrollContainerRef = useRef(null);

    // Generate dates centered around selectedDate
    const dates = useMemo(() => {
        let baseDate = selectedDate instanceof Date ? selectedDate : new Date(selectedDate);

        // Safety check: if date is invalid, fallback to today
        if (isNaN(baseDate.getTime())) {
            baseDate = new Date();
        }

        const result = [];
        for (let i = 0; i <= 30; i++) {
            result.push(addDays(baseDate, i));
        }
        return result;
    }, [selectedDate]);

    // Auto-scroll to center selected date
    useEffect(() => {
        if (scrollContainerRef.current) {
            const container = scrollContainerRef.current;
            const activeItem = container.querySelector('[data-selected="true"]');
            if (activeItem) {
                const scrollLeft = activeItem.offsetLeft - (container.offsetWidth / 2) + (activeItem.offsetWidth / 2);
                container.scrollTo({ left: scrollLeft, behavior: "smooth" });
            }
        }
    }, [selectedDate, dates]);

    const scroll = (direction) => {
        if (scrollContainerRef.current) {
            const scrollAmount = 300;
            scrollContainerRef.current.scrollBy({
                left: direction === "left" ? -scrollAmount : scrollAmount,
                behavior: "smooth",
            });
        }
    };

    const formatPrice = (price) => {
        if (!price) return "";
        return `From INR ${price.toLocaleString()}`;
    };

    return (
        <div className="w-full px-0 sm:px-3 lg:px-8 mx-auto mb-8 mt-2">
            <div className="w-full bg-white lg:rounded-3xl md:rounded-xl shadow-sm border border-gray-100 px-1 md:px-2 py-1 relative overflow-visible">
                <div className="flex items-center relative px-10 md:px-20">
                    {/* Left Arrow */}
                    <button
                        onClick={() => scroll("left")}
                        className="absolute left-1 md:left-4 top-1/2 -translate-y-1/2 md:w-10 md:h-10 w-8 h-8 rounded-full border border-gray-100 flex items-center justify-center bg-white z-20 shadow-sm hover:bg-gray-50 transition-colors"
                    >
                        <ChevronLeft className="md:w-5 md:h-5 w-4 h-4 text-gray-500" />
                    </button>

                    {/* Dates Container */}
                    <div
                        ref={scrollContainerRef}
                        className="flex items-center gap-3 overflow-x-auto no-scrollbar py-2 px-1 scroll-smooth"
                    >
                        {dates.map((dateObj) => {
                            if (isNaN(dateObj.getTime())) return null;

                            const safeSelectedDate = selectedDate instanceof Date
                                ? selectedDate
                                : new Date(selectedDate);

                            const finalSelectedDate = isNaN(safeSelectedDate.getTime()) ? new Date() : safeSelectedDate;

                            const isSelected = isSameDay(dateObj, finalSelectedDate);
                            const dateKey = format(dateObj, "yyyy-MM-dd");
                            const price = priceData[dateKey] || 732400;

                            return (
                                <motion.div
                                    key={dateKey}
                                    data-selected={isSelected}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => onDateChange?.(dateKey)}
                                    className={cn(
                                        "flex flex-col items-center justify-center lg:min-w-[143px] md:min-w-[120px] min-w-[100px] h-[70px] rounded-2xl cursor-pointer transition-all relative group",
                                        isSelected
                                            ? "bg-sky-50 border border-sky-500"
                                            : "bg-white hover:bg-sky-50 border border-gray-200 text-gray-800 hover:border-sky-500"
                                    )}
                                >
                                    <span className={cn(
                                        "lg:text-[15px] md:text-[15px] text-[12px] font-light tracking-tight",
                                        isSelected ? "text-black" : "text-gray-800"
                                    )}>
                                        {format(dateObj, "EEE, d MMM")}
                                    </span>
                                    <span className={cn(
                                        "lg:text-[12px] md:text-[10px] text-[8.5px] mt-1 md:mt-1.5 font-medium ",
                                        isSelected ? "text-black/95" : "text-gray-400"
                                    )}>
                                        {formatPrice(price)}
                                    </span>

                                    {/* Blue selection indicator bar (Permanent if selected) */}
                                    {isSelected && (

                                        <motion.div
                                            layoutId="activeBar"
                                            className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[40px] md:w-[63px] border border-sky-500 h-[3px] md:h-[4px] bg-sky-500 rounded-t-full z-10"
                                            initial={false}
                                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                        />
                                    )}

                                    {/* Hover indicator bar (Visible only on hover when NOT selected) */}
                                    {!isSelected && (
                                        <motion.div
                                            className="opacity-0 group-hover:opacity-100 absolute bottom-0 left-1/2 -translate-x-1/2 w-[40px] md:w-[63px] h-[3px] md:h-[4px] bg-sky-500 rounded-t-full z-10 transition-opacity"
                                            initial={false}
                                        />
                                    )}
                                </motion.div>
                            );
                        })}
                    </div>

                    {/* Right Arrow */}
                    <button
                        onClick={() => scroll("right")}
                        className="absolute right-1 md:right-4 top-1/2 -translate-y-1/2 md:w-10 md:h-10 w-8 h-8 bg-white rounded-full border border-gray-100 flex items-center justify-center z-20 shadow-sm hover:bg-gray-50 transition-colors"
                    >
                        <ChevronRight className="md:w-5 md:h-5 w-4 h-4 text-gray-500" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default WeekSection;
