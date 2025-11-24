"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/components/AuthContext";
import { useRouter } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ProfessionalTicket from "./../../../components/SingleTicket/ProfessionalTicket";
import BASE_URL from "@/baseUrl/baseUrl";
import {
  TicketIcon,
  PlusCircleIcon,
  EyeIcon,
  UserPlusIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { AirportService } from "@/services/api";
import { cn } from "@/lib/utils";

const CreateTicketPage = () => {
  const { authState } = useAuth();
  const router = useRouter();
  const [airports, setAirports] = useState([]);
  const [helipads, setHelipads] = useState([]);
  const [showPreview, setShowPreview] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [ticketType, setTicketType] = useState("flight"); // "flight" or "helicopter"

  // Flight Details State
  const [flightData, setFlightData] = useState({
    departure: "",
    arrival: "",
    departureCode: "",
    arrivalCode: "",
    departureTime: "09:00",
    arrivalTime: "11:00",
    selectedDate: new Date().toISOString().split('T')[0],
    flightNumber: "",
    totalPrice: "",
    bookingNo: `BK-${Date.now().toString(36).toUpperCase()}`,
    pnr: `FLYOLA-${Date.now().toString(36).toUpperCase()}`,
  });

  // Passengers State
  const [passengers, setPassengers] = useState([
    {
      fullName: "",
      email: "",
      phone: "",
      age: "",
      type: "Adult",
      seat: "",
      title: "Mr",
    }
  ]);

  // Redirect if not admin
  useEffect(() => {
    if (!authState.isLoading && (!authState.isLoggedIn || String(authState.userRole) !== "1")) {
      router.push("/sign-in");
    }
  }, [authState, router]);

  // Fetch airports and helipads
  useEffect(() => {
    async function fetchData() {
      try {
        const token = localStorage.getItem("token");
        
        // Fetch airports
        const airportData = await AirportService.getAirports();
        console.log("Fetched airports:", airportData);
        setAirports(Array.isArray(airportData) ? airportData : []);
        
        // Fetch helipads
        const helipadResponse = await fetch(`${BASE_URL}/helipads`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (helipadResponse.ok) {
          const helipadData = await helipadResponse.json();
          console.log("Fetched helipads:", helipadData);
          setHelipads(Array.isArray(helipadData) ? helipadData : []);
        }
      } catch (error) {
        console.error("Data fetch error:", error);
        toast.error("Failed to load data");
      }
    }
    
    if (authState.isLoggedIn && String(authState.userRole) === "1") {
      fetchData();
    }
  }, [authState.isLoggedIn, authState.userRole]);

  const handleFlightDataChange = (field, value) => {
    setFlightData(prev => ({ ...prev, [field]: value }));
    
    // Auto-populate airport codes
    if (field === "departure" || field === "arrival") {
      const airport = airports.find(a => a.airport_name === value || a.city === value);
      if (airport) {
        const codeField = field === "departure" ? "departureCode" : "arrivalCode";
        setFlightData(prev => ({ ...prev, [codeField]: airport.airport_code || value.substring(0, 3).toUpperCase() }));
      }
    }
  };

  const handlePassengerChange = (index, field, value) => {
    const updatedPassengers = [...passengers];
    updatedPassengers[index][field] = value;
    setPassengers(updatedPassengers);
  };

  const addPassenger = () => {
    setPassengers([...passengers, {
      fullName: "",
      email: "",
      phone: "",
      age: "",
      type: "Adult",
      seat: "",
      title: "Mr",
    }]);
  };

  const removePassenger = (index) => {
    if (passengers.length > 1) {
      setPassengers(passengers.filter((_, i) => i !== index));
    } else {
      toast.error("At least one passenger is required");
    }
  };

  const validateForm = () => {
    if (!flightData.departure || !flightData.arrival) {
      toast.error("Please select departure and arrival airports");
      return false;
    }
    if (!flightData.flightNumber) {
      toast.error("Please enter flight number");
      return false;
    }
    if (!flightData.totalPrice || parseFloat(flightData.totalPrice) <= 0) {
      toast.error("Please enter a valid price");
      return false;
    }
    if (!flightData.bookingNo) {
      toast.error("Please enter booking ID");
      return false;
    }
    if (!flightData.pnr) {
      toast.error("Please enter ticket number (PNR)");
      return false;
    }
    
    for (let i = 0; i < passengers.length; i++) {
      if (!passengers[i].fullName) {
        toast.error(`Please enter name for passenger ${i + 1}`);
        return false;
      }
    }
    
    return true;
  };

  const handlePreview = () => {
    if (!validateForm()) return;
    setShowPreview(true);
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    try {
      const token = localStorage.getItem("token") || "";
      
      const bookingPayload = {
        ...flightData,
        bookDate: flightData.selectedDate,
        passengers: passengers.map((p, idx) => ({
          ...p,
          seat: p.seat || `${String.fromCharCode(65 + (idx % 6))}${Math.floor(idx / 6) + 1}`
        })),
        bookingStatus: "CONFIRMED",
        paymentStatus: "COMPLETED",
        createdBy: "admin",
      };

      const response = await fetch(`${BASE_URL}/bookings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(bookingPayload),
      });

      if (response.ok) {
        toast.success("Ticket created successfully!");
        setTimeout(() => {
          router.push("/admin-dashboard/tickets");
        }, 2000);
      } else {
        throw new Error("Failed to create ticket");
      }
    } catch (error) {
      toast.error(`Error: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Transform data for preview
  const getPreviewData = () => {
    return {
      bookingData: {
        ...flightData,
        bookDate: flightData.selectedDate,
        bookingType: ticketType, // Pass ticket type to preview
      },
      travelerDetails: passengers,
      bookingResult: {
        booking: {
          bookingNo: flightData.bookingNo,
          pnr: flightData.pnr,
          bookingStatus: "CONFIRMED",
          paymentStatus: "COMPLETED",
          totalFare: flightData.totalPrice,
        },
        passengers: passengers.map((p, idx) => ({
          ...p,
          seat: p.seat || `${String.fromCharCode(65 + (idx % 6))}${Math.floor(idx / 6) + 1}`
        })),
      },
    };
  };

  return (
    <div className="space-y-8">
      <ToastContainer position="top-right" autoClose={3000} />
      
      {/* Header */}
      <div className={cn('flex', 'flex-col', 'lg:flex-row', 'lg:items-center', 'lg:justify-between', 'gap-4')}>
        <div>
          <h1 className={cn('text-3xl', 'font-bold', 'text-slate-800', 'flex', 'items-center', 'gap-3')}>
            <div className={cn('p-2', 'bg-gradient-to-r', 'from-blue-500', 'to-indigo-500', 'rounded-xl')}>
              <PlusCircleIcon className={cn('w-8', 'h-8', 'text-white')} />
            </div>
            Create Ticket
          </h1>
          <p className={cn('text-slate-600', 'mt-2')}>Create a new {ticketType === 'flight' ? 'flight' : 'helicopter'} ticket manually</p>
        </div>
        
        {/* Ticket Type Selector */}
        <div className={cn('flex', 'items-center', 'gap-3', 'bg-white', 'p-2', 'rounded-xl', 'border', 'border-slate-200', 'shadow-sm')}>
          <button
            onClick={() => setTicketType('flight')}
            className={cn(
              'px-6', 'py-2.5', 'rounded-lg', 'font-medium', 'transition-all',
              ticketType === 'flight'
                ? 'bg-blue-500 text-white shadow-md'
                : 'bg-transparent text-slate-600 hover:bg-slate-50'
            )}
          >
            ✈️ Flight
          </button>
          <button
            onClick={() => setTicketType('helicopter')}
            className={cn(
              'px-6', 'py-2.5', 'rounded-lg', 'font-medium', 'transition-all',
              ticketType === 'helicopter'
                ? 'bg-green-500 text-white shadow-md'
                : 'bg-transparent text-slate-600 hover:bg-slate-50'
            )}
          >
            🚁 Helicopter
          </button>
        </div>
      </div>

      {/* Flight Details Form */}
      <div className={cn('bg-white', 'rounded-2xl', 'shadow-lg', 'border', 'border-slate-200', 'p-6')}>
        <div className={cn('flex', 'items-center', 'gap-3', 'mb-6')}>
          <div className={cn('p-2', 'bg-blue-50', 'rounded-lg')}>
            <TicketIcon className={cn('w-6', 'h-6', 'text-blue-600')} />
          </div>
          <h2 className={cn('text-xl', 'font-semibold', 'text-slate-800')}>Flight Information</h2>
        </div>

        <div className={cn('grid', 'grid-cols-1', 'md:grid-cols-2', 'lg:grid-cols-3', 'gap-6')}>
          <div>
            <label className={cn('block', 'text-sm', 'font-medium', 'text-slate-700', 'mb-2')}>
              {ticketType === 'flight' ? 'Departure Airport' : 'Departure Helipad'} * {(ticketType === 'flight' ? airports : helipads).length > 0 && <span className="text-xs text-slate-500">({(ticketType === 'flight' ? airports : helipads).length} {ticketType === 'flight' ? 'airports' : 'helipads'})</span>}
            </label>
            <select
              value={flightData.departure}
              onChange={(e) => handleFlightDataChange("departure", e.target.value)}
              className={cn('w-full', 'px-4', 'py-3', 'border', 'border-slate-300', 'rounded-xl', 'focus:outline-none', 'focus:ring-2', ticketType === 'flight' ? 'focus:ring-blue-500' : 'focus:ring-green-500')}
            >
              <option value="">Select {ticketType === 'flight' ? 'Airport' : 'Helipad'}</option>
              {ticketType === 'flight' ? (
                airports.length === 0 ? (
                  <option disabled>Loading airports...</option>
                ) : (
                  airports.map((airport) => (
                    <option key={airport.id} value={airport.airport_name || airport.city}>
                      {airport.city} - {airport.airport_name} ({airport.airport_code})
                    </option>
                  ))
                )
              ) : (
                helipads.length === 0 ? (
                  <option disabled>Loading helipads...</option>
                ) : (
                  helipads.map((helipad) => (
                    <option key={helipad.id} value={helipad.helipad_name || helipad.city}>
                      {helipad.city} - {helipad.helipad_name} ({helipad.helipad_code})
                    </option>
                  ))
                )
              )}
            </select>
          </div>

          <div>
            <label className={cn('block', 'text-sm', 'font-medium', 'text-slate-700', 'mb-2')}>
              {ticketType === 'flight' ? 'Arrival Airport' : 'Arrival Helipad'} * {(ticketType === 'flight' ? airports : helipads).length > 0 && <span className="text-xs text-slate-500">({(ticketType === 'flight' ? airports : helipads).length} {ticketType === 'flight' ? 'airports' : 'helipads'})</span>}
            </label>
            <select
              value={flightData.arrival}
              onChange={(e) => handleFlightDataChange("arrival", e.target.value)}
              className={cn('w-full', 'px-4', 'py-3', 'border', 'border-slate-300', 'rounded-xl', 'focus:outline-none', 'focus:ring-2', ticketType === 'flight' ? 'focus:ring-blue-500' : 'focus:ring-green-500')}
            >
              <option value="">Select {ticketType === 'flight' ? 'Airport' : 'Helipad'}</option>
              {ticketType === 'flight' ? (
                airports.length === 0 ? (
                  <option disabled>Loading airports...</option>
                ) : (
                  airports.map((airport) => (
                    <option key={airport.id} value={airport.airport_name || airport.city}>
                      {airport.city} - {airport.airport_name} ({airport.airport_code})
                    </option>
                  ))
                )
              ) : (
                helipads.length === 0 ? (
                  <option disabled>Loading helipads...</option>
                ) : (
                  helipads.map((helipad) => (
                    <option key={helipad.id} value={helipad.helipad_name || helipad.city}>
                      {helipad.city} - {helipad.helipad_name} ({helipad.helipad_code})
                    </option>
                  ))
                )
              )}
            </select>
          </div>

          <div>
            <label className={cn('block', 'text-sm', 'font-medium', 'text-slate-700', 'mb-2')}>
              {ticketType === 'flight' ? 'Flight Number' : 'Helicopter Number'} *
            </label>
            <input
              type="text"
              value={flightData.flightNumber}
              onChange={(e) => handleFlightDataChange("flightNumber", e.target.value)}
              placeholder={ticketType === 'flight' ? 'e.g., FL123' : 'e.g., H-001'}
              className={cn('w-full', 'px-4', 'py-3', 'border', 'border-slate-300', 'rounded-xl', 'focus:outline-none', 'focus:ring-2', ticketType === 'flight' ? 'focus:ring-blue-500' : 'focus:ring-green-500')}
            />
          </div>

          <div>
            <label className={cn('block', 'text-sm', 'font-medium', 'text-slate-700', 'mb-2')}>
              Departure Time *
            </label>
            <input
              type="time"
              value={flightData.departureTime}
              onChange={(e) => handleFlightDataChange("departureTime", e.target.value)}
              className={cn('w-full', 'px-4', 'py-3', 'border', 'border-slate-300', 'rounded-xl', 'focus:outline-none', 'focus:ring-2', 'focus:ring-blue-500')}
            />
          </div>

          <div>
            <label className={cn('block', 'text-sm', 'font-medium', 'text-slate-700', 'mb-2')}>
              Arrival Time *
            </label>
            <input
              type="time"
              value={flightData.arrivalTime}
              onChange={(e) => handleFlightDataChange("arrivalTime", e.target.value)}
              className={cn('w-full', 'px-4', 'py-3', 'border', 'border-slate-300', 'rounded-xl', 'focus:outline-none', 'focus:ring-2', 'focus:ring-blue-500')}
            />
          </div>

          <div>
            <label className={cn('block', 'text-sm', 'font-medium', 'text-slate-700', 'mb-2')}>
              Flight Date *
            </label>
            <input
              type="date"
              value={flightData.selectedDate}
              onChange={(e) => handleFlightDataChange("selectedDate", e.target.value)}
              className={cn('w-full', 'px-4', 'py-3', 'border', 'border-slate-300', 'rounded-xl', 'focus:outline-none', 'focus:ring-2', 'focus:ring-blue-500')}
            />
          </div>

          <div>
            <label className={cn('block', 'text-sm', 'font-medium', 'text-slate-700', 'mb-2')}>
              Total Price (₹) *
            </label>
            <input
              type="number"
              value={flightData.totalPrice}
              onChange={(e) => handleFlightDataChange("totalPrice", e.target.value)}
              placeholder="e.g., 5000"
              className={cn('w-full', 'px-4', 'py-3', 'border', 'border-slate-300', 'rounded-xl', 'focus:outline-none', 'focus:ring-2', 'focus:ring-blue-500')}
            />
          </div>

          <div>
            <label className={cn('block', 'text-sm', 'font-medium', 'text-slate-700', 'mb-2')}>
              Booking ID *
            </label>
            <input
              type="text"
              value={flightData.bookingNo}
              onChange={(e) => handleFlightDataChange("bookingNo", e.target.value)}
              placeholder="e.g., BK-123456"
              className={cn('w-full', 'px-4', 'py-3', 'border', 'border-slate-300', 'rounded-xl', 'focus:outline-none', 'focus:ring-2', 'focus:ring-blue-500')}
            />
          </div>

          <div>
            <label className={cn('block', 'text-sm', 'font-medium', 'text-slate-700', 'mb-2')}>
              Ticket No. (PNR) *
            </label>
            <input
              type="text"
              value={flightData.pnr}
              onChange={(e) => handleFlightDataChange("pnr", e.target.value)}
              placeholder="e.g., FLYOLA-ABC123"
              className={cn('w-full', 'px-4', 'py-3', 'border', 'border-slate-300', 'rounded-xl', 'focus:outline-none', 'focus:ring-2', 'focus:ring-blue-500')}
            />
          </div>
        </div>
      </div>

      {/* Passengers Form */}
      <div className={cn('bg-white', 'rounded-2xl', 'shadow-lg', 'border', 'border-slate-200', 'p-6')}>
        <div className={cn('flex', 'items-center', 'justify-between', 'mb-6')}>
          <div className={cn('flex', 'items-center', 'gap-3')}>
            <div className={cn('p-2', 'bg-green-50', 'rounded-lg')}>
              <UserPlusIcon className={cn('w-6', 'h-6', 'text-green-600')} />
            </div>
            <h2 className={cn('text-xl', 'font-semibold', 'text-slate-800')}>Passenger Details</h2>
          </div>
          <button
            onClick={addPassenger}
            className={cn('flex', 'items-center', 'gap-2', 'px-4', 'py-2', 'bg-green-500', 'text-white', 'rounded-lg', 'hover:bg-green-600', 'transition-all')}
          >
            <PlusCircleIcon className={cn('w-5', 'h-5')} />
            Add Passenger
          </button>
        </div>

        <div className="space-y-6">
          {passengers.map((passenger, index) => (
            <div key={index} className={cn('p-6', 'bg-slate-50', 'rounded-xl', 'border', 'border-slate-200', 'relative')}>
              {passengers.length > 1 && (
                <button
                  onClick={() => removePassenger(index)}
                  className={cn('absolute', 'top-4', 'right-4', 'p-2', 'bg-red-100', 'text-red-600', 'rounded-lg', 'hover:bg-red-200', 'transition-all')}
                >
                  <XMarkIcon className={cn('w-5', 'h-5')} />
                </button>
              )}
              
              <h3 className={cn('text-lg', 'font-semibold', 'text-slate-700', 'mb-4')}>
                Passenger {index + 1}
              </h3>
              
              <div className={cn('grid', 'grid-cols-1', 'md:grid-cols-2', 'lg:grid-cols-4', 'gap-4')}>
                <div>
                  <label className={cn('block', 'text-sm', 'font-medium', 'text-slate-700', 'mb-2')}>
                    Title
                  </label>
                  <select
                    value={passenger.title}
                    onChange={(e) => handlePassengerChange(index, "title", e.target.value)}
                    className={cn('w-full', 'px-4', 'py-3', 'border', 'border-slate-300', 'rounded-xl', 'focus:outline-none', 'focus:ring-2', 'focus:ring-blue-500')}
                  >
                    <option value="Mr">Mr</option>
                    <option value="Mrs">Mrs</option>
                    <option value="Ms">Ms</option>
                    <option value="Dr">Dr</option>
                  </select>
                </div>

                <div className={cn('md:col-span-1', 'lg:col-span-3')}>
                  <label className={cn('block', 'text-sm', 'font-medium', 'text-slate-700', 'mb-2')}>
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={passenger.fullName}
                    onChange={(e) => handlePassengerChange(index, "fullName", e.target.value)}
                    placeholder="Enter full name"
                    className={cn('w-full', 'px-4', 'py-3', 'border', 'border-slate-300', 'rounded-xl', 'focus:outline-none', 'focus:ring-2', 'focus:ring-blue-500')}
                  />
                </div>

                <div>
                  <label className={cn('block', 'text-sm', 'font-medium', 'text-slate-700', 'mb-2')}>
                    Email
                  </label>
                  <input
                    type="email"
                    value={passenger.email}
                    onChange={(e) => handlePassengerChange(index, "email", e.target.value)}
                    placeholder="email@example.com"
                    className={cn('w-full', 'px-4', 'py-3', 'border', 'border-slate-300', 'rounded-xl', 'focus:outline-none', 'focus:ring-2', 'focus:ring-blue-500')}
                  />
                </div>

                <div>
                  <label className={cn('block', 'text-sm', 'font-medium', 'text-slate-700', 'mb-2')}>
                    Phone
                  </label>
                  <input
                    type="tel"
                    value={passenger.phone}
                    onChange={(e) => handlePassengerChange(index, "phone", e.target.value)}
                    placeholder="+91-9876543210"
                    className={cn('w-full', 'px-4', 'py-3', 'border', 'border-slate-300', 'rounded-xl', 'focus:outline-none', 'focus:ring-2', 'focus:ring-blue-500')}
                  />
                </div>

                <div>
                  <label className={cn('block', 'text-sm', 'font-medium', 'text-slate-700', 'mb-2')}>
                    Age
                  </label>
                  <input
                    type="number"
                    value={passenger.age}
                    onChange={(e) => handlePassengerChange(index, "age", e.target.value)}
                    placeholder="25"
                    className={cn('w-full', 'px-4', 'py-3', 'border', 'border-slate-300', 'rounded-xl', 'focus:outline-none', 'focus:ring-2', 'focus:ring-blue-500')}
                  />
                </div>

                <div>
                  <label className={cn('block', 'text-sm', 'font-medium', 'text-slate-700', 'mb-2')}>
                    Type
                  </label>
                  <select
                    value={passenger.type}
                    onChange={(e) => handlePassengerChange(index, "type", e.target.value)}
                    className={cn('w-full', 'px-4', 'py-3', 'border', 'border-slate-300', 'rounded-xl', 'focus:outline-none', 'focus:ring-2', 'focus:ring-blue-500')}
                  >
                    <option value="Adult">Adult</option>
                    <option value="Child">Child</option>
                    <option value="Infant">Infant</option>
                  </select>
                </div>

                <div>
                  <label className={cn('block', 'text-sm', 'font-medium', 'text-slate-700', 'mb-2')}>
                    Seat Number
                  </label>
                  <input
                    type="text"
                    value={passenger.seat}
                    onChange={(e) => handlePassengerChange(index, "seat", e.target.value)}
                    placeholder="e.g., A1"
                    className={cn('w-full', 'px-4', 'py-3', 'border', 'border-slate-300', 'rounded-xl', 'focus:outline-none', 'focus:ring-2', 'focus:ring-blue-500')}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className={cn('flex', 'gap-4', 'justify-end')}>
        <button
          onClick={() => router.push("/admin-dashboard/tickets")}
          className={cn('px-6', 'py-3', 'bg-slate-200', 'text-slate-700', 'rounded-xl', 'hover:bg-slate-300', 'transition-all', 'font-medium')}
        >
          Cancel
        </button>
        <button
          onClick={handlePreview}
          className={cn('flex', 'items-center', 'gap-2', 'px-6', 'py-3', 'bg-blue-500', 'text-white', 'rounded-xl', 'hover:bg-blue-600', 'transition-all', 'font-medium')}
        >
          <EyeIcon className={cn('w-5', 'h-5')} />
          Preview Ticket
        </button>
        <button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className={cn('flex', 'items-center', 'gap-2', 'px-6', 'py-3', 'bg-gradient-to-r', 'from-green-500', 'to-emerald-500', 'text-white', 'rounded-xl', 'hover:from-green-600', 'hover:to-emerald-600', 'transition-all', 'font-medium', 'disabled:opacity-50')}
        >
          <TicketIcon className={cn('w-5', 'h-5')} />
          {isSubmitting ? "Creating..." : "Create Ticket"}
        </button>
      </div>

      {/* Preview Modal */}
      {showPreview && (
        <div className={cn('fixed', 'inset-0', 'bg-black', 'bg-opacity-50', 'flex', 'items-center', 'justify-center', 'z-50', 'p-4')}>
          <div className={cn('bg-white', 'rounded-2xl', 'shadow-2xl', 'max-w-4xl', 'w-full', 'max-h-[90vh]', 'overflow-y-auto', 'relative')}>
            <button
              onClick={() => setShowPreview(false)}
              className={cn('absolute', 'top-4', 'right-4', 'z-10', 'w-8', 'h-8', 'bg-gray-100', 'hover:bg-gray-200', 'rounded-full', 'flex', 'items-center', 'justify-center', 'transition-colors')}
            >
              ×
            </button>
            <ProfessionalTicket {...getPreviewData()} />
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateTicketPage;
