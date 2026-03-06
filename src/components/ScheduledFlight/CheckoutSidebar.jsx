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
  passengers = 1
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
    <div className="w-full md:max-w-4xl mx-auto space-y-4 py-2">
      {/* OFFERS SECTION */}
      <div className="bg-white rounded-[32px] shadow-lg border border-gray-100 overflow-hidden">
        <div className="p-8">
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
          <div className="flex-1 bg-[#EFF6FF] rounded-full py-2 px-4 flex items-center justify-center gap-2 border border-blue-50/50">
            <PlaneTakeoff className="w-6 h-6 text-gray-900" />
            <span className="text-xs font-light text-gray-900 tracking-tight truncate">{departure}({departureCode})</span>
          </div>

          <div className="z-10 -mx-1 flex-shrink-0">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg border border-gray-100">
              <ArrowLeftRight className="w-5 h-5 text-gray-400" />
            </div>
          </div>

          <div className="flex-1 bg-[#EFF6FF] rounded-full py-2 px-4 flex items-center justify-center gap-2 border border-blue-50/50">
            <PlaneLanding className="w-6 h-6 text-gray-900" />
            <span className="text-xs font-light text-gray-900 tracking-tight truncate">{arrival}({arrivalCode})</span>
          </div>
        </div>

        <p className="text-[#F43F5E] text-sm font-light tracking-tight px-1">
          Min. {passengers} Seat{passengers > 1 ? 's' : ''}
        </p>
      </div>

      {/* LEGAL & PAYMENT SECTION */}
      <div className="px-2 space-y-12 pb-10">
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
            <div className="flex items-center gap-4">
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}