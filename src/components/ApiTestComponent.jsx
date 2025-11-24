"use client";

import { useState } from 'react';
import { useAuth } from './AuthContext';
import BASE_URL from '@/baseUrl/baseUrl';

const ApiTestComponent = () => {
  const { authState } = useAuth();
  const [testResults, setTestResults] = useState({});
  const [testing, setTesting] = useState(false);

  const testEndpoint = async (endpoint, name) => {
    try {
      const token = localStorage.getItem("token") || authState.token || "";
      
      const response = await fetch(`${BASE_URL}${endpoint}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const result = {
        status: response.status,
        statusText: response.statusText,
        ok: response.ok,
        headers: Object.fromEntries(response.headers.entries()),
      };

      if (response.ok) {
        try {
          const data = await response.json();
          result.data = Array.isArray(data) ? `Array with ${data.length} items` : typeof data;
          result.success = true;
        } catch (e) {
          result.data = "Failed to parse JSON";
          result.success = false;
        }
      } else {
        try {
          const errorData = await response.text();
          result.error = errorData;
        } catch (e) {
          result.error = "Failed to read error response";
        }
        result.success = false;
      }

      return result;
    } catch (error) {
      return {
        success: false,
        error: error.message,
        status: 'Network Error'
      };
    }
  };

  const runTests = async () => {
    setTesting(true);
    setTestResults({});

    const endpoints = [
      { path: '/users', name: 'Users' },
      { path: '/bookings?status=Confirmed', name: 'Bookings' },
      { path: '/airport', name: 'Airports' },
      { path: '/flights', name: 'Flights' },
      { path: '/agents', name: 'Agents' },
    ];

    const results = {};
    
    for (const endpoint of endpoints) {
      results[endpoint.name] = await testEndpoint(endpoint.path, endpoint.name);
      setTestResults({ ...results });
    }

    setTesting(false);
  };

  if (!authState.isLoggedIn || authState.userRole !== "1") {
    return null;
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-slate-800">API Connection Test</h3>
        <button
          onClick={runTests}
          disabled={testing}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
        >
          {testing ? "Testing..." : "Test APIs"}
        </button>
      </div>

      <div className="space-y-3">
        <div className="text-sm text-slate-600">
          <strong>Base URL:</strong> {BASE_URL}
        </div>
        <div className="text-sm text-slate-600">
          <strong>Auth Token:</strong> {localStorage.getItem("token") ? "Present" : "Missing"}
        </div>
        <div className="text-sm text-slate-600">
          <strong>User Role:</strong> {authState.userRole}
        </div>
      </div>

      {Object.keys(testResults).length > 0 && (
        <div className="mt-6 space-y-3">
          <h4 className="font-semibold text-slate-800">Test Results:</h4>
          {Object.entries(testResults).map(([name, result]) => (
            <div key={name} className={`p-3 rounded-lg border ${
              result.success ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
            }`}>
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium">{name}</span>
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  result.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {result.status}
                </span>
              </div>
              {result.success ? (
                <div className="text-sm text-green-700">
                  ✅ Success - {result.data}
                </div>
              ) : (
                <div className="text-sm text-red-700">
                  ❌ Failed - {result.error || result.statusText}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ApiTestComponent;