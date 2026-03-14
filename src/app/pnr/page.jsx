"use client";

import React from "react";
import { FaPlane, FaUser, FaInfoCircle, FaPhoneAlt, FaEnvelope } from "react-icons/fa";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";

const PNRPage = () => {
    return (
        <div className="min-h-screen bg-[#F0F4F8] py-10 px-4 pt-24">
            <div className="max-w-4xl mx-auto space-y-8">

                {/* Booking Status Header */}
                <div className="flex rounded-xl overflow-hidden shadow-sm h-14">
                    <div className="flex-grow bg-[#A2D2B5] flex items-center px-6">
                        <span className="font-bold text-slate-800 tracking-tight">Booking Status</span>
                    </div>
                    <button className="bg-[#008148] text-white px-12 font-bold hover:bg-[#006D3B] transition-colors duration-200">
                        Confirm
                    </button>
                </div>

                {/* Flight Details Card */}
                <div className="bg-white rounded-3xl shadow-sm p-8 border border-slate-100">
                    <h2 className="text-2xl font-black text-slate-800 mb-6">Flight Details</h2>

                    <div className="border border-dashed border-slate-300 rounded-2xl p-8">
                        {/* Logo */}
                        <div className="flex items-center space-x-3 mb-10">
                            <div className="relative w-12 h-12 bg-[#1A47E5] rounded-full flex items-center justify-center overflow-hidden">
                                <div className="absolute inset-0 flex flex-col justify-center items-center space-y-1 rotate-[-30deg]">
                                    <div className="w-8 h-1 bg-[#FFB800] rounded-full"></div>
                                    <div className="w-10 h-1 bg-[#FFB800] rounded-full translate-x-1"></div>
                                    <div className="w-8 h-1 bg-[#FFB800] rounded-full"></div>
                                </div>
                            </div>
                            <span className="text-3xl font-black text-slate-800 tracking-tight">Flyola</span>
                        </div>

                        <div className="flex items-center justify-between relative">
                            {/* Departure */}
                            <div className="flex flex-col">
                                <span className="text-5xl font-black text-slate-900 tracking-tighter">06:45</span>
                                <span className="text-xl font-bold text-slate-800 mt-1 uppercase">BHOPAL</span>
                                <span className="text-slate-400 font-bold uppercase text-sm tracking-wider">18 Apr. Wed</span>
                            </div>

                            {/* Transit Line */}
                            <div className="flex-grow mx-10 flex flex-col items-center">
                                <div className="w-full relative flex items-center">
                                    <div className="w-3 h-3 rounded-full border-2 border-slate-300 bg-white"></div>
                                    <div className="flex-grow border-t-2 border-dotted border-slate-300 relative mx-1">
                                        <FaPlane className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-slate-300 text-xl" />
                                    </div>
                                    <div className="w-3 h-3 rounded-full border-2 border-slate-300 bg-white"></div>
                                </div>
                                <div className="mt-8 text-center bg-white px-4">
                                    <span className="text-slate-400 font-bold text-sm">1h 50min • Direct Flight</span>
                                </div>
                            </div>

                            {/* Arrival */}
                            <div className="flex flex-col text-right">
                                <span className="text-5xl font-black text-slate-900 tracking-tighter">08:00</span>
                                <span className="text-xl font-bold text-slate-800 mt-1 uppercase">INDOR</span>
                                <span className="text-slate-400 font-bold uppercase text-sm tracking-wider">18 Apr. Wed</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Travellers Details Card */}
                <div className="bg-white rounded-3xl shadow-sm p-8 border border-slate-100 overflow-hidden">
                    <h2 className="text-2xl font-black text-slate-800 mb-6 font-primary">Travellers Details</h2>

                    <div className="hidden md:grid grid-cols-10 gap-4 mb-4 px-6 text-xs font-bold text-slate-400 uppercase tracking-widest">
                        <div className="col-span-4">Name</div>
                        <div className="col-span-4 text-center">Passenger Weight</div>
                        <div className="col-span-2 text-right">Seat Number</div>
                    </div>

                    <div className="border border-dashed border-slate-300 rounded-2xl p-4 space-y-4">
                        {/* Traveler 1 */}
                        <div className="bg-[#F3F7FA] rounded-2xl font-bold">
                            <div className="grid grid-cols-1 md:grid-cols-10 items-center py-4 px-6 md:px-8 gap-4 md:gap-0">
                                <div className="col-span-1 md:col-span-4 text-slate-700 text-lg">1. John Doe</div>
                                <div className="col-span-1 md:col-span-4 flex items-center px-0 md:px-8">
                                    <div className="w-full h-px bg-slate-200 relative">
                                        <div className="absolute top-1/2 left-0 -translate-y-1/2 w-2 h-2 rounded-full bg-slate-300"></div>
                                        <div className="absolute top-1/2 right-0 -translate-y-1/2 w-2 h-2 rounded-full bg-slate-300"></div>
                                    </div>
                                </div>
                                <div className="col-span-1 md:col-span-2 flex items-center justify-between md:justify-end space-x-3">
                                    <span className="md:hidden text-slate-400 text-xs uppercase tracking-widest">Seat</span>
                                    <div className="flex items-center space-x-3">
                                        <div className="w-10 h-10 rounded-full bg-black flex items-center justify-center p-2 shadow-lg">
                                            <div className="w-5 h-6 border-2 border-white rounded-md relative flex flex-col justify-end">
                                                <div className="w-full h-1/2 bg-[#76C95E] rounded-b-sm"></div>
                                            </div>
                                        </div>
                                        <span className="text-xl font-black text-slate-800">S2</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Traveler 2 */}
                        <div className="bg-[#F3F7FA] rounded-2xl font-bold">
                            <div className="grid grid-cols-1 md:grid-cols-10 items-center py-4 px-6 md:px-8 gap-4 md:gap-0">
                                <div className="col-span-1 md:col-span-4 text-slate-700 text-lg">1. John Doe</div>
                                <div className="col-span-1 md:col-span-4 flex items-center px-0 md:px-8">
                                    <div className="w-full h-px bg-slate-200 relative">
                                        <div className="absolute top-1/2 left-0 -translate-y-1/2 w-2 h-2 rounded-full bg-slate-300"></div>
                                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#FF9F1C] text-white text-[10px] md:text-xs px-3 py-1.5 font-bold rounded-full shadow-md z-1">76 kg</div>
                                        <div className="absolute top-1/2 right-0 -translate-y-1/2 w-2 h-2 rounded-full bg-slate-300"></div>
                                    </div>
                                </div>
                                <div className="col-span-1 md:col-span-2 flex items-center justify-between md:justify-end space-x-3">
                                    <span className="md:hidden text-slate-400 text-xs uppercase tracking-widest">Seat</span>
                                    <div className="flex items-center space-x-3">
                                        <div className="w-10 h-10 rounded-full bg-black flex items-center justify-center p-2 shadow-lg">
                                            <div className="w-5 h-6 border-2 border-white rounded-md relative flex flex-col justify-end">
                                                <div className="w-full h-1/2 bg-[#76C95E] rounded-b-sm"></div>
                                            </div>
                                        </div>
                                        <span className="text-xl font-black text-slate-800">S2</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Booking Details Card */}
                <div className="bg-white rounded-3xl shadow-sm p-8 border border-slate-100">
                    <h2 className="text-2xl font-black text-slate-800 mb-6 uppercase tracking-tight">Booking Details</h2>

                    <div className="space-y-6">
                        <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0">
                            <label className="w-40 font-bold text-slate-800">Booking ID</label>
                            <div className="flex-grow h-12 bg-[#F3F7FA] rounded-xl"></div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0">
                                <label className="w-40 font-bold text-slate-800">Phone No.</label>
                                <div className="flex-grow h-12 bg-[#F3F7FA] rounded-xl"></div>
                            </div>
                            <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0">
                                <label className="w-20 font-bold text-slate-800">Email</label>
                                <div className="flex-grow h-12 bg-[#F3F7FA] rounded-xl"></div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default PNRPage;
