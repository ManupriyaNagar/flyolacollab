"use client";

import { useAuth } from "@/components/AuthContext";
import { cn } from "@/lib/utils";
import API from "@/services/api";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { FaCalendarAlt, FaClock, FaPlane } from "react-icons/fa";


const tz = "Asia/Kolkata";

// Use the same date formatting as the working page
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

const ScheduledPage = () => {
  const { authState } = useAuth();
  const [flightSchedules, setFlightSchedules] = useState([]);
  const [flights, setFlights] = useState([]);
  const [airports, setAirports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dates, setDates] = useState([]);

  // Generate 7 days starting from tomorrow
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

      // Normalize the filtered schedules exactly like the working page
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
    // Always generate fixed 7-day range from tomorrow
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

  const SkeletonCard = () => (
    <div className={cn('bg-white', 'rounded-lg', 'shadow-md', 'border', 'border-gray-200', 'p-4', 'animate-pulse')}>
      <div className={cn('flex', 'items-center', 'justify-between', 'mb-3')}>
        <div className={cn('flex', 'items-center', 'gap-2')}>
          <div className={cn('w-4', 'h-4', 'bg-gray-300', 'rounded')}></div>
          <div className={cn('h-4', 'bg-gray-300', 'rounded', 'w-16')}></div>
        </div>
        <div className={cn('h-6', 'bg-gray-300', 'rounded-full', 'w-16')}></div>
      </div>
      
      <div className="space-y-3">
        {/* Route Skeleton */}
        <div className={cn('flex', 'items-center', 'justify-between')}>
          <div className={cn('text-center', 'flex-1')}>
            <div className={cn('h-4', 'bg-gray-300', 'rounded', 'w-16', 'mx-auto', 'mb-1')}></div>
            <div className={cn('h-3', 'bg-gray-300', 'rounded', 'w-12', 'mx-auto')}></div>
          </div>
          
          <div className={cn('flex', 'items-center', 'px-3')}>
            <div className={cn('w-8', 'h-0.5', 'bg-gray-300')}></div>
            <div className={cn('w-3', 'h-3', 'bg-gray-300', 'rounded', 'mx-1')}></div>
            <div className={cn('w-8', 'h-0.5', 'bg-gray-300')}></div>
          </div>
          
          <div className={cn('text-center', 'flex-1')}>
            <div className={cn('h-4', 'bg-gray-300', 'rounded', 'w-16', 'mx-auto', 'mb-1')}></div>
            <div className={cn('h-3', 'bg-gray-300', 'rounded', 'w-12', 'mx-auto')}></div>
          </div>
        </div>
        
        {/* Times Skeleton */}
        <div className={cn('flex', 'items-center', 'justify-between')}>
          <div className={cn('flex', 'items-center', 'gap-1')}>
            <div className={cn('w-3', 'h-3', 'bg-gray-300', 'rounded')}></div>
            <div className={cn('h-4', 'bg-gray-300', 'rounded', 'w-12')}></div>
          </div>
          <div className={cn('flex', 'items-center', 'gap-1')}>
            <div className={cn('w-3', 'h-3', 'bg-gray-300', 'rounded')}></div>
            <div className={cn('h-4', 'bg-gray-300', 'rounded', 'w-12')}></div>
          </div>
        </div>
        
        {/* Price Skeleton */}
        <div className={cn('flex', 'items-center', 'justify-between', 'pt-2', 'border-t', 'border-gray-100')}>
          <div className={cn('h-3', 'bg-gray-300', 'rounded', 'w-20')}></div>
          <div className={cn('h-6', 'bg-gray-300', 'rounded', 'w-16')}></div>
        </div>
      </div>
    </div>
  );

  const FlightScheduleCard = ({ schedule }) => (
    <motion.div
      className={cn('bg-hite', 'rounded-lg', 'shadow-md', 'border', 'border-gray-200', 'p-4', 'hover:shadow-lg', 'transition-all', 'duration-300', 'hover:border-blue-300')}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
    >
      <div className={cn('flex', 'items-center', 'justify-between', 'mb-3')}>
        <div className={cn('flex', 'items-center', 'gap-2')}>
          <FaPlane className="text-blue-600" size={14} />
          <span className={cn('font-semibold', 'text-gray-800')}>{schedule.flight_number}</span>
        </div>
        <span className={cn('text-xs', 'bg-green-100', 'text-green-700', 'px-2', 'py-1', 'rounded-full')}>
          Available
        </span>
      </div>
      
      <div className="space-y-3">
        {/* Route */}
        <div className={cn('flex', 'items-center', 'justify-between')}>
          <div className={cn('text-center', 'flex-1')}>
            <div className={cn('text-sm', 'font-medium', 'text-gray-800')}>
              {schedule.departureAirport.city}
            </div>
            <div className={cn('text-xs', 'text-gray-500')}>
              ({schedule.departureAirport.airport_code})
            </div>
          </div>
          
          <div className={cn('flex', 'items-center', 'px-3')}>
            <div className={cn('w-8', 'h-0.5', 'bg-blue-300')}></div>
            <FaPlane className={cn('text-blue-500', 'mx-1')} size={12} />
            <div className={cn('w-8', 'h-0.5', 'bg-blue-300')}></div>
          </div>
          
          <div className={cn('text-center', 'flex-1')}>
            <div className={cn('text-sm', 'font-medium', 'text-gray-800')}>
              {schedule.arrivalAirport.city}
            </div>
            <div className={cn('text-xs', 'text-gray-500')}>
              ({schedule.arrivalAirport.airport_code})
            </div>
          </div>
        </div>
        
        {/* Times */}
        <div className={cn('flex', 'items-center', 'justify-between', 'text-sm')}>
          <div className={cn('flex', 'items-center', 'gap-1')}>
            <FaClock className="text-gray-400" size={12} />
            <span className="font-medium">{fmtTime(schedule.departure_time)}</span>
          </div>
          <div className={cn('flex', 'items-center', 'gap-1')}>
            <FaClock className="text-gray-400" size={12} />
            <span className="font-medium">{fmtTime(schedule.arrival_time)}</span>
          </div>
        </div>
        
        {/* Price */}
        <div className={cn('flex', 'items-center', 'justify-between', 'pt-2', 'border-t', 'border-gray-100')}>
          <span className={cn('text-xs', 'text-gray-500')}>Starting from</span>
          <span className={cn('text-lg', 'font-bold', 'text-green-600')}>
            ₹{parseFloat(schedule.price || 0).toLocaleString('en-IN')}
          </span>
        </div>
      </div>
    </motion.div>
  );



  return (
    <div className={cn('min-h-screen', 'bg-gray-50' , 'px-10')}>
      {/* Header */}
      <motion.header 
        className={cn('bg-gradient-to-r', 'from-blue-700', 'to-blue-800', 'shadow-sm ' , 'px-20' , 'rounded-md')}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className={cn('max-w-7xl', 'mx-auto', 'px-4', 'sm:px-6', 'py-8' , '')}>
          <div className="text-center">
            <motion.h1 
              className={cn('text-4xl', 'font-bold', 'text-white', 'mb-2')}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <FaCalendarAlt className={cn('inline', 'mr-3')} />
              Weekly Flight Schedule
            </motion.h1>
            <motion.p 
              className={cn('text-xl', 'text-blue-100')}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              Flight schedules for this week at a glance
            </motion.p>
          </div>
        </div>
      </motion.header>


   <motion.div 
          className={cn('mt-8', 'grid', 'grid-cols-1', 'md:grid-cols-3', 'gap-6')}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <div className={cn('bg-white', 'rounded-lg', 'shadow-md', 'p-6', 'text-center')}>
            <div className={cn('text-3xl', 'font-bold', 'text-blue-600', 'mb-2')}>
              {dates.reduce((total, dateInfo) => total + getFlightsByDate(dateInfo.date).length, 0)}
            </div>
            <div className="text-gray-600">Total Flights</div>
          </div>
          
          <div className={cn('bg-white', 'rounded-lg', 'shadow-md', 'p-6', 'text-center')}>
            <div className={cn('text-3xl', 'font-bold', 'text-green-600', 'mb-2')}>
              {dates.filter(dateInfo => getFlightsByDate(dateInfo.date).length > 0).length}
            </div>
            <div className="text-gray-600">Active Days</div>
          </div>
          
          <div className={cn('bg-white', 'rounded-lg', 'shadow-md', 'p-6', 'text-center')}>
            <div className={cn('text-3xl', 'font-bold', 'text-purple-600', 'mb-2')}>
              {[...new Set(airports.map(a => a.city))].length}
            </div>
            <div className="text-gray-600">Destinations</div>
          </div>
        </motion.div>
      {/* Schedule Chart */}
      <main className={cn( 'mx-auto', 'px-4', 'sm:px-1',  'py-8')}>
        <div className={cn('bg-white', 'rounded-xl', 'shadow-sm', 'overflow-hidden')}>
          {/* Table Header */}
          <div className={cn('bg-gray-50', 'px-6', 'py-4', 'border-b', 'border-gray-200')}>
            <div className={cn('grid', 'grid-cols-12', 'gap-4')}>
              <div className="col-span-2">
                <h3 className={cn('text-lg', 'font-semibold', 'text-gray-800')}>Date</h3>
              </div>
              <div className="col-span-2">
                <h3 className={cn('text-lg', 'font-semibold', 'text-gray-800')}>Day</h3>
              </div>
              <div className="col-span-8">
                <h3 className={cn('text-lg', 'font-semibold', 'text-gray-800')}>Flight Schedules</h3>
              </div>
            </div>
          </div>

          {/* Schedule Rows */}
          <div className={cn('divide-y', 'divide-gray-200')}>
            {dates.map((dateInfo, index) => {
              const dayFlights = getFlightsByDate(dateInfo.date);
              
              return (
                <motion.div
                  key={dateInfo.date}
                  className={cn('px-6', 'py-6', 'hover:bg-gray-50', 'transition-colors', 'duration-200')}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <div className={cn('grid', 'grid-cols-12', 'gap-4')}>
                    {/* Date Column */}
                    <div className={cn('col-span-2', 'flex', 'flex-col', 'justify-center')}>
                      <div className={cn('text-2xl', 'font-bold', 'text-gray-800')}>
                        {dateInfo.dateFormatted}
                      </div>
                      <div className={cn('text-sm', 'text-gray-500')}>
                        {new Date(dateInfo.date).getFullYear()}
                      </div>
                    </div>
                    
                    {/* Day Column */}
                    <div className={cn('col-span-2', 'flex', 'items-center')}>
                      <div className={cn('text-xl', 'font-semibold', 'text-blue-600')}>
                        {dateInfo.day}
                      </div>
                    </div>
                    
                    {/* Flights Column */}
                    <div className="col-span-8">
                      {loading ? (
                        <div className={cn('grid', 'grid-cols-1', 'md:grid-cols-2', 'lg:grid-cols-3', 'gap-4' ,    'scroll-smooth', 'no-scrollbar')}>
                          {Array.from({ length: 3 }).map((_, idx) => (
                            <SkeletonCard key={idx} />
                          ))}
                        </div>
                      ) : dayFlights.length > 0 ? (
                        <div className="col-span-8">
  {loading ? (
    <div className={cn('flex', 'gap-4', 'overflow-x-auto', 'pb-2')}>
      {Array.from({ length: 3 }).map((_, idx) => (
        <div key={idx} className="min-w-[280px]">
          <SkeletonCard />
        </div>
      ))}
    </div>
  ) : dayFlights.length > 0 ? (
    <div
      className={cn(
        "flex",
        "gap-4",
        "overflow-x-auto",
        "pb-2",
        "scroll-smooth"
      )}
    >
      {dayFlights.map((schedule) => (
        <div
          key={`${schedule.id}-${dateInfo.date}`}
          className={cn('min-w-[280px]', 'max-w-[280px]', 'flex-shrink-0')}
        >
          <FlightScheduleCard schedule={schedule} />
        </div>
      ))}
    </div>
  ) : (
    <div className={cn(
      'flex',
      'items-center',
      'justify-center',
      'h-24',
      'bg-gray-50',
      'rounded-lg',
      'border-2',
      'border-dashed',
      'border-gray-300'
    )}>
      <div className="text-center">
        <FaPlane className={cn('mx-auto', 'text-gray-400', 'mb-2')} size={24} />
        <p className="text-gray-500">No flights scheduled</p>
      </div>
    </div>
  )}
</div>

                      ) : (
                        <div className={cn('flex', 'items-center', 'justify-center', 'h-24', 'bg-gray-50', 'rounded-lg', 'border-2', 'border-dashed', 'border-gray-300')}>
                          <div className="text-center">
                            <FaPlane className={cn('mx-auto', 'text-gray-400', 'mb-2')} size={24} />
                            <p className="text-gray-500">No flights scheduled</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Summary Stats */}
     
      </main>
    </div>
  );
};

export default ScheduledPage;







