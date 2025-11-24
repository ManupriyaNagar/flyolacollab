"use client";

import React, { useState, useEffect } from "react";
import FilterSidebar from "@/components/ScheduledFlight/FilterSidebar";
import FlightCard from "@/components/ScheduledFlight/FlightCard";
import Header2 from "@/components/ScheduledFlight/Header";
import { useAuth } from "@/components/AuthContext";
import API from "@/services/api";

const tz = "Asia/Kolkata";
const fmtIso = (d) =>
  d.toLocaleDateString("sv-SE", { timeZone: tz });

const isValidISO = (s) => /^\d{4}-\d{2}-\d{2}$/.test(s);
const normaliseStops = (raw) => {
  try {
    const arr = Array.isArray(raw) ? raw : JSON.parse(raw || "[]");
    return [...new Set(arr.map(Number).filter((id) => Number.isInteger(id) && id > 0))];
  } catch {
    return [];
  }
};

const ScheduledFlightsPage = () => {
  const { authState, setAuthState } = useAuth();

  const [flightSchedules, setFlightSchedules] = useState([]);
  const [flights, setFlights] = useState([]);
  const [airports, setAirports] = useState([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [sortOption, setSortOption] = useState("Price: Low to High");
  const [filterDepartureCity, setFilterDepartureCity] = useState("");
  const [filterArrivalCity, setFilterArrivalCity] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterMinSeats, setFilterMinSeats] = useState(0);
  const [filterStops, setFilterStops] = useState("All");
  const [dates, setDates] = useState([]);
  const [searchCriteria, setSearchCriteria] = useState({
    departure: "",
    arrival: "",
    date: "",
    passengers: 1,
  });
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const fetchData = async (date) => {
    if (!isValidISO(date)) return;

    const today = new Date(date);
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");

    try {
      const [schedulesRes, flightsRes, airportsRes] = await Promise.all([
        API.flights.getFlightSchedules({ user: true, month: `${year}-${month}` }).catch((err) => {
          return [];
        }),
        API.flights.getFlights({ user: true }).catch((err) => {
          return [];
        }),
        API.airports.getAirports().catch((err) => {
          return [];
        }),
      ]);

      const normalized = Array.isArray(schedulesRes)
        ? schedulesRes.map((schedule) => ({
            ...schedule,
            departure_date: schedule.departure_date
              ? new Date(schedule.departure_date)
                  .toLocaleDateString("en-CA", {
                    timeZone: tz,
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                  })
                  .split("/")
                  .reverse()
                  .join("-")
              : date,
            availableSeats: schedule.availableSeats ?? 0,
          }))
        : [];

      setFlightSchedules(normalized);
      setFlights(Array.isArray(flightsRes) ? flightsRes : []);
      setAirports(Array.isArray(airportsRes) ? airportsRes : []);
    } catch (err) {
      setFlightSchedules([]);
      setFlights([]);
      setAirports([]);
    }
  };

  useEffect(() => {
    if (!isClient) return;

    const getMonthDates = () => {
      const today = new Date();
      const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);
      const arr = [];
      for (let d = new Date(today); d <= lastDay; d.setDate(d.getDate() + 1)) {
        arr.push({
          date: fmtIso(d),
          day: d.toLocaleDateString("en-US", { weekday: "long", timeZone: tz }),
        });
      }
      return arr;
    };

    const params = new URLSearchParams(window.location.search);
    const dep = params.get("departure") || "";
    const arrCity = params.get("arrival") || "";
    const date = params.get("date") || fmtIso(new Date());
    const pax = parseInt(params.get("passengers")) || 1;

    if (!isValidISO(date)) return;

    setFilterDepartureCity(dep);
    setFilterArrivalCity(arrCity);
    setFilterMinSeats(pax);
    setSearchCriteria({ departure: dep, arrival: arrCity, date, passengers: pax });

    setDates(getMonthDates());
    fetchData(date);
  }, [isClient]);

  useEffect(() => {
    if (!isClient || !isValidISO(searchCriteria.date)) return;
    const interval = setInterval(() => fetchData(searchCriteria.date), 30000);
    return () => clearInterval(interval);
  }, [isClient, searchCriteria.date]);

  useEffect(() => {
    function handleSeatUpdate(e) {
      const { schedule_id, bookDate, availableSeats } = e.detail;
      if (!isValidISO(bookDate)) return;

      setFlightSchedules((prev) =>
        prev.map((fs) =>
          fs.id === schedule_id && fs.departure_date === bookDate
            ? { ...fs, availableSeats: Array.isArray(availableSeats) ? availableSeats.length : fs.availableSeats ?? 0 }
            : fs
        )
      );
    }
    window.addEventListener("seats-updated", handleSeatUpdate);
    return () => window.removeEventListener("seats-updated", handleSeatUpdate);
  }, []);

  const getFilteredAndSortedFlightSchedules = () => {
    if (!Array.isArray(flightSchedules) || !Array.isArray(flights) || !Array.isArray(airports)) {
      return [];
    }

    const mapped = flightSchedules
      .map((fs) => {
        const flight = flights.find((f) => f.id === fs.flight_id) || {};
        const depAirport = airports.find((a) => a.id === fs.departure_airport_id) || { city: "Unknown" };
        const arrAirport = airports.find((a) => a.id === fs.arrival_airport_id) || { city: "Unknown" };
        const stopIds = normaliseStops(fs.via_stop_id);
        const routeCities = [...new Set(stopIds)].map((id) => airports.find((a) => a.id === id)?.city || "Unknown");
        const isMultiStop = stopIds.length > 0;
        const fullRoute = [depAirport.city, ...routeCities, arrAirport.city];
        const departureTime = new Date(`1970-01-01T${fs.departure_time}`).toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          timeZone: tz,
        });
        const arrivalTime = new Date(`1970-01-01T${fs.arrival_time}`).toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          timeZone: tz,
        });

        return {
          ...fs,
          departureCity: depAirport.city,
          arrivalCity: arrAirport.city,
          flight_number: flight.flight_number || "Unknown",
          seat_limit: flight.seat_limit ?? 0,
          availableSeats: fs.availableSeats ?? 0,
          status: flight.status ?? fs.status,
          stops: stopIds,
          routeCities: fullRoute,
          isMultiStop,
          departure_time_formatted: departureTime,
          arrival_time_formatted: arrivalTime,
        };
      })
      .filter((fs) => {
        const {
          departureCity,
          arrivalCity,
          routeCities,
          status,
          availableSeats,
          stops,
          departure_date,
          isMultiStop,
        } = fs;

        const matchesStatus =
          filterStatus === "All" ||
          (filterStatus === "Scheduled" && status === 0) ||
          (filterStatus === "Departed" && status === 1);
        const matchesSeats = filterMinSeats === 0 || availableSeats >= filterMinSeats;
        const matchesStops = filterStops === "All" || stops.length === parseInt(filterStops);
        const matchesDeparture =
          (!filterDepartureCity || departureCity === filterDepartureCity) ||
          (isMultiStop && routeCities.includes(filterDepartureCity));
        const matchesArrival =
          (!filterArrivalCity || arrivalCity === filterArrivalCity) ||
          (isMultiStop && routeCities.includes(filterArrivalCity));
        const matchesSearch =
          (!searchCriteria.departure || departureCity === searchCriteria.departure) &&
          (!searchCriteria.arrival || arrivalCity === searchCriteria.arrival) &&
          (!searchCriteria.date || departure_date === searchCriteria.date);

        return (
          matchesStatus &&
          matchesSeats &&
          matchesStops &&
          matchesDeparture &&
          matchesArrival &&
          matchesSearch
        );
      })
      .sort((a, b) => {
        if (sortOption === "Price: Low to High") return parseFloat(a.price) - parseFloat(b.price);
        if (sortOption === "Price: High to Low") return parseFloat(b.price) - parseFloat(a.price);
        if (sortOption === "Departure Time") {
          return new Date(`1970-01-01T${a.departure_time}:00Z`) - new Date(`1970-01-01T${b.departure_time}:00Z`);
        }
        return 0;
      });

    return mapped;
  };

  const filteredAndSortedFlightSchedules = getFilteredAndSortedFlightSchedules();

  // Filter airports to only show locations with airport_code (exclude helipad-only locations)
  const flightAirports = airports.filter(airport => airport.airport_code);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      <div className="w-full md:w-72 md:flex-shrink-0 overflow-y-auto h-auto md:h-screen bg-white shadow-lg md:sticky top-20">
        <FilterSidebar
          airports={flightAirports}
          sortOption={sortOption}
          setSortOption={setSortOption}
          filterDepartureCity={filterDepartureCity}
          setFilterDepartureCity={setFilterDepartureCity}
          filterArrivalCity={filterArrivalCity}
          setFilterArrivalCity={setFilterArrivalCity}
          filterStatus={filterStatus}
          setFilterStatus={setFilterStatus}
          filterMinSeats={filterMinSeats}
          setFilterMinSeats={setFilterMinSeats}
          filterStops={filterStops}
          setFilterStops={setFilterStops}
          isFilterOpen={isFilterOpen}
          setIsFilterOpen={setIsFilterOpen}
          authState={authState}
          setAuthState={setAuthState}
          dates={dates}
          selectedDate={searchCriteria.date}
          setSearchCriteria={setSearchCriteria}
        />
      </div>

      <div className="flex-1 overflow-y-auto h-auto">
        <div className="px-4 sm:px-6 lg:px-8">
          <Header2 />
        </div>

        <main className="py-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center mb-6">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 mb-4 md:mb-0">
              Available Flights ({filteredAndSortedFlightSchedules.length})
            </h2>
            <button
              className="md:hidden w-full sm:w-auto px-4 py-2 bg-gradient-to-r from-indigo-500 to-blue-600 text-white rounded-lg text-sm font-semibold hover:from-indigo-600 hover:to-blue-700 transition-all duration-200 flex items-center gap-2"
              onClick={() => setIsFilterOpen(true)}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
                />
              </svg>
              Filters
            </button>
          </div>

          {filteredAndSortedFlightSchedules.length > 0 ? (
            <div className="space-y-6">
              {filteredAndSortedFlightSchedules.map((fs) => (
                <FlightCard
                  key={`${fs.id}-${fs.departure_date}`}
                  flightSchedule={fs}
                  flights={flights}
                  airports={airports}
                  authState={authState}
                  dates={dates.map((d) => d.date)}
                  selectedDate={searchCriteria.date}
                  passengers={searchCriteria.passengers}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-6 sm:py-12">
              <p className="text-gray-500 text-base sm:text-lg">
                No active flights available matching your criteria.
              </p>
              <p className="text-gray-400 text-sm mt-2">
                Try adjusting your filters or search criteria.
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default ScheduledFlightsPage;