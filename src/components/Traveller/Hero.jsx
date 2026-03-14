import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { ChevronRight } from "lucide-react";
export default function Hero() {

    const steps = [
        { id: 1, label: "Flight Selection", status: "completed" },
        { id: 2, label: "Review & Traveller Details", status: "active" },
        { id: 3, label: "Payment", status: "pending" },
    ];
    return (
        <div className="flex justify-center mb-8 px-4 w-full">
            <div className="w-full overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                <div className="flex items-center md:justify-center gap-2 bg-white px-4 md:px-12 lg:px-24 py-3 rounded-2xl shadow-sm border border-gray-100 min-w-max md:min-w-0">
                    {steps.map((step, index) => (
                        <React.Fragment key={step.id}>
                            <div className="flex items-center gap-2 shrink-0">
                                <div className={cn(
                                    "w-6 h-6 md:w-8 md:h-8 rounded-full flex items-center justify-center transition-all",
                                    step.status === "completed" && "bg-[#10B981] text-white",
                                    step.status === "active" && "bg-[#10B981] text-white",
                                    step.status === "pending" && "bg-[#F97316] text-white"
                                )}>
                                    <ChevronRight className="w-4 h-4 md:w-5 md:h-5 stroke-[3px]" />
                                </div>
                                <span className={cn(
                                    "text-xs md:text-sm font-medium whitespace-nowrap",
                                    step.status === "pending" ? "text-gray-400" : "text-gray-900"
                                )}>
                                    {step.label}
                                </span>
                            </div>
                            {index < steps.length - 1 && (
                                <div className="w-10 sm:w-16 md:w-24 lg:w-48 xl:w-84 h-px bg-gray-200 mx-2 md:mx-4 shrink-0" />
                            )}
                        </React.Fragment>
                    ))}
                </div>
            </div>
        </div>
    )
}