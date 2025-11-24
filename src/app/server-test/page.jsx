"use client";

import React, { useState, useEffect } from "react";
import BASE_URL from "@/baseUrl/baseUrl";

const ServerTestPage = () => {
  const [serverStatus, setServerStatus] = useState("checking");
  const [error, setError] = useState(null);

  useEffect(() => {
    const checkServer = async () => {
      try {
        const response = await fetch(`${BASE_URL}/`);
        if (response.ok) {
          const data = await response.json();
          setServerStatus("online");
        } else {
          setServerStatus("error");
          setError(`Server responded with status: ${response.status}`);
        }
      } catch (err) {
        setServerStatus("offline");
        setError(err.message);
      }
    };

    checkServer();
  }, []);

  return (
    <div style={{ 
      padding: "40px", 
      fontFamily: "'Inter', sans-serif",
      maxWidth: "800px",
      margin: "0 auto"
    }}>
      <h1>Backend Server Status</h1>
      
      <div style={{
        padding: "20px",
        borderRadius: "8px",
        marginBottom: "20px",
        backgroundColor: 
          serverStatus === "online" ? "#f0fdf4" : 
          serverStatus === "offline" ? "#fef2f2" : 
          "#fefce8"
      }}>
        <h2>Server Status: 
          <span style={{
            color: 
              serverStatus === "online" ? "#15803d" : 
              serverStatus === "offline" ? "#dc2626" : 
              "#d97706"
          }}>
            {serverStatus === "online" ? "🟢 ONLINE" : 
             serverStatus === "offline" ? "🔴 OFFLINE" : 
             "🟡 CHECKING..."}
          </span>
        </h2>
        
        <p><strong>Base URL:</strong> {BASE_URL}</p>
        
        {error && (
          <p style={{ color: "#dc2626" }}><strong>Error:</strong> {error}</p>
        )}
      </div>

      <div style={{ 
        backgroundColor: "#f8fafc", 
        padding: "20px", 
        borderRadius: "8px",
        marginBottom: "20px"
      }}>
        <h3>Quick Fixes:</h3>
        <ol>
          <li><strong>Start Backend Server:</strong>
            <pre style={{ backgroundColor: "white", padding: "10px", borderRadius: "4px", margin: "10px 0" }}>
              cd Flyola-MP-backend{"\n"}
              npm start
              {"\n"}# or{"\n"}
              node app.js
            </pre>
          </li>
          <li><strong>Check Port:</strong> Make sure your backend is running on port 4000</li>
          <li><strong>Check CORS:</strong> Ensure CORS is configured for localhost:3000</li>
        </ol>
      </div>

      <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
        <a 
          href="/api-test" 
          style={{
            display: "inline-block",
            padding: "10px 20px",
            backgroundColor: "#1e40af",
            color: "white",
            textDecoration: "none",
            borderRadius: "4px"
          }}
        >
          Test All APIs
        </a>
        <a 
          href="/get-ticket" 
          style={{
            display: "inline-block",
            padding: "10px 20px",
            backgroundColor: "#059669",
            color: "white",
            textDecoration: "none",
            borderRadius: "4px"
          }}
        >
          Go to Get Ticket
        </a>
        <button
          onClick={() => window.location.reload()}
          style={{
            padding: "10px 20px",
            backgroundColor: "#d97706",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer"
          }}
        >
          Refresh Status
        </button>
      </div>

      {serverStatus === "offline" && (
        <div style={{
          marginTop: "20px",
          padding: "20px",
          backgroundColor: "#fef2f2",
          borderRadius: "8px",
          border: "1px solid #fecaca"
        }}>
          <h3 style={{ color: "#dc2626" }}>Server is Offline</h3>
          <p>Your backend server is not running. Please start it by running:</p>
          <pre style={{ backgroundColor: "white", padding: "15px", borderRadius: "4px" }}>
            cd Flyola-MP-backend{"\n"}
            node app.js
          </pre>
          <p>Make sure it shows: "Server is running on port 4000"</p>
        </div>
      )}
    </div>
  );
};

export default ServerTestPage;