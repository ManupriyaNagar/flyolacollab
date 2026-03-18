import { cn } from "@/lib/utils";
import {
    ChevronRight,
    ArrowRight,
    Info,
    Plus,
    User,
    Armchair,
    ChevronDown,
    MapPin,
    Utensils,
    Coffee,
    MonitorPlay,
    LayoutGrid,
    Check,
    PlaneTakeoff
} from "lucide-react";
export function RightSidebar({
    passengers = [],
    selectedOffer,
    onOfferSelect,
    baseFare,
    taxes,
    discount,
    departure = "Indore",
    departureCode = "INR",
    arrival = "Bhopal",
    arrivalCode = "BHO",
    totalPrice
}) {
    const offers = [
        { id: "SALE", title: "SALE", discount: "₹ 600 Off", desc: "Coupon applied. You will get an instant discount of ₹600.", color: "text-[#10B981]" },
        { id: "IXKOTAKRD", title: "IXKOTAKRD", discount: "₹ 1,200 Off", desc: "Get Flat 10% Off up to ₹1,200 with Kotak Retail Credit Card+Interest Free EMI.", active: false },
        { id: "FLYOLA50", title: "FLYOLA50", discount: "₹ 500 Off", desc: "Special discount for Flyola users.", active: false }
    ];

    return (
        <div className="space-y-6 pb-2">




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
                        {passengers?.map((p, idx) => (
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



            {/* Offers Section */}
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
        </div >
    )
}