"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import BASE_URL from "@/baseUrl/baseUrl";

// Loading component for Suspense fallback
const LoadingFallback = () => (
  <div style={{ 
    padding: "40px", 
    fontFamily: "'Inter', sans-serif",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "50vh"
  }}>
    <div style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: "16px"
    }}>
      <div style={{
        width: "32px",
        height: "32px",
        border: "3px solid #e2e8f0",
        borderTopColor: "#1e40af",
        borderRadius: "50%",
        animation: "spin 1s linear infinite"
      }} />
      <h1>Loading debug page...</h1>
    </div>
  </div>
);

// Main content component that uses useSearchParams
const DebugTicketContent = () => {
  const [apiData, setApiData] = useState(null);
  const [formattedData, setFormattedData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const searchParams = useSearchParams();
  const bookingId = searchParams.get("id");
  const pnr = searchParams.get("pnr");

  useEffect(() => {
    const fetchAndDebugData = async () => {
      try {
        setLoading(true);
        let url = `${BASE_URL}/tickets/get-ticket`;
        if (bookingId) url += `?id=${bookingId}`;
        else if (pnr) url += `?pnr=${pnr}`;
        
        const response = await fetch(url);
        
        if (!response.ok) {
          throw new Error(`API Error: ${response.status}`);
        }
        
        const result = await response.json();
        setApiData(result);
        
        if (result.success && result.data) {
          // Format the data exactly like the get-ticket page does
          const formatted = {
            bookingData: {
              id: result.data.flight.id,
              departure: result.data.flight.departure,
              arrival: result.data.flight.arrival,
              departureCode: result.data.flight.departureCode,
              arrivalCode: result.data.flight.arrivalCode,
              departureTime: result.data.flight.departureTime,
              arrivalTime: result.data.flight.arrivalTime,
              selectedDate: result.data.flight.selectedDate,
              totalPrice: result.data.flight.totalPrice || result.data.booking.totalFare,
              bookDate: result.data.booking.bookDate,
              flightId: result.data.flight.id
            },
            travelerDetails: result.data.passengers.map(passenger => ({
              title: passenger.title || "Mr",
              fullName: passenger.fullName || passenger.name,
              dateOfBirth: passenger.dateOfBirth,
              email: passenger.email || result.data.booking.email_id,
              phone: passenger.phone || result.data.booking.contact_no,
              address: passenger.address || ""
            })),
            bookingResult: {
              booking: {
                pnr: result.data.booking.pnr,
                bookingNo: result.data.booking.bookingNo,
                bookDate: result.data.booking.bookDate,
                paymentStatus: result.data.booking.paymentStatus,
                bookingStatus: result.data.booking.bookingStatus,
                totalFare: result.data.booking.totalFare,
                noOfPassengers: result.data.booking.noOfPassengers,
                contact_no: result.data.booking.contact_no,
                email_id: result.data.booking.email_id
              },
              passengers: result.data.passengers.map(passenger => ({
                age: passenger.age,
                type: passenger.type || "Adult",
                name: passenger.name,
                title: passenger.title
              })),
              payment: result.data.payment || {
                status: result.data.booking.paymentStatus,
                amount: result.data.booking.totalFare
              }
            }
          };
          
          setFormattedData(formatted);
        }
        
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAndDebugData();
  }, [bookingId, pnr]);

  if (loading) {
    return (
      <div style={{ padding: "40px", fontFamily: "'Inter', sans-serif" }}>
        <h1>Loading debug data...</h1>
      </div>
    );
  }

  return (
    <div style={{ 
      padding: "40px", 
      fontFamily: "'Inter', sans-serif",
      maxWidth: "1200px",
      margin: "0 auto"
    }}>
      <h1>Ticket Data Debug</h1>
      
      <div style={{ marginBottom: "20px" }}>
        <a href="/get-ticket" style={{ 
          padding: "10px 20px", 
          backgroundColor: "#1e40af", 
          color: "white", 
          textDecoration: "none", 
          borderRadius: "4px",
          marginRight: "10px"
        }}>
          Go to Get Ticket
        </a>
        <a href="/api-test" style={{ 
          padding: "10px 20px", 
          backgroundColor: "#059669", 
          color: "white", 
          textDecoration: "none", 
          borderRadius: "4px"
        }}>
          Test APIs
        </a>
      </div>

      {error && (
        <div style={{ 
          backgroundColor: "#fef2f2", 
          color: "#dc2626", 
          padding: "20px", 
          borderRadius: "8px", 
          marginBottom: "20px" 
        }}>
          <h2>Error:</h2>
          <p>{error}</p>
        </div>
      )}

      {apiData && (
        <div style={{ marginBottom: "40px" }}>
          <h2>Raw API Response:</h2>
          <div style={{ 
            backgroundColor: "#f8fafc", 
            padding: "20px", 
            borderRadius: "8px", 
            border: "1px solid #e2e8f0" 
          }}>
            <pre style={{ 
              backgroundColor: "white", 
              padding: "15px", 
              borderRadius: "4px", 
              overflow: "auto",
              fontSize: "12px",
              whiteSpace: "pre-wrap"
            }}>
              {JSON.stringify(apiData, null, 2)}
            </pre>
          </div>
        </div>
      )}

      {formattedData && (
        <div style={{ marginBottom: "40px" }}>
          <h2>Formatted Data for Ticket Component:</h2>
          <div style={{ 
            backgroundColor: "#f0f9ff", 
            padding: "20px", 
            borderRadius: "8px", 
            border: "1px solid #bae6fd" 
          }}>
            <pre style={{ 
              backgroundColor: "white", 
              padding: "15px", 
              borderRadius: "4px", 
              overflow: "auto",
              fontSize: "12px",
              whiteSpace: "pre-wrap"
            }}>
              {JSON.stringify(formattedData, null, 2)}
            </pre>
          </div>
        </div>
      )}

      <div style={{ 
        backgroundColor: "#f0fdf4", 
        padding: "20px", 
        borderRadius: "8px",
        border: "1px solid #bbf7d0"
      }}>
        <h2>Data Mapping Issues to Check:</h2>
        <ul>
          <li>Are departure/arrival airport names showing correctly?</li>
          <li>Are departure/arrival times formatted properly (HH:MM)?</li>
          <li>Is the flight date displaying correctly?</li>
          <li>Are passenger details complete (name, age, type)?</li>
          <li>Is the booking status and payment status showing?</li>
          <li>Is the total price displaying correctly?</li>
          <li>Are PNR and booking numbers showing?</li>
        </ul>
      </div>
    </div>
  );
};

// Main component with Suspense boundary
const DebugTicketPage = () => {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <DebugTicketContent />
    </Suspense>
  );
};

export default DebugTicketPage;