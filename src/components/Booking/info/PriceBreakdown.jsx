"use client";
import { PriceCalculator } from "@/lib/business/PriceCalculator";
import { cn } from "@/lib/utils";
import { useMemo } from "react";

/**
 * Price Breakdown Component
 * Displays itemized pricing
 * @security All calculations through PriceCalculator - cannot be manipulated
 */
export default function PriceBreakdown({
  basePrice,
  passengers = { adults: 1, children: 0, infants: 0 },
  travelers = [],
  bookingType = "flight",
  weightSettings = { freeWeightLimit: 75, pricePerKg: 500 }
}) {
  // Calculate breakdown using secure PriceCalculator
  const breakdown = useMemo(() => {
    return PriceCalculator.calculateBreakdown({
      basePrice,
      passengers,
      travelers,
      bookingType,
      freeWeightLimit: weightSettings.freeWeightLimit,
      pricePerKg: weightSettings.pricePerKg
    });
  }, [basePrice, passengers, travelers, bookingType, weightSettings]);

  const items = [
    {
      label: `Base Price (Adults: ${passengers.adults})`,
      amount: breakdown.adultPrice,
      show: passengers.adults > 0
    },
    {
      label: `Children (${passengers.children}) - 50% off`,
      amount: breakdown.childPrice,
      show: passengers.children > 0
    },
    {
      label: `Infants (${passengers.infants})`,
      amount: breakdown.infantFee,
      show: passengers.infants > 0
    },
    {
      label: "Weight Charges",
      amount: breakdown.weightCharges,
      show: bookingType === "helicopter" && breakdown.weightCharges > 0
    }
  ];

  return (
    <div className={cn(
      "bg-gradient-to-br from-purple-50 to-pink-50",
      "p-6 rounded-2xl border border-purple-200"
    )}>
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        Price Breakdown
      </h3>

      <div className="space-y-3">
        {/* Line Items */}
        {items.map((item, index) => 
          item.show && (
            <div key={index} className="flex justify-between items-center">
              <span className="text-gray-600 text-sm">{item.label}</span>
              <span className="font-semibold">
                {PriceCalculator.formatPrice(item.amount)}
              </span>
            </div>
          )
        )}

        {/* Subtotal */}
        {breakdown.taxes > 0 && (
          <>
            <div className="flex justify-between items-center pt-2 border-t border-gray-200">
              <span className="text-gray-600">Subtotal</span>
              <span className="font-semibold">
                {PriceCalculator.formatPrice(breakdown.subtotal)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Taxes & Fees</span>
              <span className="font-semibold">
                {PriceCalculator.formatPrice(breakdown.taxes)}
              </span>
            </div>
          </>
        )}

        {/* Total */}
        <div className={cn(
          "flex justify-between items-center",
          "pt-3 border-t-2 border-gray-300"
        )}>
          <span className="text-xl font-bold text-gray-800">Total Amount</span>
          <span className="text-xl font-bold text-green-600">
            {PriceCalculator.formatPrice(breakdown.total)}
          </span>
        </div>

        {/* Footer Note */}
        <p className="text-xs text-gray-500 mt-2 text-center">
          ✅ Includes all taxes and fees
        </p>
      </div>

      {/* Security Notice */}
      <div className="mt-4 p-2 bg-gray-100 rounded-lg">
        <p className="text-xs text-gray-600 text-center">
          🔒 Price calculated securely
        </p>
      </div>
    </div>
  );
}
