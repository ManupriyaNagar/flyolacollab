"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
    Plus,
    Users,
    Check,
    ShieldCheck,
    X,
    Edit3,
    User,
    MapPin,
    Hash
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

/**
 * Helper for consistent input fields with overlapping labels
 * Defined outside to prevent focus loss on re-renders
 */
const InputField = ({ label, placeholder, className, type = "text", value, onChange }) => (
    <div className={cn("relative group w-full", className)}>
        <label className="absolute -top-2 left-3 bg-white px-1 text-[10px] font-medium text-gray-500 group-focus-within:text-[#2196F3] transition-all z-10">
            {label}
        </label>
        <input
            type={type}
            value={value || ""}
            onChange={(e) => onChange && onChange(e.target.value)}
            placeholder={placeholder}
            className="w-full border border-gray-200 rounded-xl px-4 py-4 text-sm font-medium text-gray-700 focus:outline-none focus:border-[#2196F3] focus:ring-4 focus:ring-[#2196F3]/5 transition-all outline-none placeholder:text-gray-300 placeholder:font-normal"
        />
    </div>
);

/**
 * PassengerDetails Component
 * A premium forms-based component for collecting traveler information,
 * including primary details, contact info, GST, and billing address.
 * Matches the provided image exactly in layout and aesthetics.
 */
export default function PassengerDetails({ passengers = [], onAdd, onUpdate, onRemove }) {
    const router = useRouter();
    const [isGstEnabled, setIsGstEnabled] = useState(false);
    const [selectedSavedLists, setSelectedSavedLists] = useState([1]);
    const [openPassengerIndex, setOpenPassengerIndex] = useState(0);
    const [showReviewModal, setShowReviewModal] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        passengers: [
            { title: "Mr.", firstName: "", lastName: "", nationality: "Indian" },
            { title: "Ms.", firstName: "", lastName: "", nationality: "Indian" }
        ],
        billing: {
            pincode: "",
            mobile: "",
            address: "",
            city: "",
            state: ""
        },
        gst: {
            number: "",
            countryCode: "+91",
            mobile: "",
            email: "",
            nationality: "Indian"
        }
    });

    const updatePassenger = (index, field, value) => {
        const newPassengers = [...formData.passengers];
        newPassengers[index] = { ...newPassengers[index], [field]: value };
        setFormData({ ...formData, passengers: newPassengers });
    };

    const updateBilling = (field, value) => {
        setFormData({ ...formData, billing: { ...formData.billing, [field]: value } });
    };

    const updateGst = (field, value) => {
        setFormData({ ...formData, gst: { ...formData.gst, [field]: value } });
    };



    return (
        <div className="space-y-10 w-full mx-auto pb-24">
            {/* 1. Passenger Details Block */}
            <section className="bg-white rounded-2xl border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">
                <div className="p-6 space-y-2">
                    {/* Header */}
                    <div className="flex justify-between items-baseline">
                        <div>
                            <h2 className="lg:text-3xl md:text-xl text-xl font-medium text-gray-900">Traveller Details</h2>
                            <p className="text-gray-500 font-light mt-1 md:text-sm text-xs">Choose from the saved list or add a new passenger</p>
                        </div>
                        <span className="hidden md:block text-md font-light text-gray-700">Traveller</span>
                    </div>

                    {/* Alert Banner */}
                    <div className="bg-[#FFE8D0] rounded-2xl flex items-center p-2 gap-2">
                        <div className="rounded-xl shrink-0 flex items-center justify-center ">
                            <img src="/flights/identity.svg" alt="identity" className="text-white w-4 h-4" />
                        </div>
                        <p className="lg:text-[11px] text-[8px] md:text-xs text-gray-700 font-light leading-relaxed">
                            Please ensure that your name matches your govt. ID such as Aadhaar, Passport or Driver's License
                        </p>
                    </div>

                    {/* login Banner */}
                    <div className="bg-[#D0E2FF] justify-between rounded-2xl flex flex-col md:flex-row items-start sm:items-center p-3 gap-3">
                        <div className="flex items-center gap-2">
                            <div className="rounded-xl shrink-0 flex items-center justify-center ">
                                <img src="/flights/account_box.svg" alt="identity" className="text-white w-4 h-4" />
                            </div>
                            <p className="lg:text-[11px] text-[8px] md:text-xs text-gray-700 font-light leading-relaxed">
                                Log in to view your saved traveller list, unlock amazing deals & much more!
                            </p>
                        </div>
                        <div className="w-full sm:w-auto flex justify-end">
                            <button className="lg:text-[11px] text-[8px] md:text-xs items-center gap-2.5 uppercase font-medium text-[#0133EA]">
                                Login Now
                            </button>
                        </div>
                    </div>



                    {/* Section Header from Image */}
                    <div className="flex justify-between items-center px-4 pb-4 pt-4">
                        <h3 className="text-[14px] font-medium text-black uppercase tracking-tight">ADULT (12 yrs+)</h3>
                        <span className="text-[14px] font-medium text-black">2/2 added</span>
                    </div>

                    <div className="bg-[#FAFDFF] overflow-hidden">
                        {/* Passenger 1 */}
                        <div className="cursor-pointer" onClick={() => setOpenPassengerIndex(0)}>
                            <div className={cn(
                                "border rounded-xl p-4 bg-white transition-all",
                                openPassengerIndex === 0 ? "rounded-b-none border-b-0" : ""
                            )}>
                                <h4 className="lg:text-[12px] md:text-[10px] font-bold text-gray-900 mb-2.5">Adults (12 yrs or above)</h4>
                                <div className="flex items-center gap-3">
                                    <div className={cn(
                                        "w-[22px] h-[22px] flex items-center justify-center rounded-[6px] transition-all",
                                        openPassengerIndex === 0 ? "bg-[#45B6F5] border-transparent" : "border-2 border-slate-600 bg-transparent"
                                    )}>
                                        {openPassengerIndex === 0 && <Check size={15} strokeWidth={3.5} color="white" />}
                                    </div>
                                    <span className="lg:text-[12px] md:text-[10px] font-bold text-gray-900 uppercase tracking-wide">ADULT 1</span>
                                </div>
                            </div>

                            {openPassengerIndex === 0 && (
                                <div className="lg:space-y-6 md:space-y-4 border border-t-0 rounded-b-xl mb-4">
                                    <div className="flex justify-end p-4">
                                        <button className="lg:text-[11px] md:text-[8px] font-bold text-[#FF5252] hover:text-red-600 transition-colors uppercase underline decoration-1 underline-offset-4">Clear Details</button>
                                    </div>
                                    <div className="grid grid-cols-12 lg:gap-x-6 md:gap-x-4 lg:gap-y-6 gap-y-4 md:gap-y-4 lg:p-4 md:p-2 p-2">
                                        <InputField
                                            label="Title"
                                            placeholder="Select Title"
                                            className="col-span-12 md:col-span-2 bg-white"
                                            value={formData.passengers[0].title}
                                            onChange={(val) => updatePassenger(0, "title", val)}
                                        />
                                        <InputField
                                            label="First & Middle Name"
                                            placeholder="Enter first & middle name"
                                            className="col-span-12 md:col-span-5 bg-white"
                                            value={formData.passengers[0].firstName}
                                            onChange={(val) => updatePassenger(0, "firstName", val)}
                                        />
                                        <InputField
                                            label="Last Name"
                                            placeholder="Enter last name"
                                            className="col-span-12 md:col-span-5 bg-white"
                                            value={formData.passengers[0].lastName}
                                            onChange={(val) => updatePassenger(0, "lastName", val)}
                                        />
                                        <InputField
                                            label="Nationality"
                                            placeholder="Enter nationality"
                                            className="col-span-12 md:col-span-3 bg-white"
                                            value={formData.passengers[0].nationality}
                                            onChange={(val) => updatePassenger(0, "nationality", val)}
                                        />
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Passenger 2 */}
                        <div className="cursor-pointer" onClick={() => setOpenPassengerIndex(1)}>
                            <div className={cn(
                                "border rounded-xl p-4 bg-white transition-all mt-3",
                                openPassengerIndex === 1 ? "rounded-b-none border-b-0" : ""
                            )}>
                                <h4 className="lg:text-[12px] md:text-[10px] font-bold text-gray-900 mb-2.5">Adults (12 yrs or above)</h4>
                                <div className="flex items-center gap-3">
                                    <div className={cn(
                                        "w-[22px] h-[22px] flex items-center justify-center rounded-[6px] transition-all",
                                        openPassengerIndex === 1 ? "bg-[#45B6F5] border-transparent" : "border-2 border-slate-600 bg-transparent"
                                    )}>
                                        {openPassengerIndex === 1 && <Check size={15} strokeWidth={3.5} color="white" />}
                                    </div>
                                    <span className="lg:text-[12px] md:text-[10px] font-bold text-gray-900 uppercase tracking-wide">ADULT 2</span>
                                </div>
                            </div>

                            {openPassengerIndex === 1 && (
                                <div className="lg:space-y-6 md:space-y-4 border border-t-0 rounded-b-xl mb-4">
                                    <div className="flex justify-end p-4">
                                        <button className="lg:text-[11px] md:text-[8px] font-bold text-[#FF5252] hover:text-red-600 transition-colors uppercase underline decoration-1 underline-offset-4">Clear Details</button>
                                    </div>

                                    <div className="grid grid-cols-12 lg:gap-x-6 md:gap-x-4 lg:gap-y-6 gap-y-4 md:gap-y-4 lg:p-4 md:p-2 p-2">
                                        <InputField
                                            label="Title"
                                            placeholder="Select Title"
                                            className="col-span-12 md:col-span-2 bg-white"
                                            value={formData.passengers[1].title}
                                            onChange={(val) => updatePassenger(1, "title", val)}
                                        />
                                        <InputField
                                            label="First & Middle Name"
                                            placeholder="Enter first & middle name"
                                            className="col-span-12 md:col-span-5 bg-white"
                                            value={formData.passengers[1].firstName}
                                            onChange={(val) => updatePassenger(1, "firstName", val)}
                                        />
                                        <InputField
                                            label="Last Name"
                                            placeholder="Enter last name"
                                            className="col-span-12 md:col-span-5 bg-white"
                                            value={formData.passengers[1].lastName}
                                            onChange={(val) => updatePassenger(1, "lastName", val)}
                                        />
                                        <InputField
                                            label="Nationality"
                                            placeholder="Enter nationality"
                                            className="col-span-12 md:col-span-3 bg-white"
                                            value={formData.passengers[1].nationality}
                                            onChange={(val) => updatePassenger(1, "nationality", val)}
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* 2. Billing Details  & gst Block */}
            <section className="bg-white rounded-2xl border border-gray-100 p-4 md:p-8 space-y-6">
                <div>
                    <h2 className="lg:text-2xl md:text-xl font-medium text-gray-900 tracking-tight">Billing Address</h2>
                    <p className="text-gray-400 font-light mt-1 lg:text-sm md:text-xs">As per the latest govt. regulations, it's mandatory to provide your address.</p>
                </div>

                <div className="bg-[#FAFDFF] border rounded-2xl p-4 md:p-8 relative space-y-8">
                    <div className="flex justify-end">
                        <button className="text-[11px] font-bold text-[#FF5252] hover:text-red-600 transition-colors uppercase underline decoration-1 underline-offset-4">Clear Details</button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-6">
                        <InputField
                            label="Pincode"
                            placeholder="Enter pincode"
                            className="bg-white"
                            value={formData.billing.pincode}
                            onChange={(val) => updateBilling("pincode", val)}
                        />
                        <InputField
                            label="Mobile Number"
                            placeholder="Enter mobile number"
                            className="bg-white"
                            value={formData.billing.mobile}
                            onChange={(val) => updateBilling("mobile", val)}
                        />
                        <InputField
                            label="Address"
                            placeholder="Enter address"
                            className="bg-white"
                            value={formData.billing.address}
                            onChange={(val) => updateBilling("address", val)}
                        />
                        <InputField
                            label="City"
                            placeholder="Enter city"
                            className="bg-white"
                            value={formData.billing.city}
                            onChange={(val) => updateBilling("city", val)}
                        />
                        <InputField
                            label="State"
                            placeholder="Enter state"
                            className="bg-white"
                            value={formData.billing.state}
                            onChange={(val) => updateBilling("state", val)}
                        />
                    </div>
                </div>

                <div className="bg-[#FFE8D0]/50 rounded-xl p-3 px-5">
                    <p className="lg:text-[12px] md:text-[10px] text-gray-600 font-medium">Your booking updates & alerts will be shared to your billing contact details.</p>
                </div>

                <div className="space-y-6">
                    <div>
                        <h2 className="lg:text-2xl md:text-xl font-medium text-gray-900 tracking-tight">GST Details</h2>
                        <p className="text-gray-400 font-light mt-1 lg:text-sm md:text-xs">To claim credit of GST charged by airlines, please enter your GST details</p>
                    </div>

                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setIsGstEnabled(!isGstEnabled)}
                            className={cn(
                                "w-10 h-5 rounded-full transition-all duration-300 relative flex items-center px-1 group",
                                isGstEnabled ? "bg-[#5C6B89]" : "bg-slate-500"
                            )}
                        >
                            <div className={cn(
                                "w-4 h-4 bg-white rounded-full transition-all duration-300 absolute shadow-sm",
                                isGstEnabled ? "translate-x-5" : "translate-x-0"
                            )} />
                        </button>
                        <span className="lg:text-[12px] md:text-[10px] font-light text-gray-500 cursor-pointer">I would like to add my GST Number</span>
                    </div>
                </div>

                {isGstEnabled && (
                    <div className="bg-[#FAFDFF] space-y-6 border border-slate-500 rounded-2xl p-4">
                        <div className="border border-slate-400 rounded-2xl p-4 bg-white mt-4">
                            <div className="flex flex-col md:flex-row items-center gap-4">
                                <InputField
                                    label="GST Number"
                                    placeholder="Enter GST number"
                                    className="flex-1"
                                    value={formData.gst.number}
                                    onChange={(val) => updateGst("number", val)}
                                />
                                <button className="bg-[#0133EA] text-white px-10 py-3 md:py-2 rounded-full text-[13px] font-light w-full md:w-auto">
                                    Validate
                                </button>
                            </div>
                        </div>

                        <div className="border border-gray-200 rounded-[20px] p-4 md:p-8 space-y-8 bg-white">
                            <div className="flex justify-end">
                                <button className="text-[11px] font-bold text-[#FF5252] hover:text-red-600 transition-colors uppercase underline decoration-1 underline-offset-4">Clear Details</button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-6">
                                <InputField
                                    label="Country Code"
                                    placeholder="Enter Country Code"
                                    className="bg-white"
                                    value={formData.gst.countryCode}
                                    onChange={(val) => updateGst("countryCode", val)}
                                />
                                <InputField
                                    label="Mobile Number"
                                    placeholder="Enter mobile number"
                                    className="bg-white"
                                    value={formData.gst.mobile}
                                    onChange={(val) => updateGst("mobile", val)}
                                />
                                <InputField
                                    label="Email"
                                    placeholder="Enter email"
                                    className="bg-white"
                                    value={formData.gst.email}
                                    onChange={(val) => updateGst("email", val)}
                                />
                                <InputField
                                    label="Nationality"
                                    placeholder="Enter Nationality"
                                    className="bg-white"
                                    value={formData.gst.nationality}
                                    onChange={(val) => updateGst("nationality", val)}
                                />
                            </div>
                        </div>
                    </div>
                )}
                <div className="flex justify-end pt-8">
                    <button
                        onClick={() => setShowReviewModal(true)}
                        className="bg-[#FD9931] hover:bg-[#e88a2a] transition-colors text-white px-14 py-3 rounded-full text-sm font-medium shadow-lg shadow-orange-200"
                    >
                        Continue
                    </button>
                </div>
            </section>

            {/* Review Confirmation Modal */}
            <AnimatePresence>
                {showReviewModal && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowReviewModal(false)}
                            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                        />

                        {/* Modal Content */}
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="bg-white rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl relative z-10"
                        >
                            {/* Modal Header */}
                            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                                <h3 className="text-xl font-semibold text-gray-900">Review Details</h3>
                                <button
                                    onClick={() => setShowReviewModal(false)}
                                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                                >
                                    <X size={20} className="text-gray-500" />
                                </button>
                            </div>

                            {/* Modal Body */}
                            <div className="p-8 max-h-[70vh] overflow-y-auto space-y-8 custom-scrollbar">
                                {/* Passengers Review */}
                                <div className="space-y-4">
                                    <div className="flex items-center gap-2 text-[#2196F3] font-semibold text-sm uppercase tracking-wider">
                                        <User size={16} />
                                        <span>Passenger Information</span>
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        {formData.passengers.map((p, idx) => (
                                            <div key={idx} className="bg-gray-50 p-4 rounded-2xl flex justify-between items-center group">
                                                <div>
                                                    <p className="text-[10px] text-gray-400 uppercase font-bold">Adult {idx + 1}</p>
                                                    <p className="font-medium text-gray-800">
                                                        {p.firstName ? `${p.title} ${p.firstName} ${p.lastName}` : "Not specified"}
                                                    </p>
                                                </div>
                                                <button onClick={() => { setShowReviewModal(false); setOpenPassengerIndex(idx); }} className="text-[#2196F3] text-xs font-bold md:opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                                                    <Edit3 size={12} /> EDIT
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Billing Review */}
                                <div className="space-y-4">
                                    <div className="flex items-center gap-2 text-[#2196F3] font-semibold text-sm uppercase tracking-wider">
                                        <MapPin size={16} />
                                        <span>Billing & Contact</span>
                                    </div>
                                    <div className="bg-gray-50 p-6 rounded-2xl relative group">
                                        <div className="grid grid-cols-2 gap-y-4 gap-x-8">
                                            <div>
                                                <p className="text-[10px] text-gray-400 uppercase font-bold">Mobile Number</p>
                                                <p className="font-medium text-gray-800">{formData.billing.mobile || "Not specified"}</p>
                                            </div>
                                            <div>
                                                <p className="text-[10px] text-gray-400 uppercase font-bold">Pincode</p>
                                                <p className="font-medium text-gray-800">{formData.billing.pincode || "Not specified"}</p>
                                            </div>
                                            <div className="col-span-2">
                                                <p className="text-[10px] text-gray-400 uppercase font-bold">Address</p>
                                                <p className="font-medium text-gray-800">
                                                    {formData.billing.address ? `${formData.billing.address}, ${formData.billing.city}, ${formData.billing.state}` : "Not specified"}
                                                </p>
                                            </div>
                                        </div>
                                        <button onClick={() => setShowReviewModal(false)} className="absolute top-4 right-4 text-[#2196F3] text-xs font-bold md:opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                                            <Edit3 size={12} /> EDIT
                                        </button>
                                    </div>
                                </div>

                                {/* GST Review (Conditional) */}
                                {isGstEnabled && (
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-2 text-[#2196F3] font-semibold text-sm uppercase tracking-wider">
                                            <Hash size={16} />
                                            <span>GST Details</span>
                                        </div>
                                        <div className="bg-gray-50 p-6 rounded-2xl relative group">
                                            <div className="grid grid-cols-2 gap-y-4">
                                                <div>
                                                    <p className="text-[10px] text-gray-400 uppercase font-bold">GST Number</p>
                                                    <p className="font-medium text-gray-800">{formData.gst.number || "Not specified"}</p>
                                                </div>
                                                <div>
                                                    <p className="text-[10px] text-gray-400 uppercase font-bold">Email</p>
                                                    <p className="font-medium text-gray-800">{formData.gst.email || "Not specified"}</p>
                                                </div>
                                            </div>
                                            <button onClick={() => setShowReviewModal(false)} className="absolute top-4 right-4 text-[#2196F3] text-xs font-bold md:opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                                                <Edit3 size={12} /> EDIT
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Modal Footer */}
                            <div className="p-6 bg-gray-50 border-t border-gray-100 flex flex-col sm:flex-row gap-4 items-center justify-between">
                                <p className="text-xs text-gray-500 font-light text-center sm:text-left">
                                    By clicking confirm, you agree to our <span className="text-[#2196F3] cursor-pointer underline">Terms of Booking</span>.
                                </p>
                                <div className="flex gap-4 w-full sm:w-auto">
                                    <button
                                        onClick={() => setShowReviewModal(false)}
                                        className="flex-1 sm:flex-none px-8 py-3 rounded-full border border-gray-200 text-sm font-medium text-gray-600 hover:bg-white transition-colors"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => {
                                            setShowReviewModal(false);
                                            router.push("/seat-booking");
                                        }}
                                        className="flex-1 sm:flex-none px-10 py-3 rounded-full bg-[#FD9931] hover:bg-[#e88a2a] text-white text-sm font-medium shadow-lg shadow-orange-100 transition-all"
                                    >
                                        Confirm
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
