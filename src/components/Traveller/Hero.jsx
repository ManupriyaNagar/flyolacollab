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
        <div className="flex justify-center mb-8">
            <div className="flex items-center gap-2 bg-white px-25 py-3 rounded-2xl shadow-sm border border-gray-100">
                {steps.map((step, index) => (
                    <React.Fragment key={step.id}>
                        <div className="flex items-center gap-2">
                            <div className={cn(
                                "w-8 h-8 rounded-full flex items-center justify-center transition-all",
                                step.status === "completed" && "bg-[#10B981] text-white",
                                step.status === "active" && "bg-[#10B981] text-white",
                                step.status === "pending" && "bg-[#F97316] text-white"
                            )}>
                                <ChevronRight size={20} className="stroke-[3px]" />
                            </div>
                            <span className={cn(
                                "text-sm font-medium whitespace-nowrap",
                                step.status === "pending" ? "text-gray-400" : "text-gray-900"
                            )}>
                                {step.label}
                            </span>
                        </div>
                        {index < steps.length - 1 && (
                            <div className="w-84 h-px bg-gray-200 mx-4" />
                        )}
                    </React.Fragment>
                ))}
            </div>
        </div>
    )
}