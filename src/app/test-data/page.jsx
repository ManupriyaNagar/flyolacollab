"use client";

import React, { useState, useEffect } from "react";
import BASE_URL from "@/baseUrl/baseUrl";

const TestDataPage = () => {
  const [testData, setTestData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTestData = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${BASE_URL}/tickets/test-data`);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch test data: ${response.status}`);
        }
        
        const result = await response.json();
        setTestData(result);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTestData();
  }, []);

  if (loading) {
    return (
      <div style={{ 
        padding: "40px", 
        fontFamily: "'Inter', sans-serif",
        maxWidth: "1200px",
        margin: "0 auto"
      }}>
        <h1>Loading test data...</h1>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ 
        padding: "40px", 
        fontFamily: "'Inter', sans-serif",
        maxWidth: "1200px",
        margin: "0 auto"
      }}>
        <h1 style={{ color: "red" }}>Error: {error}</h1>
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
      <h1>Database Test Results</h1>
      
      <div style={{ 
        backgroundColor: "#f8fafc", 
        padding: "20px", 
        borderRadius: "8px", 
        marginBottom: "20px" 
      }}>
        <h2>Database Counts</h2>
        <ul>
          <li>Bookings: {testData?.counts?.bookings || 0}</li>
          <li>Passengers: {testData?.counts?.passengers || 0}</li>
          <li>Flight Schedules: {testData?.counts?.flightSchedules || 0}</li>
          <li>Airports: {testData?.counts?.airports || 0}</li>
        </ul>
      </div>

      {testData?.latestBooking && (
        <div style={{ 
          backgroundColor: "#f0f9ff", 
          padding: "20px", 
          borderRadius: "8px", 
          marginBottom: "20px" 
        }}>
          <h2>Latest Booking</h2>
          <pre style={{ 
            backgroundColor: "white", 
            padding: "15px", 
            borderRadius: "4px", 
            overflow: "auto",
            fontSize: "12px"
          }}>
            {JSON.stringify(testData.latestBooking, null, 2)}
          </pre>
        </div>
      )}

      <div style={{ 
        backgroundColor: "#f0fdf4", 
        padding: "20px", 
        borderRadius: "8px" 
      }}>
        <h2>Status</h2>
        <p style={{ color: "green", fontWeight: "600" }}>
          {testData?.message || "Database connection successful"}
        </p>
      </div>

      <div style={{ marginTop: "20px" }}>
        <a 
          href="/get-ticket" 
          style={{
            display: "inline-block",
            padding: "10px 20px",
            backgroundColor: "#1e40af",
            color: "white",
            textDecoration: "none",
            borderRadius: "4px",
            marginRight: "10px"
          }}
        >
          Go to Get Ticket Page
        </a>
        <a 
          href={`${BASE_URL}/tickets/bookings`} 
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "inline-block",
            padding: "10px 20px",
            backgroundColor: "#059669",
            color: "white",
            textDecoration: "none",
            borderRadius: "4px"
          }}
        >
          View All Bookings (API)
        </a>
      </div>
    </div>
  );
};

export default TestDataPage;