"use client";

import { useState } from 'react';
import BASE_URL from '@/baseUrl/baseUrl';

export default function DebugAPI() {
  const [results, setResults] = useState({});
  const [loading, setLoading] = useState(false);

  const testAPI = async () => {
    setLoading(true);
    const token = localStorage.getItem("token");
    
    
    if (!token) {
      setResults({ error: "No token found in localStorage" });
      setLoading(false);
      return;
    }

    const commonOpts = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      credentials: 'include',
    };

    try {
      // Test users endpoint
      const usersRes = await fetch(`${BASE_URL}/users`, commonOpts);
      
      if (usersRes.ok) {
        const usersData = await usersRes.json();
        setResults({
          success: true,
          usersCount: Array.isArray(usersData) ? usersData.length : 0,
          usersData: usersData.slice(0, 3), // First 3 users
          token: token.substring(0, 50) + "...",
          baseUrl: BASE_URL
        });
      } else {
        const errorText = await usersRes.text();
        setResults({
          error: `API Error: ${usersRes.status} - ${errorText}`,
          token: token.substring(0, 50) + "...",
          baseUrl: BASE_URL
        });
      }
    } catch (err) {
      setResults({
        error: `Network Error: ${err.message}`,
        token: token ? token.substring(0, 50) + "..." : "No token",
        baseUrl: BASE_URL
      });
    }
    
    setLoading(false);
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">API Debug Page</h1>
      
      <button 
        onClick={testAPI}
        disabled={loading}
        className="bg-blue-500 text-white px-4 py-2 rounded mb-4 disabled:opacity-50"
      >
        {loading ? "Testing..." : "Test Users API"}
      </button>

      <div className="bg-gray-100 p-4 rounded">
        <h2 className="font-bold mb-2">Results:</h2>
        <pre className="text-sm overflow-auto">
          {JSON.stringify(results, null, 2)}
        </pre>
      </div>

      <div className="mt-4">
        <h3 className="font-bold">Instructions:</h3>
        <ol className="list-decimal list-inside">
          <li>First login at <a href="/sign-in" className="text-blue-500">/sign-in</a> with admin credentials</li>
          <li>Then come back here and click "Test Users API"</li>
          <li>Check the results to see what's happening</li>
        </ol>
      </div>
    </div>
  );
}