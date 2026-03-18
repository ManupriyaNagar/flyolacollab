"use client";

import { useState } from "react";
import { HiOutlineSwitchHorizontal } from "react-icons/hi";     // v1
import { HiOutlineAdjustmentsHorizontal } from "react-icons/hi2"; // v2
import { cn } from "@/lib/utils";
import { FaSearch, FaChevronDown } from "react-icons/fa";

export default function HeroBooking() {
    const [activeTab, setActiveTab] = useState("flight");

    const tabs = [
        { label: "Flight", value: "flight" },
        { label: "Helicopter", value: "heli" },
        { label: "Hotels", value: "hotel" },
        { label: "Holiday Package", value: "package" },
        { label: "Weekly Schedule", value: "schedule" },
    ];

    return (
        <div className="relative w-full min-h-screen">

            {/* 🔹 Background */}
            <div
                className="absolute inset-0 bg-cover bg-center h-[70vh]"
                style={{ backgroundImage: "url('/flights/banner.svg')" }} // replace image
            >
                <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-orange-500/40" />
            </div>

            {/* 🔹 Content */}
            <div className="relative z-10 flex flex-col items-center px-4 pt-24">

                {/* 🔸 Heading */}
                <h1 className="text-white text-4xl md:text-5xl font-semibold text-center leading-tight">
                    Plan Your Perfect Getaway <br /> All in One Place
                </h1>

                <p className="text-white/80 mt-4 text-lg text-center">
                    Discover stays, activities, and travel options tailored for your journey
                </p>

                {/* 🔸 Search Bar */}
                <div className="mt-8 w-full max-w-2xl relative">
                    <FaSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                        placeholder="Where to?"
                        className="w-full pl-14 pr-6 py-4 rounded-full bg-white text-gray-700 text-lg shadow-xl outline-none"
                    />
                </div>

                {/* 🔸 Booking Card */}
                <div className="mt-16 w-full max-w-6xl bg-white rounded-[30px] shadow-[0_20px_60px_rgba(0,0,0,0.15)] p-6 md:p-16">

                    {/* Tabs */}
                    <div className="flex gap-8 border-b">
                        {tabs.map((tab) => {
                            const isActive = activeTab === tab.value;
                            return (
                                <button
                                    key={tab.value}
                                    onClick={() => setActiveTab(tab.value)}
                                    className={cn(
                                        "flex items-center gap-2 pb-3 border-b-2 transition",
                                        isActive
                                            ? "border-gray-800 text-gray-900"
                                            : "border-transparent text-gray-400"
                                    )}
                                >
                                    <div
                                        className={cn(
                                            "w-2.5 h-2.5 rounded-full",
                                            isActive ? "bg-blue-600" : "bg-gray-400"
                                        )}
                                    />
                                    <span className="font-light">{tab.label}</span>
                                </button>
                            );
                        })}
                    </div>

                    {/* Form */}
                    <div className="mt-6 flex justify-between items-center gap-3">

                        {/* From */}
                        <div>
                            <p className="text-xs text-gray-400 mb-2">From</p>
                            <div className="flex-1 bg-[#EFEFEF] rounded-xl px-8 py-3">

                                <p className="font-light">HJR <span className="text-gray-400 text-sm">Khajuraho</span></p>
                            </div>
                        </div>

                        {/* Swap */}
                        <button className="w-10 h-10 bg-blue-700 text-white rounded-full flex items-center justify-center">
                            <HiOutlineSwitchHorizontal />
                        </button>

                        {/* To */}
                        <div>
                            <p className="text-xs text-gray-400 mb-2">To</p>
                            <div className="flex-1 bg-[#EFEFEF] rounded-xl px-8 py-3">
                                <p className="font-light">REW <span className="text-gray-400 text-sm">Rewa</span></p>
                            </div>
                        </div>

                        {/* Date */}
                        <div>
                            <p className="text-xs text-gray-400 mb-2">Departure Date</p>
                            <div className="flex-1 bg-[#EFEFEF] rounded-xl px-8 py-3">
                                <p className="font-light">Sun, 27 Nov</p>
                            </div>
                        </div>

                        {/* Return */}
                        <div>
                            <p className="text-xs text-gray-400 mb-2">Return Date</p>

                            <div className="flex-1 bg-[#EFEFEF] rounded-lg px-8 py-3 flex justify-between items-center">
                                <div>

                                    <p className="font-light">General</p>
                                </div>
                                <FaChevronDown className="text-gray-400 text-xs" />
                            </div>
                        </div>

                        {/* Travellers */}
                        <div>
                            <p className="text-xs text-gray-400 mb-2">Travellers & Class</p>
                            <div className="flex-1 bg-[#EFEFEF] rounded-lg px-8 py-3 flex justify-between items-center">
                                <div>
                                    <p className="font-light text-sm">1 Traveller Economy</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <FaChevronDown className="text-gray-400 text-xs" />
                                </div>
                            </div>
                        </div>

                        {/* Settings */}
                        <button className="w-10 h-10 flex items-center justify-center text-gray-500">
                            <HiOutlineAdjustmentsHorizontal />
                        </button>
                    </div>



                </div>
                {/* Buttons */}
                <div className="flex justify-center gap-4 -mt-5">
                    <button className="px-10 py-2 bg-blue-700 text-white rounded-full font-semibold shadow-lg hover:scale-105 transition">
                        Search Flight
                    </button>

                    <button className="bg-white px-10 py-2 border-2 border-blue-700 text-blue-700 rounded-full font-semibold hover:bg-blue-50 transition">
                        Joyride
                    </button>
                </div>
            </div>
        </div>
    );
}