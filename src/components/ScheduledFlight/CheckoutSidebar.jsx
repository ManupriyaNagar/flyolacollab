"use client";

import { useState } from "react";
import { Info, PlaneTakeoff, PlaneLanding, ArrowLeftRight } from "lucide-react";
import { cn } from "@/lib/utils";

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
      {/* FLIGHT SUMMARY CARD SECTION */}
      <div className="bg-white rounded-[24px] md:rounded-[32px] shadow-lg border border-gray-100 p-4 md:p-8">
        {/* Header: Logo and Flight details */}
        <div className="flex items-center gap-3 mb-6">
          <div className="flex items-center gap-2">
            {/* Flyola Logo */}
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-6 h-6">
              <path d="M12 2L2 7l10 5 10-5-10-5z" fill="#00B894" />
              <path d="M2 17l10 5 10-5" fill="#4ADE80" />
              <path d="M2 12l10 5 10-5" fill="#00B894" />
            </svg>
            <span className="text-xl font-semibold text-gray-900 tracking-tight">Flyola</span>
          </div>
        </div>

        <div className="flex items-center gap-3 mb-8">
          <span className="text-gray-400 font-medium tracking-tight">SA 8092</span>
          <span className="bg-[#4ADE80] text-white px-3 py-1 rounded-full text-xs font-semibold tracking-wide">Business</span>
        </div>

        {/* Timings and Duration */}
        <div className="flex justify-between items-center mb-10 w-full gap-2">
          <div className="shrink-0">
            <div className="text-xl md:text-3xl font-bold text-gray-900 mb-1">06:45</div>
            <div className="text-[10px] md:text-xs font-semibold text-gray-400 mb-1">{departureCode}</div>
            <div className="text-[10px] md:text-[11px] text-gray-400 font-medium">18 Apr. Wed</div>
          </div>

          <div className="flex flex-col items-center flex-1 min-w-0 px-1 md:px-4 mb-3">
            <div className="w-full flex items-center mb-2">
              <div className="w-1.5 h-1.5 rounded-full bg-gray-400"></div>
              <div className="h-[1px] w-full border-t border-dashed border-gray-300 relative top-[0.5px]"></div>
              <PlaneTakeoff className="w-4 h-4 md:w-5 md:h-5 text-gray-400 mx-1 md:mx-2 shrink-0" />
              <div className="h-[1px] w-full border-t border-dashed border-gray-300 relative top-[0.5px]"></div>
              <div className="w-1.5 h-1.5 rounded-full bg-gray-400"></div>
            </div>
            <div className="flex items-center gap-1 md:gap-2 text-[9px] md:text-[10px] text-gray-400 font-medium whitespace-nowrap">
              <span>1h 50min</span>
              <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
              <span>Direct Flight</span>
            </div>
          </div>

          <div className="text-right shrink-0">
            <div className="text-xl md:text-3xl font-bold text-gray-900 mb-1">08:00</div>
            <div className="text-[10px] md:text-xs font-semibold text-gray-400 mb-1">{arrivalCode}</div>
            <div className="text-[10px] md:text-[11px] text-gray-400 font-medium">18 Apr. Wed</div>
          </div>
        </div>

        {/* Travellers Section */}
        <div>
          <h3 className="text-lg font-semibold text-[#00B894] mb-4">Travellers</h3>
          <div className="space-y-3">
            {passengersData?.map((p, idx) => (
              <div key={p.id || idx} className="bg-[#FFEFD5] rounded-xl px-4 md:px-5 py-3 md:py-4 flex justify-between items-center">
                <span className="text-gray-900 text-sm md:text-[15px] font-medium tracking-tight truncate mr-2">{idx + 1}. {p.name}</span>
                <div className="flex items-center gap-2 md:gap-3 shrink-0">
                  <div className="bg-[#111827] text-white rounded-full w-6 h-6 md:w-7 md:h-7 flex items-center justify-center shadow-sm">
                    {/* Top-down Seat Icon */}
                    <div className="w-2 h-3 md:w-2.5 md:h-3.5 bg-white rounded-[2px] md:rounded-[3px] border-l-[3px] md:border-l-[3.5px] border-[#00B894]"></div>
                  </div>
                  <span className="text-gray-900 font-medium text-sm md:text-[15px] min-w-[20px]">{p.seat || "—"}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* OFFERS SECTION */}
      <div className="bg-white rounded-[24px] md:rounded-[32px] shadow-lg border border-gray-100 overflow-hidden">
        <div className="p-4 md:p-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-6 tracking-tight">Offers For You</h2>

          {/* Promo code field */}
          <div className="relative mb-4">
            <input
              type="text"
              placeholder="Have a Promo code? Reedeem here"
              value={promoCode}
              onChange={(e) => setPromoCode(e.target.value)}
              className="w-full border-2 border-gray-200 rounded-2xl px-4 py-2 text-gray-800 text-xs focus:outline-none focus:border-blue-400 placeholder:text-gray-400 transition-all font-medium"
            />
          </div>

          <div className="space-y-2">
            {offers.map((offer) => (
              <div
                key={offer.id}
                className="flex gap-4 cursor-pointer group"
                onClick={() => setSelectedOffer(offer.id)}
              >
                <div className="mt-1.5 h-4 w-4 rounded-full border-2 border-gray-300 flex items-center justify-center transition-all group-hover:border-blue-500 shrink-0">
                  {selectedOffer === offer.id && (
                    <div className="h-2 w-2 rounded-full bg-blue-600 shadow-sm" />
                  )}
                </div>

                <div className="flex-1">
                  <div className="flex justify-between items-center mb-1 gap-2">
                    <span className="text-sm font-light text-gray-900 tracking-tight">{offer.title}</span>
                    <span className="text-xs font-semibold text-gray-900 tracking-tight whitespace-nowrap">{offer.discount}</span>
                  </div>

                  <p className={cn(
                    "text-xs leading-relaxed font-medium",
                    selectedOffer === offer.id && offer.isCouponApplied ? "text-[#10B981]" : "text-gray-500"
                  )}>
                    {offer.description}
                  </p>

                  <button className="text-xs font-light text-gray-900 underline mt-2 hover:text-blue-600 transition-colors">
                    Know More
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* View All Offers Footer */}
        <div className="border-t border-gray-100 p-6 flex bg-gray-50/30">
          <button className="text-xs font-light text-gray-900 tracking-tight hover:text-blue-600 transition-colors">
            View All Offers
          </button>
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

      {/* LEGAL & PAYMENT SECTION */}
      <div className="px-2 md:space-y-12 space-y-4 pb-10">
        <p className="text-sm text-gray-900 leading-[1.6] font-light tracking-tight">
          By clicking on continue, I confirm that I have read, understood, and agree with the{" "}
          <span className="text-blue-600 underline cursor-pointer hover:text-blue-700 transition-colors">Fare Rules</span>,{" "}
          <span className="text-blue-600 underline cursor-pointer hover:text-blue-700 transition-colors">Privacy Policy</span> and{" "}
          <span className="text-blue-600 underline cursor-pointer hover:text-blue-700 transition-colors">Terms</span> of Use.
        </p>

        <div className="space-y-6">
          <h4 className="text-lg font-light text-gray-700 tracking-tighter opacity-90">100% Safe Payment Process</h4>

          <div className="flex items-center gap-4 py-2 overflow-hidden">
            {/* Note: I'm using the standard images available if possible or styled text as fallback */}
            <img src="/flights/image-1.png" alt="" />
            <img src="/flights/image-7.png" alt="" />
            <img src="/flights/image-8.png" alt="" />

          </div>
        </div>
      </div>
    </div>
  );
}