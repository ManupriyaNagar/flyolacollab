"use client";

import { cn } from "@/lib/utils";
import API from "@/services/api";
import { useEffect, useState } from "react";
import { FaClock, FaInfoCircle, FaSave } from "react-icons/fa";
import { toast } from "react-toastify";
const BookingSettingsPage = () => {
  const [flightCutoffTime, setFlightCutoffTime] = useState("09:00");
  const [helicopterCutoffTime, setHelicopterCutoffTime] = useState("09:00");
  const [flightAdvanceBookingDays, setFlightAdvanceBookingDays] = useState(0);
  const [helicopterAdvanceBookingDays, setHelicopterAdvanceBookingDays] = useState(0);
  const [helicopterWeightPricePerKg, setHelicopterWeightPricePerKg] = useState(500);
  const [helicopterFreeWeightLimit, setHelicopterFreeWeightLimit] = useState(75);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchCurrentSettings();
  }, []);

  const fetchCurrentSettings = async () => {
    try {
      setLoading(true);
      const response = await API.systemSettings.getBookingCutoffTime();
      setFlightCutoffTime(response.data.flight_cutoff_time || "09:00");
      setHelicopterCutoffTime(response.data.helicopter_cutoff_time || "09:00");
      setFlightAdvanceBookingDays(response.data.flight_advance_booking_days || 0);
      setHelicopterAdvanceBookingDays(response.data.helicopter_advance_booking_days || 0);
      setHelicopterWeightPricePerKg(response.data.helicopter_weight_price_per_kg || 500);
      setHelicopterFreeWeightLimit(response.data.helicopter_free_weight_limit || 75);
    } catch (error) {
      console.error("Error fetching settings:", error);
      toast.error("Failed to load current settings");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      await API.systemSettings.updateBookingCutoffTime({
        flight_cutoff_time: flightCutoffTime,
        helicopter_cutoff_time: helicopterCutoffTime,
        flight_advance_booking_days: flightAdvanceBookingDays,
        helicopter_advance_booking_days: helicopterAdvanceBookingDays,
        helicopter_weight_price_per_kg: helicopterWeightPricePerKg,
        helicopter_free_weight_limit: helicopterFreeWeightLimit
      });
      toast.success("Booking cutoff settings updated successfully!");
      fetchCurrentSettings();
    } catch (error) {
      console.error("Error updating settings:", error);
      toast.error(error.response?.data?.error || "Failed to update settings");
    } finally {
      setSaving(false);
    }
  };

  const timeOptions = [];
  for (let hour = 0; hour < 24; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      const timeStr = `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
      timeOptions.push(timeStr);
    }
  }

  if (loading) {
    return (
      <div className={cn('flex', 'items-center', 'justify-center', 'min-h-screen')}>
        <div className={cn('text-lg', 'text-gray-600')}>Loading settings...</div>
      </div>
    );
  }

  return (
    <div className={cn('min-h-screen', 'bg-gradient-to-br', 'from-gray-50', 'to-blue-50', 'p-6')}>
      <div className={cn('max-w-7xl', 'mx-auto')}>
        {/* Header */}
        <div className="mb-8">
          <h1 className={cn('text-3xl', 'font-bold', 'text-gray-800', 'mb-2')}>Booking Settings</h1>
          <p className="text-gray-600">Configure system-wide booking parameters</p>
        </div>

        {/* Flight Cutoff Settings */}
        <div className={cn('bg-white', 'rounded-2xl', 'shadow-lg', 'p-8', 'mb-6')}>
          <div className={cn('flex', 'items-center', 'gap-3', 'mb-6')}>
            <div className={cn('w-12', 'h-12', 'bg-blue-100', 'rounded-full', 'flex', 'items-center', 'justify-center')}>
              <FaClock className={cn('text-blue-600', 'text-xl')} />
            </div>
            <div>
              <h2 className={cn('text-xl', 'font-bold', 'text-gray-800')}>✈️ Flight Booking Cutoff Time</h2>
              <p className={cn('text-sm', 'text-gray-500')}>Set the time when same-day flight bookings will be disabled</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className={cn('block', 'text-sm', 'font-medium', 'text-gray-700', 'mb-2')}>
                Flight Cutoff Time (IST - Asia/Kolkata)
              </label>
              <select
                value={flightCutoffTime}
                onChange={(e) => setFlightCutoffTime(e.target.value)}
                className={cn('w-full', 'px-4', 'py-3', 'border', 'border-gray-300', 'rounded-lg', 'focus:ring-2', 'focus:ring-blue-500', 'focus:border-blue-500', 'text-lg')}
              >
                {timeOptions.map((time) => (
                  <option key={time} value={time}>
                    {time} (
                    {new Date(`2000-01-01T${time}`).toLocaleTimeString("en-US", {
                      hour: "numeric",
                      minute: "2-digit",
                      hour12: true,
                    })}
                    )
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Helicopter Cutoff Settings */}
        <div className={cn('bg-white', 'rounded-2xl', 'shadow-lg', 'p-8', 'mb-6')}>
          <div className={cn('flex', 'items-center', 'gap-3', 'mb-6')}>
            <div className={cn('w-12', 'h-12', 'bg-red-100', 'rounded-full', 'flex', 'items-center', 'justify-center')}>
              <FaClock className={cn('text-red-600', 'text-xl')} />
            </div>
            <div>
              <h2 className={cn('text-xl', 'font-bold', 'text-gray-800')}>🚁 Helicopter Booking Cutoff Time</h2>
              <p className={cn('text-sm', 'text-gray-500')}>Set the time when same-day helicopter bookings will be disabled</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className={cn('block', 'text-sm', 'font-medium', 'text-gray-700', 'mb-2')}>
                Helicopter Cutoff Time (IST - Asia/Kolkata)
              </label>
              <select
                value={helicopterCutoffTime}
                onChange={(e) => setHelicopterCutoffTime(e.target.value)}
                className={cn('w-full', 'px-4', 'py-3', 'border', 'border-gray-300', 'rounded-lg', 'focus:ring-2', 'focus:ring-red-500', 'focus:border-red-500', 'text-lg')}
              >
                {timeOptions.map((time) => (
                  <option key={time} value={time}>
                    {time} (
                    {new Date(`2000-01-01T${time}`).toLocaleTimeString("en-US", {
                      hour: "numeric",
                      minute: "2-digit",
                      hour12: true,
                    })}
                    )
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Helicopter Weight Pricing */}
        <div className={cn('bg-white', 'rounded-2xl', 'shadow-lg', 'p-8', 'mb-6')}>
          <div className={cn('flex', 'items-center', 'gap-3', 'mb-6')}>
            <div className={cn('w-12', 'h-12', 'bg-orange-100', 'rounded-full', 'flex', 'items-center', 'justify-center')}>
              <FaInfoCircle className={cn('text-orange-600', 'text-xl')} />
            </div>
            <div>
              <h2 className={cn('text-xl', 'font-bold', 'text-gray-800')}>⚖️ Helicopter Weight Policy</h2>
              <p className={cn('text-sm', 'text-gray-500')}>Configure weight limits and pricing for helicopter bookings</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className={cn('grid', 'md:grid-cols-2', 'gap-4')}>
              <div>
                <label className={cn('block', 'text-sm', 'font-medium', 'text-gray-700', 'mb-2')}>
                  Free Weight Limit (kg)
                </label>
                <input
                  type="number"
                  min="0"
                  max="200"
                  value={helicopterFreeWeightLimit}
                  onChange={(e) => setHelicopterFreeWeightLimit(parseFloat(e.target.value))}
                  className={cn('w-full', 'px-4', 'py-3', 'border', 'border-gray-300', 'rounded-lg', 'focus:ring-2', 'focus:ring-orange-500', 'focus:border-orange-500', 'text-lg')}
                />
              </div>
              <div>
                <label className={cn('block', 'text-sm', 'font-medium', 'text-gray-700', 'mb-2')}>
                  Price Per Extra Kg (₹)
                </label>
                <input
                  type="number"
                  min="0"
                  step="50"
                  value={helicopterWeightPricePerKg}
                  onChange={(e) => setHelicopterWeightPricePerKg(parseFloat(e.target.value))}
                  className={cn('w-full', 'px-4', 'py-3', 'border', 'border-gray-300', 'rounded-lg', 'focus:ring-2', 'focus:ring-orange-500', 'focus:border-orange-500', 'text-lg')}
                />
              </div>
            </div>

            <div className={cn('bg-orange-50', 'border', 'border-orange-200', 'rounded-lg', 'p-4')}>
              <div className={cn('flex', 'gap-3')}>
                <FaInfoCircle className={cn('text-orange-600', 'text-xl', 'flex-shrink-0', 'mt-0.5')} />
                <div className={cn('text-sm', 'text-gray-700')}>
                  <p className={cn('font-medium', 'mb-2')}>Example:</p>
                  <p>
                    With <strong>{helicopterFreeWeightLimit}kg</strong> free limit and <strong>₹{helicopterWeightPricePerKg}/kg</strong> charge:
                  </p>
                  <ul className={cn('list-disc', 'list-inside', 'mt-2', 'space-y-1')}>
                    <li>Passenger weighing 70kg: No extra charge</li>
                    <li>Passenger weighing {helicopterFreeWeightLimit + 5}kg: ₹{helicopterWeightPricePerKg * 5} extra charge</li>
                    <li>Passenger weighing {helicopterFreeWeightLimit + 10}kg: ₹{helicopterWeightPricePerKg * 10} extra charge</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Flight Advance Booking Cutoff */}
        <div className={cn('bg-white', 'rounded-2xl', 'shadow-lg', 'p-8', 'mb-6')}>
          <div className={cn('flex', 'items-center', 'gap-3', 'mb-6')}>
            <div className={cn('w-12', 'h-12', 'bg-blue-100', 'rounded-full', 'flex', 'items-center', 'justify-center')}>
              <FaInfoCircle className={cn('text-blue-600', 'text-xl')} />
            </div>
            <div>
              <h2 className={cn('text-xl', 'font-bold', 'text-gray-800')}>✈️ Flight Advance Booking Cutoff</h2>
              <p className={cn('text-sm', 'text-gray-500')}>Disable flight bookings X days before departure date</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className={cn('block', 'text-sm', 'font-medium', 'text-gray-700', 'mb-2')}>
                Days Before Flight Departure
              </label>
              <select
                value={flightAdvanceBookingDays}
                onChange={(e) => setFlightAdvanceBookingDays(parseInt(e.target.value))}
                className={cn('w-full', 'px-4', 'py-3', 'border', 'border-gray-300', 'rounded-lg', 'focus:ring-2', 'focus:ring-blue-500', 'focus:border-blue-500', 'text-lg')}
              >
                <option value={0}>0 - Same day only (default)</option>
                <option value={1}>1 - Disable 1 day before</option>
                <option value={2}>2 - Disable 2 days before</option>
                <option value={3}>3 - Disable 3 days before</option>
                <option value={5}>5 - Disable 5 days before</option>
                <option value={7}>7 - Disable 1 week before</option>
                <option value={14}>14 - Disable 2 weeks before</option>
                <option value={30}>30 - Disable 1 month before</option>
              </select>
            </div>

            <div className={cn('bg-blue-50', 'border', 'border-blue-200', 'rounded-lg', 'p-4')}>
              <div className={cn('flex', 'gap-3')}>
                <FaInfoCircle className={cn('text-blue-600', 'text-xl', 'flex-shrink-0', 'mt-0.5')} />
                <div className={cn('text-sm', 'text-gray-700')}>
                  <p className={cn('font-medium', 'mb-2')}>Example:</p>
                  {flightAdvanceBookingDays === 0 ? (
                    <p>
                      With <strong>0 days</strong>, flight bookings are only disabled on the departure date after the cutoff time.
                    </p>
                  ) : (
                    <p>
                      With <strong>{flightAdvanceBookingDays} day(s)</strong>, if a flight departs on <strong>Dec 10</strong>, 
                      bookings will be disabled starting <strong>Dec {10 - flightAdvanceBookingDays}</strong> at the cutoff time.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Helicopter Advance Booking Cutoff */}
        <div className={cn('bg-white', 'rounded-2xl', 'shadow-lg', 'p-8', 'mb-6')}>
          <div className={cn('flex', 'items-center', 'gap-3', 'mb-6')}>
            <div className={cn('w-12', 'h-12', 'bg-red-100', 'rounded-full', 'flex', 'items-center', 'justify-center')}>
              <FaInfoCircle className={cn('text-red-600', 'text-xl')} />
            </div>
            <div>
              <h2 className={cn('text-xl', 'font-bold', 'text-gray-800')}>🚁 Helicopter Advance Booking Cutoff</h2>
              <p className={cn('text-sm', 'text-gray-500')}>Disable helicopter bookings X days before departure date</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className={cn('block', 'text-sm', 'font-medium', 'text-gray-700', 'mb-2')}>
                Days Before Helicopter Departure
              </label>
              <select
                value={helicopterAdvanceBookingDays}
                onChange={(e) => setHelicopterAdvanceBookingDays(parseInt(e.target.value))}
                className={cn('w-full', 'px-4', 'py-3', 'border', 'border-gray-300', 'rounded-lg', 'focus:ring-2', 'focus:ring-red-500', 'focus:border-red-500', 'text-lg')}
              >
                <option value={0}>0 - Same day only (default)</option>
                <option value={1}>1 - Disable 1 day before</option>
                <option value={2}>2 - Disable 2 days before</option>
                <option value={3}>3 - Disable 3 days before</option>
                <option value={5}>5 - Disable 5 days before</option>
                <option value={7}>7 - Disable 1 week before</option>
                <option value={14}>14 - Disable 2 weeks before</option>
                <option value={30}>30 - Disable 1 month before</option>
              </select>
            </div>

            <div className={cn('bg-red-50', 'border', 'border-red-200', 'rounded-lg', 'p-4')}>
              <div className={cn('flex', 'gap-3')}>
                <FaInfoCircle className={cn('text-red-600', 'text-xl', 'flex-shrink-0', 'mt-0.5')} />
                <div className={cn('text-sm', 'text-gray-700')}>
                  <p className={cn('font-medium', 'mb-2')}>Example:</p>
                  {helicopterAdvanceBookingDays === 0 ? (
                    <p>
                      With <strong>0 days</strong>, helicopter bookings are only disabled on the departure date after the cutoff time.
                    </p>
                  ) : (
                    <p>
                      With <strong>{helicopterAdvanceBookingDays} day(s)</strong>, if a helicopter departs on <strong>Dec 10</strong>, 
                      bookings will be disabled starting <strong>Dec {10 - helicopterAdvanceBookingDays}</strong> at the cutoff time.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Info Box */}
        <div className={cn('bg-blue-50', 'border', 'border-blue-200', 'rounded-lg', 'p-6', 'mb-6')}>
          <div className={cn('flex', 'gap-3')}>
            <FaInfoCircle className={cn('text-blue-600', 'text-xl', 'flex-shrink-0', 'mt-0.5')} />
            <div className={cn('text-sm', 'text-gray-700')}>
              <p className={cn('font-medium', 'mb-2')}>How it works:</p>
              <ul className={cn('list-disc', 'list-inside', 'space-y-1')}>
                <li>
                  <strong>Flight bookings</strong> disabled after <strong>{flightCutoffTime}</strong> IST
                </li>
                <li>
                  <strong>Helicopter bookings</strong> disabled after <strong>{helicopterCutoffTime}</strong> IST
                </li>
                <li>
                  Flight cutoff: {flightAdvanceBookingDays === 0 ? (
                    <>applies only on <strong>departure date</strong></>
                  ) : (
                    <>starts <strong>{flightAdvanceBookingDays} day(s) before</strong> departure</>
                  )}
                </li>
                <li>
                  Helicopter cutoff: {helicopterAdvanceBookingDays === 0 ? (
                    <>applies only on <strong>departure date</strong></>
                  ) : (
                    <>starts <strong>{helicopterAdvanceBookingDays} day(s) before</strong> departure</>
                  )}
                </li>
                <li>The system checks this every minute automatically</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <button
          onClick={handleSave}
          disabled={saving}
          className={cn('w-full', 'py-4', 'px-6', 'bg-gradient-to-r', 'from-blue-600', 'to-indigo-600', 'text-white', 'rounded-lg', 'font-semibold', 'text-lg', 'hover:from-blue-700', 'hover:to-indigo-700', 'disabled:opacity-50', 'disabled:cursor-not-allowed', 'transition-all', 'duration-200', 'flex', 'items-center', 'justify-center', 'gap-2', 'shadow-lg', 'hover:shadow-xl')}
        >
          <FaSave />
          {saving ? "Saving..." : "Save All Changes"}
        </button>

        {/* Example Preview Card */}
        <div className={cn('bg-gradient-to-r', 'from-yellow-50', 'to-orange-50', 'border', 'border-yellow-200', 'rounded-2xl', 'p-6', 'mt-6')}>
          <h3 className={cn('text-lg', 'font-bold', 'text-gray-800', 'mb-3')}>Preview Example</h3>
          <div className={cn('space-y-3', 'text-sm', 'text-gray-700')}>
            <div>
              <p className={cn('font-semibold', 'mb-1')}>✈️ Flights:</p>
              <p>
                ✅ <strong>Before {flightCutoffTime} IST:</strong> Users can book
              </p>
              <p>
                ❌ <strong>After {flightCutoffTime} IST:</strong> Booking disabled
              </p>
            </div>
            <div>
              <p className={cn('font-semibold', 'mb-1')}>🚁 Helicopters:</p>
              <p>
                ✅ <strong>Before {helicopterCutoffTime} IST:</strong> Users can book
              </p>
              <p>
                ❌ <strong>After {helicopterCutoffTime} IST:</strong> Booking disabled
              </p>
            </div>
            {(flightAdvanceBookingDays > 0 || helicopterAdvanceBookingDays > 0) && (
              <div className={cn('pt-2', 'border-t', 'border-yellow-300')}>
                <p className={cn('font-semibold', 'mb-1')}>📅 Advance Cutoff:</p>
                {flightAdvanceBookingDays > 0 && (
                  <p>
                    ✈️ Flight bookings stop <strong>{flightAdvanceBookingDays} day(s)</strong> before departure
                  </p>
                )}
                {helicopterAdvanceBookingDays > 0 && (
                  <p>
                    🚁 Helicopter bookings stop <strong>{helicopterAdvanceBookingDays} day(s)</strong> before departure
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingSettingsPage;
