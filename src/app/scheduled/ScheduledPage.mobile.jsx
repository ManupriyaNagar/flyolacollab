"use client";

import { useAuth } from "@/components/AuthContext";
import API from "@/services/api";
import { useEffect, useState } from "react";

const tz = "Asia/Kolkata";

// Date formatting helpers
const fmtIso = (d) =>
  d.toLocaleDateString("sv-SE", { timeZone: tz });

const fmtTime = (t) => {
  if (!t) return "N/A";
  if (/^\d{6}$/.test(t)) {
    return `${t.slice(0, 2)}:${t.slice(2, 4)}`;
  }
  if (/^\d{2}:\d{2}:\d{2}$/.test(t)) {
    return t.slice(0, 5);
  }

  try {
    const date = new Date(`1970-01-01 ${t}`);
    return date.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
      timeZone: tz,
    });
  } catch {
    return "N/A";
  }
};

export default function ScheduledPageMobile() {
  const { authState } = useAuth();
  const [flightSchedules, setFlightSchedules] = useState([]);
  const [flights, setFlights] = useState([]);
  const [airports, setAirports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dates, setDates] = useState([]);

  // Generate 7 days starting from December 12th to include existing schedules
  const generateDates = () => {
    const dateArray = [];
    
    // Start from tomorrow and show next 7 days
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(tomorrow);
      date.setDate(tomorrow.getDate() + i);
      
      const dateStr = fmtIso(date);
      
      dateArray.push({
        date: dateStr,
        day: date.toLocaleDateString("en-US", { weekday: "long", timeZone: tz }),
        dayShort: date.toLocaleDateString("en-US", { weekday: "short", timeZone: tz }),
        dateFormatted: date.toLocaleDateString("en-IN", { 
          day: "numeric", 
          month: "short", 
          timeZone: tz 
        })
      });
    }
    
    return dateArray;
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      // Dynamically determine which months to fetch based on current date
      const today = new Date();
      const tomorrow = new Date(today);
      tomorrow.setDate(today.getDate() + 1);
      
      // Get the month for tomorrow and the month 7 days from tomorrow
      const endOfWeek = new Date(tomorrow);
      endOfWeek.setDate(tomorrow.getDate() + 7);
      
      // Generate unique months to fetch
      const monthsToFetch = new Set();
      const formatMonth = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        return `${year}-${month}`;
      };
      
      monthsToFetch.add(formatMonth(tomorrow));
      monthsToFetch.add(formatMonth(endOfWeek));
      
      const months = Array.from(monthsToFetch);
      
      const schedulePromises = months.map(month => 
        API.flights.getFlightSchedules({ user: true, month }).catch(() => [])
      );
      
      const [flightsRes, airportsRes, ...schedulesResults] = await Promise.all([
        API.flights.getFlights({ user: true }).catch(() => []),
        API.airports.getAirports().catch(() => []),
        ...schedulePromises
      ]);

      // Combine all schedules from all months
      const allSchedules = schedulesResults.flat().filter(schedule => Array.isArray(schedule) ? schedule : [schedule]).flat();
      
      // Filter schedules to only include dates from tomorrow onwards
      const tomorrowStr = fmtIso(tomorrow);
      const endOfWeekStr = fmtIso(endOfWeek);
      
      const filteredSchedules = allSchedules.filter(schedule => {
        if (!schedule.departure_date) return false;
        return schedule.departure_date >= tomorrowStr && schedule.departure_date <= endOfWeekStr;
      });

      // Normalize the filtered schedules
      const normalized = Array.isArray(filteredSchedules)
        ? filteredSchedules.map((schedule) => ({
            ...schedule,
            departure_date: schedule.departure_date
              ? new Date(schedule.departure_date)
                  .toLocaleDateString("en-CA", {
                    timeZone: tz,
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                  })
              : null,
            availableSeats: schedule.availableSeats ?? 0,
          }))
        : [];

      setFlightSchedules(normalized);
      setFlights(Array.isArray(flightsRes) ? flightsRes : []);
      setAirports(Array.isArray(airportsRes) ? airportsRes : []);
    } catch (err) {
      console.error("Error fetching data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Always generate fixed 7-day range
    setDates(generateDates());
    fetchData();
  }, []);

  // Group flights by date
  const getFlightsByDate = (targetDate) => {
    const filtered = flightSchedules.filter(schedule => {
      const scheduleDate = schedule.departure_date;
      const flight = flights.find(f => f.id === schedule.flight_id) || {};
      
      // More lenient status check - include if status is undefined, 0, or 1
      const flightActive = !flight.status || flight.status === 0 || flight.status === 1;
      const scheduleActive = !schedule.status || schedule.status === 0 || schedule.status === 1;
      
      const dateMatch = scheduleDate === targetDate;
      const isActive = flightActive && scheduleActive;
      
      return dateMatch && isActive;
    });

    return filtered
      .map(schedule => {
        const flight = flights.find(f => f.id === schedule.flight_id) || {};
        const depAirport = airports.find(a => a.id === schedule.departure_airport_id) || { city: "Unknown", airport_code: "UNK" };
        const arrAirport = airports.find(a => a.id === schedule.arrival_airport_id) || { city: "Unknown", airport_code: "UNK" };
        
        return {
          ...schedule,
          flight_number: flight.flight_number || "Unknown",
          departureAirport: depAirport,
          arrivalAirport: arrAirport,
          seat_limit: flight.seat_limit || 6
        };
      })
      .sort((a, b) => {
        const timeA = new Date(`1970-01-01T${a.departure_time}:00Z`);
        const timeB = new Date(`1970-01-01T${b.departure_time}:00Z`);
        return timeA - timeB;
      });
  };

  const MobileChartHeader = () => (
    <div className="grid grid-cols-[180px_1fr_1fr_1fr] gap-2 text-xs font-semibold text-gray-600 pb-2 border-b">
      <div>Flight</div>
      <div>Route</div>
      <div>Time</div>
      <div>Price</div>
    </div>
  );

const MobileFlightRow = ({ schedule }) => (
  <div
    className="
      grid
      grid-cols-[180px_1fr_1fr_1fr]
      gap-2
      text-sm
      py-2
      border-b
      last:border-b-0
    "
  >
    <div className="font-medium text-blue-600 truncate">
      {schedule.flight_number}
    </div>

    <div className="text-gray-700 whitespace-nowrap">
      {schedule.departureAirport.airport_code} → {schedule.arrivalAirport.airport_code}
    </div>

    <div className="text-gray-700 whitespace-nowrap">
      {fmtTime(schedule.departure_time)}
    </div>

    <div className="font-semibold text-green-600 whitespace-nowrap">
      ₹{parseFloat(schedule.price || 0).toLocaleString("en-IN")}
    </div>
  </div>
);

  const SkeletonRow = () => (
    <div className="grid grid-cols-[180px_1fr_1fr_1fr] gap-2 text-sm py-2 border-b animate-pulse">
      <div className="h-4 bg-gray-300 rounded w-20"></div>
      <div className="h-4 bg-gray-300 rounded w-16"></div>
      <div className="h-4 bg-gray-300 rounded w-12"></div>
      <div className="h-4 bg-gray-300 rounded w-16"></div>
    </div>
  );

  const SkeletonTable = () => (
    <div className="overflow-x-auto">
      <div className="min-w-[520px] bg-white rounded-lg shadow-sm p-3">
        <MobileChartHeader />
        <SkeletonRow />
        <SkeletonRow />
        <SkeletonRow />
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 px-4 py-4">
        <h1 className="text-xl font-bold mb-4">
          Weekly Flight Schedule
        </h1>
        
        {/* Show skeleton for 7 days */}
        {[1, 2, 3, 4, 5, 6, 7].map((day) => (
          <div key={day} className="mb-6">
            <div className="h-6 bg-gray-300 rounded w-48 mb-2 animate-pulse"></div>
            <SkeletonTable />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-4">
      <div className="mb-4 bg-blue-700 p-2 text-white rounded-sm"  >
      <h1 className="text-xl font-bold ">
        Weekly Flight Schedule
      </h1>
      </div>

    {dates.map((dateInfo) => {
  const dayFlights = getFlightsByDate(dateInfo.date);

  return (
    <div key={dateInfo.date} className="mb-6">
      <h2 className="font-semibold text-gray-800 mb-2">
        {dateInfo.day}, {dateInfo.dateFormatted}
      </h2>

      {dayFlights.length > 0 ? (
       <div className="overflow-x-auto">
  <div className="min-w-[520px] bg-white rounded-lg shadow-sm p-3">
    <MobileChartHeader />
    {dayFlights.map((schedule) => (
      <MobileFlightRow key={schedule.id} schedule={schedule} />
    ))}
  </div>
</div>
      ) : (
        <div className="bg-gray-100 rounded-lg p-4 text-center text-gray-500">
          No flights scheduled
        </div>
      )}
    </div>
  );
})}

    </div>
  );
}
