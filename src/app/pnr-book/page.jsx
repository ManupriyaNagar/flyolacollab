"use client";

import React, { useState } from "react";
import { FaPlane, FaSearch } from "react-icons/fa";

const PNRBookPage = () => {
    const [pnr, setPnr] = useState("12904899048");

    return (
        <div
            className="flex items-center justify-center py-20 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: "url('/flights/Vector.svg')" }}
        >
            <div className="w-full max-w-7xl relative">

                {/* Main Blue Container */}
                <div className="">


                    {/* FLYOLA Logo Section */}
                    <div className="relative flex items-center justify-center mb-4">
                        <img src="/flights/flyolalogo1.svg" alt="" className="w-70 h-70" />
                    </div>

                    {/* Search Bar Container */}
                    <div className="w-full bg-white rounded-full p-3 md:p-4 flex items-center relative z-10">
                        <div className="flex-grow flex flex-col px-6 md:px-10 relative">
                            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-px h-12 bg-slate-200"></div>
                            <span className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">PNR</span>
                            <div className="flex items-center">
                                <div className="w-1 h-4 bg-slate-200 rounded-full"></div>
                                <input
                                    type="text"
                                    value={pnr}
                                    onChange={(e) => setPnr(e.target.value)}
                                    className="w-full bg-transparent text-slate-800 text-2xl md:text-xl font-black outline-none placeholder-slate-200 tracking-tight"
                                    placeholder="Enter PNR"
                                />
                            </div>
                        </div>
                        <button className="bg-[#FF9F1C] hover:bg-[#F28C00] text-slate-900 text-xl md:text-xl font-black p-4 rounded-full transition-all duration-300 flex items-center">
                            Search
                        </button>
                    </div>

                </div>

                {/* Error Message Tooltip-like Box */}
                <div className="absolute -bottom-10 left-12">
                    <div className="bg-white px-8 py-3 rounded-lg border-l-4 border-red-500 animate-in fade-in slide-in-from-top-4 duration-500">
                        <span className="text-red-500 text-sm font-bold whitespace-nowrap">
                            Record Not Found
                        </span>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default PNRBookPage;
