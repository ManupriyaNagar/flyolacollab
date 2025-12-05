"use client";

import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

// Custom Calendar component
const CustomCalendar = ({ selectedDate, setSelectedDate }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date(selectedDate));

  const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const firstDayOfMonth = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth(),
    1
  );
  const lastDayOfMonth = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth() + 1,
    0
  );
  const startingDay =
    firstDayOfMonth.getDay() === 0 ? 6 : firstDayOfMonth.getDay() - 1;
  const totalDays = lastDayOfMonth.getDate();
  const today = new Date();
  const todayStr = `${today.getFullYear()}-${String(
    today.getMonth() + 1
  ).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

  const calendarDays = [];
  for (let i = 0; i < startingDay; i++) {
    calendarDays.push(<div key={`empty-${i}`} className="p-3" />);
  }

  for (let day = 1; day <= totalDays; day++) {
    const dateStr = `${currentMonth.getFullYear()}-${String(
      currentMonth.getMonth() + 1
    ).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    const isSelected = dateStr === selectedDate;
    const isToday = dateStr === todayStr;
    const isPast = new Date(dateStr) < new Date(todayStr);

    calendarDays.push(
      <div
        key={day}
        onClick={() => !isPast && setSelectedDate(dateStr)}
        className={`px-2 py-6 text-center  cursor-pointer rounded-md transition-all duration-200 transform hover:scale-105 ${
          isPast
            ? "text-gray-300 cursor-not-allowed"
            : isSelected
            ? "bg-gradient-to-r from-blue-500 to-indigo-500 text-white  "
            : isToday
            ? "bg-gradient-to-r from-yellow-400 to-orange-400 text-white font-bold shadow-md"
            : "hover:bg-blue-50 hover:text-blue-600 border border-transparent hover:border-blue-200"
        }`}
      >
        <div className="font-semibold">{day}</div>
        {isToday && <div className="text-xs">Today</div>}
      </div>
    );
  }

  const goToPreviousMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1)
    );
  };

  const goToNextMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1)
    );
  };

  const goToToday = () => {
    const today = new Date();
    const newTodayStr = `${today.getFullYear()}-${String(
      today.getMonth() + 1
    ).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
    setCurrentMonth(new Date(today.getFullYear(), today.getMonth(), 1));
    setSelectedDate(newTodayStr);
  };

  return (
    <div className={cn('bg-white',  'p-6', 'py-20', '', 'border', 'border-gray-100')}>
      <div className={cn('flex', 'flex-col', 'sm:flex-row', 'justify-between', 'items-center', 'mb-6', 'gap-6')}>
        <div className={cn('text-2xl', 'font-bold', 'text-gray-900', 'flex', 'items-center', 'gap-2')}>
          📅{" "}
          {currentMonth.toLocaleString("default", {
            month: "long",
            year: "numeric",
          })}
        </div>

        <div className={cn('flex', 'space-x-2')}>
          <button
            onClick={goToPreviousMonth}
            className={cn('px-4', 'py-2', 'bg-gradient-to-r', 'from-blue-500', 'to-indigo-500', 'text-white', 'rounded-xl', 'hover:from-blue-600', 'hover:to-indigo-600', 'transition-all', 'duration-200', 'transform', 'hover:scale-105', 'shadow-md')}
          >
            ← Prev
          </button>
          <button
            onClick={goToToday}
            className={cn('px-4', 'py-2', 'bg-gradient-to-r', 'from-yellow-400', 'to-orange-400', 'text-white', 'rounded-xl', 'hover:from-yellow-500', 'hover:to-orange-500', 'transition-all', 'duration-200', 'transform', 'hover:scale-105', 'shadow-md', 'font-semibold')}
          >
            Today ✨
          </button>
          <button
            onClick={goToNextMonth}
            className={cn('px-4', 'py-2', 'bg-gradient-to-r', 'from-blue-500', 'to-indigo-500', 'text-white', 'rounded-xl', 'hover:from-blue-600', 'hover:to-indigo-600', 'transition-all', 'duration-200', 'transform', 'hover:scale-105', 'shadow-md')}
          >
            Next →
          </button>
        </div>
      </div>

      <div className={cn('grid', 'grid-cols-7', 'gap-2')}>
        {daysOfWeek.map((day) => (
          <div
            key={day}
            className={cn('p-3', 'text-center', 'font-bold', 'text-gray-600', 'text-sm')}
          >
            {day}
          </div>
        ))}
        {calendarDays}
      </div>

      <div className={cn('mt-4', 'flex', 'justify-center', 'gap-4', 'text-xs')}>
        <div className={cn('flex', 'items-center', 'gap-2')}>
          <div className={cn('w-3', 'h-3', 'bg-gradient-to-r', 'from-yellow-400', 'to-orange-400', 'rounded-full')} />
          <span className="text-gray-600">Today</span>
        </div>
        <div className={cn('flex', 'items-center', 'gap-2')}>
          <div className={cn('w-3', 'h-3', 'bg-gradient-to-r', 'from-blue-500', 'to-indigo-500', 'rounded-full')} />
          <span className="text-gray-600">Selected</span>
        </div>
        <div className={cn('flex', 'items-center', 'gap-2')}>
          <div className={cn('w-3', 'h-3', 'bg-gray-300', 'rounded-full')} />
          <span className="text-gray-600">Past</span>
        </div>
      </div>
    </div>
  );
};

// Time Slots component
const TimeSlots = ({ availableSlots, selectedSlot, handleSlotSelect, selectedDate }) => {
  const getSlotIcon = (time) => {
    const hour = parseInt(time.split(":")[0]);
    if (hour >= 16 && hour < 17) return "🌅"; // Early evening
    if (hour >= 17 && hour < 18) return "🌇"; // Sunset
    return "🌆"; // Evening
  };

  const getSlotDescription = (time) => {
    const hour = parseInt(time.split(":")[0]);
    if (hour >= 16 && hour < 17) return "Golden Hour Flight";
    if (hour >= 17 && hour < 18) return "Sunset Special";
    return "Evening Adventure";
  };

  return (
    <div className={cn('bg-white', 'rounded-2xl', 'p-6', '', 'border', 'border-gray-100')}>
      <div className={cn('flex', 'items-center', 'gap-3', 'mb-6')}>
        <div className="text-2xl">🕐</div>
        <h2 className={cn('text-2xl', 'font-bold', 'text-gray-900')}>Available Time Slots</h2>
      </div>

      <div className={cn('mb-4', 'p-4', 'bg-gradient-to-r', 'from-blue-50', 'to-indigo-50', 'rounded-xl', 'border', 'border-blue-100')}>
        <div className={cn('flex', 'items-center', 'gap-2', 'mb-2')}>
          <span className="text-lg">📅</span>
          <span className={cn('font-semibold', 'text-gray-900')}>Selected Date:</span>
        </div>
        <div className={cn('text-lg', 'font-bold', 'text-blue-600')}>
          {new Date(selectedDate).toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </div>
      </div>

      {availableSlots.length > 0 ? (
        <div className={cn('grid', 'grid-cols-1', 'sm:grid-cols-2', 'lg:grid-cols-3', 'gap-4')}>
          {availableSlots.map((slot, index) => {
            const isSelected =
              selectedSlot?.time === slot.time &&
              selectedSlot?.date === slot.date;
            const isAvailable = slot.seats > 0;

            return (
              <button
                key={index}
                onClick={() => isAvailable && handleSlotSelect(slot)}
                disabled={!isAvailable}
                className={`p-6 rounded-2xl text-left transition-all duration-300 transform ${
                  isSelected
                    ? "bg-gradient-to-r from-blue-600 to-indigo-500 text-white  scale-105 border-2 border-blue-300"
                    : !isAvailable
                    ? "bg-gray-100 cursor-not-allowed opacity-60 border border-gray-200"
                    : "bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 border border-blue-200 hover:border-blue-300 hover: hover:scale-102 hover:-translate-y-1"
                }`}
              >
                <div className={cn('flex', 'items-center', 'gap-3', 'mb-3')}>
                  <div className="text-2xl">{getSlotIcon(slot.time)}</div>
                  <div>
                    <div
                      className={`text-lg font-bold ${
                        isSelected ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {slot.time}
                    </div>
                    <div
                      className={`text-sm ${
                        isSelected ? "text-blue-100" : "text-gray-600"
                      }`}
                    >
                      {getSlotDescription(slot.time)}
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  {/* Route Information */}
                  {slot.startHelipad && slot.stopHelipad && (
                    <div
                      className={`flex items-center gap-2 ${
                        isSelected ? "text-white" : "text-gray-700"
                      }`}
                    >
                      <span className="text-sm">🚁</span>
                      <span className={cn('text-sm', 'font-medium')}>
                        {slot.startHelipad.helipad_name} →{" "}
                        {slot.stopHelipad.helipad_name}
                      </span>
                    </div>
                  )}

                  {/* Departure & Arrival Times */}
                  <div
                    className={`flex items-center gap-2 ${
                      isSelected ? "text-white" : "text-gray-700"
                    }`}
                  >
                    <span className="text-sm">🛫</span>
                    <span className={cn('text-sm', 'font-medium')}>
                      Depart: {slot.time}
                    </span>
                  </div>

                  {slot.arrivalTime && (
                    <div
                      className={`flex items-center gap-2 ${
                        isSelected ? "text-white" : "text-gray-700"
                      }`}
                    >
                      <span className="text-sm">🛬</span>
                      <span className={cn('text-sm', 'font-medium')}>
                        Arrive: {slot.arrivalTime}
                      </span>
                    </div>
                  )}

                  <div
                    className={`flex items-center gap-2 ${
                      isSelected ? "text-white" : "text-gray-700"
                    }`}
                  >
                    <span className="text-sm">👥</span>
                    <span className={cn('text-sm', 'font-medium')}>
                      {slot.seats} seat{slot.seats !== 1 ? "s" : ""} available
                    </span>
                  </div>

                  <div
                    className={`flex items-center gap-2 ${
                      isSelected ? "text-white" : "text-gray-700"
                    }`}
                  >
                    <span className="text-sm">💰</span>
                    <span className={cn('text-sm', 'font-medium')}>
                      ₹{slot.price.toLocaleString("en-IN")} per person
                    </span>
                  </div>

                  {!isAvailable && (
                    <div className={cn('flex', 'items-center', 'gap-2', 'text-red-500')}>
                      <span className="text-sm">❌</span>
                      <span className={cn('text-sm', 'font-medium')}>Fully Booked</span>
                    </div>
                  )}

                  {isSelected && (
                    <div className={cn('flex', 'items-center', 'gap-2', 'text-white', 'mt-3')}>
                      <span className="text-sm">✅</span>
                      <span className={cn('text-sm', 'font-bold')}>Selected!</span>
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      ) : (
        <div className={cn('text-center', 'py-12')}>
          <div className={cn('text-6xl', 'mb-4')}>😔</div>
          <h3 className={cn('text-xl', 'font-bold', 'text-gray-900', 'mb-2')}>
            No Flights Available
          </h3>
          <p className={cn('text-gray-600', 'mb-4')}>
            Sorry, no time slots are available for this date.
          </p>
          <p className={cn('text-sm', 'text-gray-500')}>
            Please try selecting a different date to see available flights.
          </p>
        </div>
      )}

      {availableSlots.length > 0 && (
        <div className={cn('mt-6', 'p-4', 'bg-gradient-to-r', 'from-yellow-50', 'to-orange-50', 'rounded-xl', 'border', 'border-yellow-200')}>
          <div className={cn('flex', 'items-start', 'gap-3')}>
            <div className="text-xl">💡</div>
            <div>
              <h4 className={cn('font-bold', 'text-yellow-800', 'mb-1')}>
                Pro Tips for Your Flight:
              </h4>
              <ul className={cn('text-sm', 'text-yellow-700', 'space-y-1')}>
                <li>• Golden hour flights (4-5 PM) offer the best lighting for photos</li>
                <li>• Sunset flights (5-6 PM) provide romantic and scenic views</li>
                <li>• Book early to secure your preferred time slot</li>
                <li>• Weather conditions may affect flight schedules</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Main Calendar and Slots component
const CalendarAndSlots = ({ onSlotSelect }) => {
  const today = new Date();
  const todayStr = `${today.getFullYear()}-${String(
    today.getMonth() + 1
  ).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

  const [selectedDate, setSelectedDate] = useState(todayStr);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchSchedulesForDate = async () => {
      setLoading(true);
      setError("");
      try {
        const date = new Date(selectedDate);
        const dayOfWeek = date.toLocaleDateString("en-US", {
          weekday: "long",
        });

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/joyride-schedules?day=${dayOfWeek}&status=1`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch schedules");
        }
        const schedules = await response.json();

        const slots = schedules.map((schedule) => ({
          id: schedule.id,
          date: selectedDate,
          time: schedule.departure_time.substring(0, 5),
          arrivalTime: schedule.arrival_time
            ? schedule.arrival_time.substring(0, 5)
            : null,
          seats: schedule.seat_limit,
          price: parseFloat(schedule.price),
          scheduleId: schedule.id,
          startHelipadId: schedule.start_helipad_id,
          stopHelipadId: schedule.stop_helipad_id,
          departureDay: schedule.departure_day,
          startHelipad: schedule.startHelipad,
          stopHelipad: schedule.stopHelipad,
        }));

        setAvailableSlots(slots);
      } catch (err) {
        console.error("Error fetching schedules:", err);
        setError("Error fetching available flights");
      } finally {
        setLoading(false);
      }
    };

    fetchSchedulesForDate();
  }, [selectedDate]);

  const handleSlotSelect = (slot) => {
    setSelectedSlot(slot);
    onSlotSelect(slot);
  };

  function getSlotDescription(time) {
    const hour = parseInt(time.split(":")[0]);
    if (hour >= 16 && hour < 17) return "Golden Hour Flight";
    if (hour >= 17 && hour < 18) return "Sunset Special";
    return "Evening Adventure";
  }

  return (
    <div className="space-y-8">
 

      {/* Error Display */}
      {error && (
        <div className={cn('bg-red-50', 'border', 'border-red-200', 'rounded-2xl', 'p-6', 'text-center')}>
          <div className={cn('text-3xl', 'mb-2')}>⚠️</div>
          <h3 className={cn('text-lg', 'font-bold', 'text-red-800', 'mb-2')}>
            Oops! Something went wrong
          </h3>
          <p className="text-red-600">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className={cn('mt-4', 'px-6', 'py-2', 'bg-red-600', 'text-white', 'rounded-xl', 'hover:bg-red-700', 'transition-colors', 'duration-200')}
          >
            Try Again
          </button>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className={cn('text-center', 'py-12')}>
          <div className={cn('inline-block', 'animate-spin', 'rounded-full', 'h-12', 'w-12', 'border-b-2', 'border-blue-600', 'mb-4')} />
          <p className={cn('text-gray-600', 'font-medium')}>
            🔍 Finding available flight slots for you...
          </p>
        </div>
      )}

      {/* Calendar Section */}
      {!loading && (
        <div>
          <div className={cn('text-center', 'mb-6')}>
           

          </div>
          <CustomCalendar
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
          />
        </div>
      )}

      {/* Time Slots Section */}
      {!loading && (
        <TimeSlots
          availableSlots={availableSlots}
          selectedSlot={selectedSlot}
          handleSlotSelect={handleSlotSelect}
          selectedDate={selectedDate}
        />
      )}

      {/* Selected Slot Confirmation */}
      {selectedSlot && (
        <div className={cn('bg-gradient-to-r', 'from-green-50', 'to-emerald-50', 'border', 'border-green-200', 'rounded-2xl', 'p-6', 'text-center')}>
          <div className={cn('text-3xl', 'mb-3')}>🎉</div>
          <h3 className={cn('text-xl', 'font-bold', 'text-green-800', 'mb-2')}>
            Perfect Choice! Your Flight is Selected
          </h3>
          <div className="text-green-700">
            <p className="font-semibold">
              📅{" "}
              {new Date(selectedSlot.date).toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
            <p className="font-semibold">
              🕐 {selectedSlot.time} - {getSlotDescription(selectedSlot.time)}
            </p>
            <p className="font-semibold">
              💰 ₹{selectedSlot.price.toLocaleString("en-IN")} per person
            </p>
          </div>
          <p className={cn('text-sm', 'text-green-600', 'mt-3')}>
            Ready to proceed with passenger details! 🚁✨
          </p>
        </div>
      )}
    </div>
  );
};

export default CalendarAndSlots;
