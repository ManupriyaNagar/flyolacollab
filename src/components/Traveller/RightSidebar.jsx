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
    Check
} from "lucide-react";
export function RightSidebar({
    passengers = [],
    selectedOffer,
    onOfferSelect,
    baseFare,
    taxes,
    discount,
    totalPrice
}) {
    const offers = [
        { id: "SALE", title: "SALE", discount: "₹ 600 Off", desc: "Coupon applied. You will get an instant discount of ₹600.", color: "text-[#10B981]" },
        { id: "IXKOTAKRD", title: "IXKOTAKRD", discount: "₹ 1,200 Off", desc: "Get Flat 10% Off up to ₹1,200 with Kotak Retail Credit Card+Interest Free EMI.", active: false },
        { id: "FLYOLA50", title: "FLYOLA50", discount: "₹ 500 Off", desc: "Special discount for Flyola users.", active: false }
    ];

    return (
        <div className="space-y-6">
            {/* Offers Section */}
            <div className="bg-white rounded-2xl border border-gray-200 ">
                <div className="p-8">
                    <h2 className="text-xl font-light text-gray-900 mb-6 tracking-tighter">Offers For You</h2>

                    {/* Promo code field */}
                    <div className="relative mb-6">
                        <input
                            type="text"
                            placeholder="Have a Promo code? Reedeem here"
                            className="w-full border-2 border-gray-400 rounded-2xl px-5 py-3 text-gray-800 text-sm focus:outline-none focus:border-blue-400 placeholder:text-gray-300 transition-all font-medium"
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
                                    "mt-1 h-5 w-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all",
                                    selectedOffer === offer.id ? "border-blue-600" : "border-gray-200 group-hover:border-blue-300"
                                )}>
                                    {selectedOffer === offer.id && <div className="h-2.5 w-2.5 rounded-full bg-blue-600 shadow-sm" />}
                                </div>

                                <div className="flex-1">
                                    <div className="flex justify-between items-center mb-1">
                                        <span className="text-sm font-medium text-gray-900 tracking-tight">{offer.title}</span>
                                        <span className="text-sm font-medium text-gray-900 tracking-tight">{offer.discount}</span>
                                    </div>
                                    <p className={cn("text-sm leading-relaxed font-light", selectedOffer === offer.id ? "text-[#10B981]" : "text-gray-400")}>
                                        {offer.desc}
                                    </p>
                                    <button className="text-[10px] font-medium text-gray-900 underline mt-2 hover:text-blue-600 uppercase tracking-widest">
                                        Know More
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="border-t border-gray-100 p-6 bg-gray-50/30">
                    <button className="text-xs font-medium text-gray-900 tracking-tight hover:text-blue-600 transition-colors uppercase">
                        View All Offers
                    </button>
                </div>
            </div>

            {/* Fare Summary */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-md p-8 w-full max-w-xl">

                {/* Header */}
                <div className="space-y-6">
                    <div className="flex items-start justify-between ">
                        <h2 className="text-xl font-medium text-black">
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
                            ₹{baseFare.toLocaleString()}
                        </span>
                    </div>

                    {/* Taxes */}
                    <div className="flex justify-between items-center ">
                        <span className="text-md text-black">
                            Taxes & Fees
                        </span>
                        <span className="text-md font-medium text-black">
                            ₹{taxes.toLocaleString()}
                        </span>
                    </div>
                </div>

                {/* Divider */}
                <div className="border-t border-gray-300 mt-2" />

                {/* Instant Off */}
                <div className="flex justify-between items-center py-2">
                    <span className="text-md text-black">
                        Instant Off
                    </span>
                    <span className="text-md font-medium text-green-700">
                        -₹{discount.toLocaleString()}
                    </span>
                </div>

                {/* Divider */}
                <div className="border-t border-gray-300" />

                {/* Total */}
                <div className="flex justify-between items-center pt-4">
                    <span className="text-xl font-medium text-black">
                        Total Amount
                    </span>
                    <span className="text-xl font-medium text-black">
                        ₹{totalPrice.toLocaleString()}
                    </span>
                </div>


            </div>


            {/* Logos & Legal Text */}
            <div className="px-6">
                <div className="relative group">
                    <p className="text-[14px] text-gray-900 leading-relaxed font-light opacity-70">
                        By clicking on continue, I confirm that I have read, understood, and agree with the <span className="text-blue-600 underline cursor-pointer hover:text-blue-700">Fare Rules</span>, <span className="text-blue-600 underline cursor-pointer hover:text-blue-700">Privacy Policy</span> and <span className="text-blue-600 underline cursor-pointer hover:text-blue-700">Terms</span> of Use.
                    </p>
                    {/* Arrow pointing to text as seen in screenshot */}
                    <div className="absolute -right-4 top-1/2 -translate-y-1/2 hidden xl:block">
                        <div className="relative">
                            <div className="w-12 h-24 border-r-2 border-b-2 border-gray-300 rounded-br-[20px]" />
                            <ArrowRight className="absolute -bottom-1.5 -right-2 text-gray-300 rotate-180" size={20} />
                        </div>
                        <div className="absolute -bottom-12 -right-20 whitespace-nowrap text-[10px] font-medium text-gray-400 uppercase tracking-widest text-center">
                            Click Any Link to Open<br />Side Menu
                        </div>
                    </div>
                </div>

                <div className="">
                    <h4 className="text-md font-medium text-gray-400 uppercase mt-2">100% Safe Payment Process</h4>
                    <div className="flex gap-4">
                        <img src="/flights/image-1.png" alt="" />
                        <img src="/flights/image-7.png" alt="" />
                        <img src="/flights/image-8.png" alt="" />
                    </div>
                </div>
            </div>
        </div>
    )
}