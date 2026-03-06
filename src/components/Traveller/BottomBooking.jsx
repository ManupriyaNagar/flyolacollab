import {
    ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
export function BottomBooking({ totalPrice }) {
    const [isBooking, setIsBooking] = useState(false);

    const handleBook = () => {
        setIsBooking(true);
        setTimeout(() => {
            setIsBooking(false);
            alert("Booking Successful!");
        }, 2000);
    };

    return (
        <div className=" bg-white rounded-3xl border border-gray-100 p-10 flex items-center justify-between relative overflow-hidden group">


            <div className=" items-center gap-12">
                <div className="text-[#111827] font-medium text-5xl">
                    ₹{totalPrice.toLocaleString()} <span className="text-base font-light text-[#F43F5E] ml-4">₹{(totalPrice + 1200).toLocaleString()}</span>
                </div>
            </div>
            <div className="flex  flex-row md:flex-col justify-between items-center px-10">


                <div className="flex justify-between items-center px-10">
                    <button className="text-[12px] font-medium text-[#F97316] flex items-center gap-3 hover:underline tracking-widest uppercase group">
                        Cancellation & Rescheduling Policy
                        <span className="bg-orange-100 text-orange-600 p-1.5 rounded-full transition-transform group-hover:scale-110">
                            <ChevronRight size={14} className="stroke-[4px]" />
                        </span>
                    </button>
                </div>
                <div className="flex justify-between items-center mt-6">

                    <button
                        onClick={handleBook}
                        disabled={isBooking}
                        className={cn(
                            "bg-[#10B981] hover:bg-[#0da271] text-white px-14 py-2 rounded-full font-medium text-md transition-all shadow-2xl shadow-green-200 uppercase tracking-widest hover:scale-105 active:scale-95 flex items-center gap-3",
                            isBooking && "opacity-70 cursor-not-allowed"
                        )}
                    >
                        {isBooking ? (
                            <>
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                Processing...
                            </>
                        ) : "Book Now"}
                    </button>
                </div>
            </div>
        </div>
    )
}