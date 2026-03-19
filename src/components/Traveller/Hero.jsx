"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { ChevronRight, Check } from "lucide-react";
import { usePathname } from "next/navigation";

export default function Hero() {
    const pathname = usePathname() || "";

    // Determine current step index based on URL
    const getCurrentStepIdx = () => {
        if (pathname.includes("payment")) return 2; // Step 3 (0-indexed)
        if (pathname.includes("traveller-details")) return 1; // Step 2 (0-indexed)
        return 0; // Default to Step 1
    };

    const currentIdx = getCurrentStepIdx();

    const steps = [
        { id: 1, label: "Flight Selection" },
        { id: 2, label: "Review & Traveller Details" },
        { id: 3, label: "Payment" },
    ];

    const getStatus = (idx) => {
        if (idx < currentIdx) return "completed";
        if (idx === currentIdx) return "active";
        return "pending";
    };

    return (
        <div className="flex justify-center mb-8 px-4 w-full">
            <div className="w-full overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                <div className="flex items-center md:justify-center gap-2 bg-white px-4 md:px-12 lg:px-24 py-3 rounded-2xl shadow-sm border border-gray-100 min-w-max md:min-w-0">
                    {steps.map((step, index) => {
                        const status = getStatus(index);
                        return (
                            <React.Fragment key={step.id}>
                                <div className="flex items-center gap-2 shrink-0">
                                    <div className={cn(
                                        "w-6 h-6 md:w-8 md:h-8 rounded-full flex items-center justify-center transition-all duration-300",
                                        (status === "completed" || status === "active") && "bg-[#10B981] text-white shadow-md shadow-emerald-100",
                                        status === "pending" && "bg-gray-100 text-gray-400"
                                    )}>
                                        {status === "completed" ? (
                                            <Check className="w-3.5 h-3.5 md:w-4 md:h-4 stroke-[4px]" />
                                        ) : (
                                            <ChevronRight className={cn(
                                                "w-4 h-4 md:w-5 md:h-5 stroke-[3px]",
                                                status === "pending" ? "text-gray-300" : "text-white"
                                            )} />
                                        )}
                                    </div>
                                    <span className={cn(
                                        "text-xs md:text-sm font-bold whitespace-nowrap transition-colors",
                                        status === "pending" ? "text-gray-400" : "text-gray-900"
                                    )}>
                                        {step.label}
                                    </span>
                                </div>
                                {index < steps.length - 1 && (
                                    <div className={cn(
                                        "h-px mx-2 md:mx-4 shrink-0 transition-all duration-500",
                                        "w-10 sm:w-16 md:w-24 lg:w-48 xl:w-56",
                                        status === "completed" ? "bg-[#10B981]" : "bg-gray-200"
                                    )} />
                                )}
                            </React.Fragment>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}