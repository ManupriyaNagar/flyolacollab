"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import BASE_URL from "@/baseUrl/baseUrl";

const PnrStatusPage = () => {
  const [pnr, setPnr] = useState("");
  const [bookingDetails, setBookingDetails] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleCheckStatus = async () => {
    setLoading(true);
    setError(null);
    setBookingDetails(null);

    if (!pnr || pnr.trim().length < 6) {
      setError("Please enter a valid PNR number (at least 6 characters).");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${BASE_URL}/bookings/pnr?pnr=${encodeURIComponent(pnr)}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || "Failed to fetch booking details");
      }

      if (!result) {
        throw new Error("No booking found for this PNR");
      }

      setBookingDetails(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (!bookingDetails) return;

    const summary = `
      Booking Details
      ---------------
      PNR: ${bookingDetails.pnr}
      Booking Number: ${bookingDetails.bookingNo}
      Status: ${bookingDetails.bookingStatus}
      Contact: ${bookingDetails.contact_no} | ${bookingDetails.email_id}
      Total Fare: ₹${bookingDetails.totalFare}
      Passengers: ${bookingDetails.noOfPassengers}
      Seats: ${bookingDetails.seatLabels?.join(", ") || "N/A"}
      Schedule ID: ${bookingDetails.schedule_id}
      Booking Date: ${bookingDetails.bookDate}
      Agent Type: ${bookingDetails.agent_type || "N/A"}
      Created At: ${new Date(bookingDetails.created_at).toLocaleString()}
      Updated At: ${new Date(bookingDetails.updated_at).toLocaleString()}

      Passengers:
      ${bookingDetails.Passengers?.map(
        (p) => `- ${p.title} ${p.name} (${p.type}, Age: ${p.age}, DOB: ${p.dob})`
      ).join("\n") || "N/A"}

      Flight Schedule:
      ${bookingDetails.FlightSchedule
        ? `Flight ID: ${bookingDetails.FlightSchedule.flight_id}, Departure: ${bookingDetails.FlightSchedule.departure_time}, Arrival: ${bookingDetails.FlightSchedule.arrival_time}, Price: ₹${bookingDetails.FlightSchedule.price}`
        : "N/A"}

      Billing:
      ${bookingDetails.billing
        ? `Name: ${bookingDetails.billing.billing_name}, Email: ${bookingDetails.billing.billing_email}, Number: ${bookingDetails.billing.billing_number}, Address: ${bookingDetails.billing.billing_address}, Country: ${bookingDetails.billing.billing_country}`
        : "N/A"}

      Payment:
      ${bookingDetails.Payments?.length
        ? bookingDetails.Payments.map((p) => `Amount: ₹${p.pay_amt}, Status: ${p.paymentStatus}, Mode: ${p.pay_mode || "N/A"}`).join("\n")
        : `Status: ${bookingDetails.paymentStatus || "PENDING"}, Amount: ${bookingDetails.pay_amt || "N/A"}`}
    `;

    const blob = new Blob([summary], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `PNR_${bookingDetails.pnr}_Status.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
      <div className="shadow-lg rounded-lg w-full max-w-3xl p-6 bg-white">
        <h1 className="text-2xl sm:text-3xl font-semibold text-blue-900 mb-6">
          Check PNR Status
        </h1>

        <div className="mb-6">
          <p className="text-base sm:text-lg text-blue-900 mb-4">
            Enter your PNR number to view booking details
          </p>
          <div>
            <label htmlFor="pnr" className="block text-blue-900 font-semibold">
              PNR Number
            </label>
            <input
              type="text"
              id="pnr"
              value={pnr}
              onChange={(e) => setPnr(e.target.value)}
              className="mt-2 p-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter PNR (e.g., E95G8O)"
            />
          </div>
          {error && <p className="mt-2 text-red-600">{error}</p>}
          <div className="mt-6 text-center">
            <button
              onClick={handleCheckStatus}
              disabled={loading}
              className={`px-4 sm:px-6 py-2 rounded-lg shadow-md transition duration-300 ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-500 text-white hover:bg-blue-600"
              }`}
            >
              {loading ? "Checking..." : "Check Status"}
            </button>
          </div>
        </div>

        {bookingDetails && (
          <div className="mt-8 p-4 bg-gray-50 rounded-lg">
            <h2 className="text-xl font-semibold text-blue-900 mb-4">
              Booking Details
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <p><strong>PNR:</strong> {bookingDetails.pnr}</p>
                <p><strong>Booking Number:</strong> {bookingDetails.bookingNo}</p>
                <p><strong>Status:</strong> {bookingDetails.bookingStatus}</p>
                <p><strong>Contact:</strong> {bookingDetails.contact_no}</p>
                <p><strong>Email:</strong> {bookingDetails.email_id}</p>
                <p><strong>Total Fare:</strong> ₹{bookingDetails.totalFare}</p>
                <p><strong>Passengers:</strong> {bookingDetails.noOfPassengers}</p>
              </div>
              <div>
                <p><strong>Seats:</strong> {bookingDetails.seatLabels?.join(", ") || "N/A"}</p>
                <p><strong>Schedule ID:</strong> {bookingDetails.schedule_id}</p>
                <p><strong>Booking Date:</strong> {bookingDetails.bookDate}</p>
                <p><strong>Agent Type:</strong> {bookingDetails.agent_type || "N/A"}</p>
                {bookingDetails.FlightSchedule && (
                  <p>
                    <strong>Flight:</strong> ID {bookingDetails.FlightSchedule.flight_id}, 
                    Dep {bookingDetails.FlightSchedule.departure_time}, 
                    Arr {bookingDetails.FlightSchedule.arrival_time}
                  </p>
                )}
                <p>
                  <strong>Payment:</strong> {bookingDetails.paymentStatus || "PENDING"} 
                  {bookingDetails.pay_amt ? `, ₹${bookingDetails.pay_amt}` : ""}
                </p>
              </div>
            </div>

            <div className="mt-4">
              <h3 className="text-lg font-semibold text-blue-900">Passengers</h3>
              <ul className="list-disc pl-5">
                {bookingDetails.Passengers?.map((p, i) => (
                  <li key={i}>
                    {p.title} {p.name} ({p.type}, Age: {p.age}, DOB: {p.dob})
                  </li>
                )) || <li>No passengers found</li>}
              </ul>
            </div>

            {bookingDetails.billing && (
              <div className="mt-4">
                <h3 className="text-lg font-semibold text-blue-900">Billing</h3>
                <p><strong>Name:</strong> {bookingDetails.billing.billing_name}</p>
                <p><strong>Email:</strong> {bookingDetails.billing.billing_email}</p>
                <p><strong>Number:</strong> {bookingDetails.billing.billing_number}</p>
                <p><strong>Address:</strong> {bookingDetails.billing.billing_address}, {bookingDetails.billing.billing_state}, {bookingDetails.billing.billing_country}</p>
              </div>
            )}

            <div className="mt-6 text-center">
              <button
                onClick={handleDownload}
                className="px-4 sm:px-6 py-2 bg-green-500 text-white rounded-lg shadow-md hover:bg-green-600 focus:outline-none transition duration-300"
              >
                Download Summary
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PnrStatusPage;