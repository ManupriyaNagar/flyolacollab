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
        return `From Rp${price.toLocaleString()}`;
    };

    return (
        <div className="w-full px-4 sm:px-6 lg:px-8 mx-auto mb-8 mt-2">
            <div className="w-full bg-white rounded-3xl shadow-sm border border-gray-100 px-2 py-1 relative overflow-visible">
                <div className="flex items-center relative px-20">
                    {/* Left Arrow */}
                    <button
                        onClick={() => scroll("left")}
                        className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full border border-gray-100 flex items-center justify-center bg-white z-20 shadow-sm hover:bg-gray-50 transition-colors"
                    >
                        <ChevronLeft className="w-5 h-5 text-gray-500" />
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
                                        "flex flex-col items-center justify-center min-w-[143px] h-[70px] rounded-2xl cursor-pointer transition-all relative group",
                                        isSelected
                                            ? "bg-[#ff9933] border border-[#0133EA] text-white"
                                            : "bg-white hover:bg-sky-50 border border-gray-100 text-gray-800 hover:border-sky-500"
                                    )}
                                >
                                    <span className={cn(
                                        "text-[15px] font-light tracking-tight",
                                        isSelected ? "text-white" : "text-gray-800"
                                    )}>
                                        {format(dateObj, "EEE, d MMM")}
                                    </span>
                                    <span className={cn(
                                        "text-[12px] mt-1.5 font-medium ",
                                        isSelected ? "text-white/95" : "text-gray-400"
                                    )}>
                                        {formatPrice(price)}
                                    </span>

                                    {/* Blue selection indicator bar (Permanent if selected) */}
                                    {isSelected && (
                                        <motion.div
                                            layoutId="activeBar"
                                            className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[63px] h-[4px] bg-[#0133EA] border-[#0133EA] rounded-t-full z-10"
                                            initial={false}
                                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                        />
                                    )}

                                    {/* Hover indicator bar (Visible only on hover when NOT selected) */}
                                    {!isSelected && (
                                        <motion.div
                                            className="opacity-0 group-hover:opacity-100 absolute bottom-0 left-1/2 -translate-x-1/2 w-[63px] h-[4px] bg-sky-500 rounded-t-full z-10 transition-opacity"
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
                        className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full border border-gray-100 flex items-center justify-center z-20 shadow-sm hover:bg-gray-50 transition-colors"
                    >
                        <ChevronRight className="w-5 h-5 text-gray-500" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default WeekSection;
