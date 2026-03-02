"use client";

import { useAuth } from "@/components/AuthContext";
import FilterSidebar from "@/components/booking/core/FilterSidebar";
import VehicleCard from "@/components/booking/core/VehicleCard";
import Header2 from "@/components/ScheduledFlight/Header";
import FilterSectionTop from "@/components/ScheduledFlight/FilterSectionTop";
import WeekSection from "@/components/ScheduledFlight/WeekSection";
import { cn } from "@/lib/utils";
import API from "@/services/api";
import { useEffect, useState } from "react";
import FlightHeader from "@/components/ScheduledFlight/FlightHeader";
import CheckoutSidebar from "@/components/ScheduledFlight/CheckoutSidebar";

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
  const [flightClass, setFlightClass] = useState("All Class");
  const [filterStops, setFilterStops] = useState("All");
  const [dates, setDates] = useState([]);
  const [searchCriteria, setSearchCriteria] = useState({
    departure: "",
    arrival: "",
    date: "",
    returnDate: "",
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
          console.error('[ScheduledFlight] Error fetching schedules:', err);
          return [];
        }),
        API.flights.getFlights({ user: true }).catch((err) => {
          console.error('[ScheduledFlight] Error fetching flights:', err);
          return [];
        }),
        API.airports.getAirports().catch((err) => {
          console.error('[ScheduledFlight] Error fetching airports:', err);
          return [];
        }),
      ]);

      console.log('[ScheduledFlight] API Response:', {
        schedules: schedulesRes?.length || 0,
        flights: flightsRes?.length || 0,
        airports: airportsRes?.length || 0
      });

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

      console.log('[ScheduledFlight] Normalized schedules:', normalized.length);

      setFlightSchedules(normalized);
      setFlights(Array.isArray(flightsRes) ? flightsRes : []);
      setAirports(Array.isArray(airportsRes) ? airportsRes : []);
    } catch (err) {
      console.error('[ScheduledFlight] Fatal error:', err);
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
      console.log('[ScheduledFlight] Missing data:', {
        hasSchedules: Array.isArray(flightSchedules),
        hasFlights: Array.isArray(flights),
        hasAirports: Array.isArray(airports)
      });
      return [];
    }

    console.log('[ScheduledFlight] Filtering data:', {
      schedules: flightSchedules.length,
      flights: flights.length,
      airports: airports.length,
      filters: {
        filterDepartureCity,
        filterArrivalCity,
        filterStatus,
        filterMinSeats,
        filterStops,
        searchCriteria
      }
    });

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

        // Case-insensitive city matching
        const matchesDeparture =
          (!filterDepartureCity || departureCity.toLowerCase() === filterDepartureCity.toLowerCase()) ||
          (isMultiStop && routeCities.some(city => city.toLowerCase() === filterDepartureCity.toLowerCase()));
        const matchesArrival =
          (!filterArrivalCity || arrivalCity.toLowerCase() === filterArrivalCity.toLowerCase()) ||
          (isMultiStop && routeCities.some(city => city.toLowerCase() === filterArrivalCity.toLowerCase()));
        const matchesSearch =
          (!searchCriteria.departure || departureCity.toLowerCase() === searchCriteria.departure.toLowerCase()) &&
          (!searchCriteria.arrival || arrivalCity.toLowerCase() === searchCriteria.arrival.toLowerCase()) &&
          (!searchCriteria.date || departure_date === searchCriteria.date);

        const passes = (
          matchesStatus &&
          matchesSeats &&
          matchesStops &&
          matchesDeparture &&
          matchesArrival &&
          matchesSearch
        );

        // Debug first item that fails
        if (!passes && flightSchedules.indexOf(fs) === 0) {
          console.log('[ScheduledFlight] First item filtered out:', {
            schedule: { id: fs.id, departureCity, arrivalCity, departure_date, status, availableSeats, stops },
            matches: { matchesStatus, matchesSeats, matchesStops, matchesDeparture, matchesArrival, matchesSearch },
            filters: { filterStatus, filterMinSeats, filterStops, filterDepartureCity, filterArrivalCity },
            searchCriteria
          });
        }

        return passes;
      })
      .sort((a, b) => {
        if (sortOption === "Price: Low to High") return parseFloat(a.price) - parseFloat(b.price);
        if (sortOption === "Price: High to Low") return parseFloat(b.price) - parseFloat(a.price);
        if (sortOption === "Departure Time") {
          return new Date(`1970-01-01T${a.departure_time}:00Z`) - new Date(`1970-01-01T${b.departure_time}:00Z`);
        }
        return 0;
      });

    console.log('[ScheduledFlight] Filtered result:', mapped.length);
    return mapped;
  };

  const filteredAndSortedFlightSchedules = getFilteredAndSortedFlightSchedules();

  // Filter airports to only show locations with airport_code (exclude helipad-only locations)
  const flightAirports = airports.filter(airport => airport.airport_code);

  // Prepare filters object for new FilterSidebar API
  const filters = {
    departure: filterDepartureCity,
    arrival: filterArrivalCity,
    date: searchCriteria.date,
    passengers: filterMinSeats,
    status: filterStatus,
    stops: filterStops,
    sortOption: sortOption
  };

  // Handle filter changes from new FilterSidebar
  const handleFilterChange = (newFilters) => {
    if (newFilters.departure !== undefined) setFilterDepartureCity(newFilters.departure);
    if (newFilters.arrival !== undefined) setFilterArrivalCity(newFilters.arrival);
    if (newFilters.status !== undefined) setFilterStatus(newFilters.status);
    if (newFilters.passengers !== undefined) setFilterMinSeats(newFilters.passengers);
    if (newFilters.stops !== undefined) setFilterStops(newFilters.stops);
    if (newFilters.sortOption !== undefined) setSortOption(newFilters.sortOption);
    if (newFilters.date !== undefined) {
      setSearchCriteria(prev => ({ ...prev, date: newFilters.date }));
    }

    // If filters are cleared (departure and arrival are empty), clear search criteria too
    if (newFilters.departure === '' && newFilters.arrival === '') {
      setSearchCriteria(prev => ({
        ...prev,
        departure: '',
        arrival: ''
      }));
    }
  };

  // Handle reset filters
  const handleResetFilters = () => {
    setFilterDepartureCity("");
    setFilterArrivalCity("");
    setFilterStatus("All");
    setFilterMinSeats(0);
    setFlightClass("All Class");
    setFilterStops("All");
    setSortOption("Price: Low to High");
    setSearchCriteria(prev => ({
      ...prev,
      departure: "",
      arrival: "",
      returnDate: "",
      passengers: 1,
    }));
  };

  return (
    <div className="inter-font">
      <FilterSectionTop
        departure={filterDepartureCity}
        arrival={filterArrivalCity}
        date={searchCriteria.date}
        passengers={filterMinSeats}
        flightClass={flightClass}
        locations={flightAirports}
        onDepartureChange={(city) => {
          setFilterDepartureCity(city);
          setSearchCriteria(prev => ({ ...prev, departure: city }));
        }}
        onArrivalChange={(city) => {
          setFilterArrivalCity(city);
          setSearchCriteria(prev => ({ ...prev, arrival: city }));
        }}
        onDateChange={(newDate) => {
          setSearchCriteria(prev => ({ ...prev, date: newDate }));
          fetchData(newDate);
        }}
        onPassengersChange={(val) => {
          setFilterMinSeats(val);
          setSearchCriteria(prev => ({ ...prev, passengers: val }));
        }}
        onClassChange={(val) => {
          setFlightClass(val);
        }}
        onSwap={() => {
          const d = filterDepartureCity;
          const a = filterArrivalCity;
          setFilterDepartureCity(a);
          setFilterArrivalCity(d);
          setSearchCriteria(prev => ({ ...prev, departure: a, arrival: d }));
        }}
        onSearch={() => fetchData(searchCriteria.date)}
        returnDate={searchCriteria.returnDate}
        onReturnDateChange={(newDate) => {
          setSearchCriteria(prev => ({ ...prev, returnDate: newDate }));
        }}
      />

      <WeekSection
        selectedDate={searchCriteria.date}
        onDateChange={(newDate) => {
          setSearchCriteria(prev => ({ ...prev, date: newDate }));
          fetchData(newDate);
        }}
      />

      <div className="min-h-screen bg-gray-50">
        <div className="max-w-[1600px] mx-auto flex flex-col md:flex-row">
          <div className="flex-1 overflow-y-auto h-auto">
            <div>
              <FlightHeader
                departure={searchCriteria.departure}
                arrival={searchCriteria.arrival}
                locationOptions={flightAirports}
              />
            </div>

            <main className="py-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
              <div className="mb-8">
                <div className="bg-white rounded-2xl shadow-md px-8 py-6 flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-black">
                    Available Flights({filteredAndSortedFlightSchedules.length})
                  </h2>

                  <button
                    className="text-indigo-600 hover:text-indigo-800 font-medium text-sm transition-colors duration-200 flex items-center gap-1"
                    onClick={handleResetFilters}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Reset
                  </button>
                </div>
              </div>

              {filteredAndSortedFlightSchedules.length > 0 ? (
                <div className="space-y-6">
                  {filteredAndSortedFlightSchedules.map((fs) => {
                    const flight = flights.find((f) => f.id === fs.flight_id) || {};
                    const depAirport = airports.find((a) => a.id === fs.departure_airport_id) || { city: "Unknown", airport_code: "UNK" };
                    const arrAirport = airports.find((a) => a.id === fs.arrival_airport_id) || { city: "Unknown", airport_code: "UNK" };

                    return (
                      <VehicleCard
                        key={`${fs.id}-${fs.departure_date}`}
                        type="flight"
                        schedule={fs}
                        vehicle={{
                          flight_number: flight.flight_number || "Unknown",
                          seat_limit: flight.seat_limit || 6
                        }}
                        departureLocation={depAirport}
                        arrivalLocation={arrAirport}
                        stops={fs.stops || []}
                        passengers={filterMinSeats || searchCriteria.passengers || 1}
                        selectedDate={searchCriteria.date}
                        authState={authState}
                      />
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-500 text-lg">
                    No active flights available matching your criteria.
                  </p>
                  <p className="text-gray-400 text-sm mt-2">
                    Try adjusting your filters or search criteria.
                  </p>
                </div>
              )}
            </main>
          </div>

          <div className="w-full md:w-[420px] md:flex-shrink-0 md:sticky md:top-24 h-fit pb-12 px-4 lg:px-8 mt-6 md:mt-0">
            {(() => {
              const depCode = airports.find(a => a.city.toLowerCase() === (searchCriteria.departure || "").toLowerCase())?.airport_code || "BHO";
              const arrCode = airports.find(a => a.city.toLowerCase() === (searchCriteria.arrival || "").toLowerCase())?.airport_code || "JLR";
              return (
                <CheckoutSidebar
                  departure={searchCriteria.departure || "Bhopal"}
                  departureCode={depCode}
                  arrival={searchCriteria.arrival || "Jabalpur"}
                  arrivalCode={arrCode}
                  passengers={searchCriteria.passengers || 1}
                />
              );
            })()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScheduledFlightsPage;