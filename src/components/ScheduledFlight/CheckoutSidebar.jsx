"use client";

import { useState } from "react";
import { Info, PlaneTakeoff, PlaneLanding, ArrowLeftRight } from "lucide-react";
import { cn } from "@/lib/utils";

import {
  ChevronRight,
  ArrowRight,
  Plus,
  User,
  Armchair,
  ChevronDown,
  MapPin,
  Utensils,
  Coffee,
  MonitorPlay,
  LayoutGrid,
  Check
} from "lucide-react";
/**
 * CheckoutSidebar Component
 * @param {string} departure - Departure city name
 * @param {string} arrival - Arrival city name
 * @param {number} passengers - Number of passengers
 */
export default function CheckoutSidebar({
  departure = "Indore",
  departureCode = "INR",
  arrival = "Bhopal",
  arrivalCode = "BHO",
  passengers = 1,

  onOfferSelect,
  baseFare,
  taxes,
  discount,
  totalPrice, // ✅ FIX: comma added
  passengersData = []
}) {

  const [selectedOffer, setSelectedOffer] = useState("SALE");
  const [promoCode, setPromoCode] = useState("");

  const offers = [
    {
      id: "SALE",
      title: "SALE",
      discount: "₹ 600 Off",
      description: "Coupon applied. You will get an instant discount of ₹600.",
      isCouponApplied: true,
    },
    {
      id: "IXKOTAKRD1",
      title: "IXKOTAKRD",
      discount: "₹ 600 Off",
      description:
        "Get Flat 10% Off up to ₹1,200 with Kotak Retail Credit Card+Interest Free EMI. Receive a Hotel discount code after your booking.",
    },
    {
      id: "IXKOTAKRD2",
      title: "IXKOTAKRD",
      discount: "₹ 600 Off",
      description:
        "Get Flat 10% Off up to ₹1,200 with Kotak Retail Credit Card+Interest Free EMI. Receive a Hotel discount code after your booking.",
    },
  ];

  return (
    <div className="w-full inter-font md:max-w-4xl mx-auto space-y-4 py-2 px-2 md:px-0">



      <div className="bg-white rounded-2xl border border-gray-200 shadow-md p-4 lg:p-6 xl:p-8 w-full flex flex-col">
        <div className="space-y-4">
          <h2 className="text-xl lg:text-2xl font-medium text-black">Offers For You</h2>

          {/* Promo code field */}
          <div className="relative">
            <input
              type="text"
              placeholder="Have a Promo code? Reedeem here"
              className="w-full border border-gray-200 rounded-2xl px-4 py-3 text-gray-800 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 placeholder:text-gray-400 transition-all font-light"
            />
          </div>

          <div className="space-y-6">
            {offers.map((offer) => (
              <div
                key={offer.id}
                onClick={() => onOfferSelect(offer.id)}
                className="flex gap-4 group cursor-pointer"
              >
                <div className={cn(
                  "mt-1 h-[22px] w-[22px] rounded-full border-2 flex items-center justify-center shrink-0 transition-all",
                  selectedOffer === offer.id ? "border-blue-600 bg-blue-600" : "border-slate-300 group-hover:border-blue-400"
                )}>
                  {selectedOffer === offer.id && <Check size={14} strokeWidth={3} color="white" />}
                </div>

                <div className="flex-1">
                  <div className="flex justify-between items-start xl:items-center mb-1 flex-col xl:flex-row gap-1 xl:gap-0">
                    <span className="text-sm font-medium text-gray-900 tracking-tight">{offer.title}</span>
                    <span className="text-xs font-bold text-[#10B981] tracking-tight">{offer.discount}</span>
                  </div>
                  <p className={cn("text-xs leading-relaxed font-light", selectedOffer === offer.id ? "text-gray-800" : "text-gray-500")}>
                    {offer.desc}
                  </p>
                  <button className="text-[10px] font-bold text-gray-900 underline underline-offset-4 mt-2 hover:text-blue-600 uppercase tracking-wide">
                    Know More
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="border-t border-gray-200 mt-6 pt-4 flex justify-between items-center">
          <button className="text-[11px] font-bold text-gray-900 tracking-wide hover:text-blue-600 transition-colors uppercase underline underline-offset-4">
            View All Offers
          </button>
        </div>
      </div>



      {/* Fare Summary */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-md p-4 lg:p-6 xl:p-8 w-full">

        {/* Header */}
        <div className="space-y-6">
          <div className="flex items-start justify-between ">
            <h2 className="text-2xl font-medium text-black">
              Fare Summary
            </h2>
            <span className="text-xs text-gray-600 font-light">
              {passengers.length} Traveller{passengers.length > 1 ? 's' : ''}
            </span>
          </div>

          {/* Fare Type */}
          <div className="flex justify-between items-center">
            <span className="text-md text-black">
              Fare Type
            </span>
            <span className="text-md font-medium text-green-700">
              Partially Refundable
            </span>
          </div>

          {/* Base Fare */}
          <div className="flex justify-between items-center ">
            <span className="text-md text-black">
              Base Fare
            </span>
            <span className="text-md font-medium text-black">
              ₹{(baseFare || 0).toLocaleString()}
            </span>
          </div>

          {/* Taxes */}
          <div className="flex justify-between items-center ">
            <span className="text-md text-black">
              Taxes & Fees
            </span>
            <span className="text-md font-medium text-black">
              ₹{(taxes || 0).toLocaleString()}
            </span>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-[#E6E6E6] mt-2" />

        {/* Instant Off */}
        <div className="flex justify-between items-center py-2">
          <span className="text-md text-black">
            Instant Off
          </span>
          <span className="text-md font-medium text-green-700">
            -₹{(discount || 0).toLocaleString()}
          </span>
        </div>

        {/* Divider */}
        <div className="border-t border-[#E6E6E6]" />

        {/* Total */}
        <div className="flex justify-between items-center pt-4">
          <span className="text-xl font-medium text-black">
            Total Amount
          </span>
          <span className="text-xl font-medium text-black">
            ₹{(totalPrice || 0).toLocaleString()}
          </span>
        </div>


      </div>

      {/* ACTIVE FILTERS SUMMARY SECTION */}
      <div className="bg-white rounded-[32px] shadow-lg border border-gray-100 p-4">
        <div className="flex justify-between items-start">
          <h3 className="text-sm font-light text-gray-900 tracking-tight">Active Filters Summary</h3>
          <button className="p-1 hover:bg-gray-50 rounded-full transition-colors">
            <Info className="w-8 h-8 text-blue-400" />
          </button>
        </div>

        <p className="text-gray-400 font-light text-sm leading-relaxed mb-4">
          Min. transaction of IDR 900,000 with Paylater
        </p>

        {/* Route Display */}
        <div className="flex items-center gap-1 mb-2">
          <div className="flex-1 bg-[#EFF6FF] rounded-full py-1.5 md:py-2 px-3 md:px-4 flex items-center justify-center gap-1.5 md:gap-2 border border-blue-50/50 min-w-0">
            <PlaneTakeoff className="w-4 h-4 md:w-6 md:h-6 text-gray-900 shrink-0" />
            <span className="text-[10px] md:text-xs font-light text-gray-900 tracking-tight truncate">{departureCode}</span>
          </div>

          <div className="z-10 -mx-2 flex-shrink-0">
            <div className="w-8 h-8 md:w-12 md:h-12 bg-white rounded-full flex items-center justify-center shadow-lg border border-gray-100">
              <ArrowLeftRight className="w-4 h-4 md:w-5 md:h-5 text-gray-400" />
            </div>
          </div>

          <div className="flex-1 bg-[#EFF6FF] rounded-full py-1.5 md:py-2 px-3 md:px-4 flex items-center justify-center gap-1.5 md:gap-2 border border-blue-50/50 min-w-0">
            <PlaneLanding className="w-4 h-4 md:w-6 md:h-6 text-gray-900 shrink-0" />
            <span className="text-[10px] md:text-xs font-light text-gray-900 tracking-tight truncate">{arrivalCode}</span>
          </div>
        </div>

        <p className="text-[#F43F5E] text-sm font-light tracking-tight px-1">
          Min. {passengers} Seat{passengers > 1 ? 's' : ''}
        </p>
      </div>

      {/* Logos & Legal Text */}
      <div className="">
        <div className="relative group">
          <p className="text-[14px] text-gray-900 leading-relaxed font-light opacity-70">
            By clicking on continue, I confirm that I have read, understood, and agree with the <span className="text-blue-600 underline cursor-pointer hover:text-blue-700">Fare Rules</span>, <span className="text-blue-600 underline cursor-pointer hover:text-blue-700">Privacy Policy</span> and <span className="text-blue-600 underline cursor-pointer hover:text-blue-700">Terms</span> of Use.
          </p>
          {/* Arrow pointing to text as seen in screenshot */}
          <div className="absolute -right-4 top-1/2 -translate-y-1/2 hidden xl:block">
            <div className="relative">
              <div className="w-12 h-24 border-r-2 border-b-2 border-[#E6E6E6] rounded-br-[20px]" />
              <ArrowRight className="absolute -bottom-1.5 -right-2 text-gray-300 rotate-180" size={20} />
            </div>
            <div className="absolute -bottom-12 -right-20 whitespace-nowrap text-[10px] font-medium text-gray-400 uppercase tracking-widest text-center">
              Click Any Link to Open<br />Side Menu
            </div>
          </div>
        </div>

        <div className="md:mb-10">
          <h4 className="text-md font-medium text-gray-400 uppercase mt-2">100% Safe Payment Process</h4>
          <div className="flex">
            <img src="/flights/image-1.png" alt="" />
            <img src="/flights/image-7.png" alt="" />
            <img src="/flights/image-8.png" alt="" />
          </div>
        </div>
      </div>
    </div>
  );
}