"use client";

import { useState } from 'react';
import { useAuth } from './AuthContext';
import BASE_URL from '@/baseUrl/baseUrl';

const AdminDebugPanel = () => {
  const { authState } = useAuth();
  const [testResults, setTestResults] = useState({});
  const [testing, setTesting] = useState(false);
  const [showPanel, setShowPanel] = useState(false);

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
        url: `${BASE_URL}${endpoint}`,
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
        status: 'Network Error',
        url: `${BASE_URL}${endpoint}`,
      };
    }
  };

  const runTests = async () => {
    setTesting(true);
    setTestResults({});

    const endpoints = [
      { path: '/users/test', name: 'Users Test (No Auth)' },
      { path: '/users/all', name: 'Users (Auth Required)' },
      { path: '/bookings?status=Confirmed', name: 'Bookings' },
      { path: '/airport', name: 'Airports' },
      { path: '/flights', name: 'Flights' },
      { path: '/agents', name: 'Agents' },
      { path: '/payments', name: 'Payments' },
      { path: '/booked-seat', name: 'Booked Seats' },
      { path: '/passenger', name: 'Passengers' },
      { path: '/api/joyride-slots', name: 'Joy Ride Slots (No Auth)' },
    ];

    const results = {};
    
    for (const endpoint of endpoints) {
      results[endpoint.name] = await testEndpoint(endpoint.path, endpoint.name);
      setTestResults({ ...results });
      // Small delay to avoid overwhelming the server
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    setTesting(false);
  };

  if (!authState.isLoggedIn || authState.userRole !== "1") {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {!showPanel ? (
        <button
          onClick={() => setShowPanel(true)}
          className="bg-red-600 text-white p-3 rounded-full shadow-lg hover:bg-red-700 transition-colors"
          title="Debug Panel"
        >
          🔧
        </button>
      ) : (
        <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 p-6 w-96 max-h-96 overflow-y-auto">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-slate-800">API Debug Panel</h3>
            <button
              onClick={() => setShowPanel(false)}
              className="text-slate-400 hover:text-slate-600"
            >
              ✕
            </button>
          </div>

          <div className="space-y-3 mb-4">
            <div className="text-sm">
              <strong>Base URL:</strong> <code className="bg-slate-100 px-1 rounded">{BASE_URL}</code>
            </div>
            <div className="text-sm">
              <strong>Auth Token:</strong> {localStorage.getItem("token") ? "✅ Present" : "❌ Missing"}
            </div>
            <div className="text-sm">
              <strong>User Role:</strong> {authState.userRole}
            </div>
          </div>

          <button
            onClick={runTests}
            disabled={testing}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors mb-4"
          >
            {testing ? "Testing..." : "Test All APIs"}
          </button>

          {Object.keys(testResults).length > 0 && (
            <div className="space-y-2 max-h-48 overflow-y-auto">
              <h4 className="font-semibold text-slate-800 text-sm">Results:</h4>
              {Object.entries(testResults).map(([name, result]) => (
                <div key={name} className={`p-2 rounded text-xs border ${
                  result.success ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
                }`}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium">{name}</span>
                    <span className={`px-1 py-0.5 rounded text-xs ${
                      result.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {result.status}
                    </span>
                  </div>
                  <div className="text-xs text-slate-600 mb-1">
                    {result.url}
                  </div>
                  {result.success ? (
                    <div className="text-green-700">
                      ✅ {result.data}
                    </div>
                  ) : (
                    <div className="text-red-700">
                      ❌ {result.error || result.statusText}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminDebugPanel;