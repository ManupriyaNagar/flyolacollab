"use client";

import BASE_URL from "@/baseUrl/baseUrl";
import { useAuth } from "@/components/AuthContext";
import FilterSidebar from "@/components/HelicopterFlight/FilterSidebar";
import Header2 from "@/components/HelicopterFlight/Header";
import HelicopterFlightCard from "@/components/HelicopterFlight/HelicopterFlightCard";
import { useEffect, useState } from "react";

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

const HelicopterFlightsPage = () => {
  const { authState, setAuthState } = useAuth();

  const [helicopterSchedules, setHelicopterSchedules] = useState([]);
  const [helicopters, setHelicopters] = useState([]);
  const [helipads, setHelipads] = useState([]);
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
    const weekday = today.toLocaleDateString("en-US", { weekday: "long", timeZone: tz });



    try {
      const [schedulesRes, helicoptersRes, helipadsRes] = await Promise.all([
        fetch(`${BASE_URL}/helicopter-schedules?user=true&month=${year}-${month}`).catch((err) => {
          return { ok: false };
        }),
        fetch(`${BASE_URL}/helicopters`).catch((err) => {
          return { ok: false };
        }),
        fetch(`${BASE_URL}/helipads`).catch((err) => {
          return { ok: false };
        }),
      ]);

      const schedulesData = schedulesRes.ok ? await schedulesRes.json() : [];
      const helicoptersData = helicoptersRes.ok ? await helicoptersRes.json() : [];
      const helipadsData = helipadsRes.ok ? await helipadsRes.json() : [];

      // Normalize the schedules data (similar to flight schedules)
      const normalized = Array.isArray(schedulesData)
        ? schedulesData.map((schedule) => ({
            ...schedule,
            departure_date: schedule.departure_date || date,
            availableSeats: schedule.availableSeats ?? 0,
          }))
        : [];

      setHelicopterSchedules(normalized);
      setHelicopters(Array.isArray(helicoptersData) ? helicoptersData : []);
      setHelipads(Array.isArray(helipadsData) ? helipadsData : []);
    } catch (err) {
      setHelicopterSchedules([]);
      setHelicopters([]);
      setHelipads([]);
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
    const dateParam = params.get("date");
    const pax = parseInt(params.get("passengers")) || 1;

    // Use date from URL if valid, otherwise use today's date
    let selectedDate = fmtIso(new Date());
    if (dateParam && isValidISO(dateParam)) {
      selectedDate = dateParam;
    }

    setFilterDepartureCity(dep);
    setFilterArrivalCity(arrCity);
    setFilterMinSeats(pax);
    setSearchCriteria({ departure: dep, arrival: arrCity, date: selectedDate, passengers: pax });

    setDates(getMonthDates());
    fetchData(selectedDate);
  }, [isClient]);

  useEffect(() => {
    if (!isClient || !searchCriteria?.date || !isValidISO(searchCriteria.date)) return;
    const interval = setInterval(() => fetchData(searchCriteria.date), 30000);
    return () => clearInterval(interval);
  }, [isClient, searchCriteria?.date]);

  useEffect(() => {
    function handleSeatUpdate(e) {
      const { schedule_id, bookDate, availableSeats } = e.detail;
      if (!isValidISO(bookDate)) return;

      setHelicopterSchedules((prev) =>
        prev.map((hs) =>
          hs.id === schedule_id && hs.departure_date === bookDate
            ? { ...hs, availableSeats: Array.isArray(availableSeats) ? availableSeats.length : hs.availableSeats ?? 0 }
            : hs
        )
      );
    }
    window.addEventListener("seats-updated", handleSeatUpdate);
    return () => window.removeEventListener("seats-updated", handleSeatUpdate);
  }, []);

  const getFilteredAndSortedHelicopterSchedules = () => {
    if (!Array.isArray(helicopterSchedules) || !Array.isArray(helicopters) || !Array.isArray(helipads)) {
      return [];
    }

    const mapped = helicopterSchedules
      .map((hs) => {
        const helicopter = helicopters.find((h) => h.id === hs.helicopter_id) || {};
        const depHelipad = helipads.find((h) => h.id === hs.departure_helipad_id) || { city: "Unknown" };
        const arrHelipad = helipads.find((h) => h.id === hs.arrival_helipad_id) || { city: "Unknown" };
        const stopIds = normaliseStops(hs.via_stop_id);
        const routeCities = [...new Set(stopIds)].map((id) => helipads.find((h) => h.id === id)?.city || "Unknown");
        const isMultiStop = stopIds.length > 0;
        const fullRoute = [depHelipad.city, ...routeCities, arrHelipad.city];

        return {
          ...hs,
          departureCity: depHelipad.city,
          arrivalCity: arrHelipad.city,
          helicopter_number: helicopter.helicopter_number || "Unknown",
          seat_limit: helicopter.seat_limit ?? 0,
          availableSeats: hs.availableSeats ?? helicopter.seat_limit ?? 0,
          status: helicopter.status ?? hs.status,
          stops: stopIds,
          routeCities: fullRoute,
          isMultiStop,
          departure_time_formatted: hs.departure_time,
          arrival_time_formatted: hs.arrival_time,
        };
      })
      .filter((hs) => {
        const {
          departureCity,
          arrivalCity,
          routeCities,
          status,
          availableSeats,
          stops,
          isMultiStop,
        } = hs;

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
          (!searchCriteria.date || hs.departure_date === searchCriteria.date);



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

  const filteredAndSortedHelicopterSchedules = getFilteredAndSortedHelicopterSchedules();

  // Don't render anything on server side
  if (!isClient) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-lg text-gray-600">Loading...</div>
    </div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      <div className="w-full md:w-72 md:flex-shrink-0 overflow-y-auto h-auto md:h-screen bg-white shadow-lg md:sticky top-20">
        <FilterSidebar
          helipads={helipads}
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
          selectedDate={searchCriteria?.date || ""}
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
              Available Helicopter Flights ({filteredAndSortedHelicopterSchedules.length})
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



          {filteredAndSortedHelicopterSchedules.length > 0 ? (
            <div className="space-y-6">
              {filteredAndSortedHelicopterSchedules.map((hs) => {
                const helicopter = helicopters.find(h => h.id === hs.helicopter_id);
                const departureHelipad = helipads.find(h => h.id === hs.departure_helipad_id);
                const arrivalHelipad = helipads.find(h => h.id === hs.arrival_helipad_id);
                
                return (
                  <HelicopterFlightCard
                    key={`${hs.id}-${hs.departure_date}`}
                    schedule={hs}
                    helicopter={helicopter}
                    departureHelipad={departureHelipad}
                    arrivalHelipad={arrivalHelipad}
                    helipads={helipads}
                    searchCriteria={searchCriteria}
                    authState={authState}
                    selectedDate={searchCriteria?.date || ""}
                    passengers={searchCriteria?.passengers || 1}
                  />
                );
              })}
            </div>
          ) : (
            <div className="text-center py-6 sm:py-12">
              <p className="text-gray-500 text-base sm:text-lg">
                No active helicopter flights available matching your criteria.
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

export default HelicopterFlightsPage;