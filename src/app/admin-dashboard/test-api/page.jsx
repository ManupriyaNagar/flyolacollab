"use client";

import { useState } from "react";
import BASE_URL from "@/baseUrl/baseUrl";

export default function TestAPIPage() {
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const testAgentsAPI = async () => {
    setLoading(true);
    setResult('Testing...');
    
    try {
      const response = await fetch(`${BASE_URL}/agents`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      setResult(JSON.stringify(data, null, 2));
    } catch (error) {
      setResult(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const testAgentBookingsAPI = async () => {
    setLoading(true);
    setResult('Testing agent bookings...');
    
    try {
      const agentId = 1; // Test with agent ID 1
      const url = `${BASE_URL}/agents/${agentId}/bookings?page=1&limit=10`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status}, body: ${errorText}`);
      }
      
      const data = await response.json();
      
      setResult(JSON.stringify(data, null, 2));
    } catch (error) {
      setResult(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">API Test Page</h1>
      
      <div className="space-y-4 mb-6">
        <div>
          <strong>Base URL:</strong> {BASE_URL}
        </div>
        <div>
          <strong>Environment:</strong> {process.env.NODE_ENV}
        </div>
      </div>
      
      <div className="space-x-4 mb-6">
        <button
          onClick={testAgentsAPI}
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Testing...' : 'Test Agents API'}
        </button>
        
        <button
          onClick={testAgentBookingsAPI}
          disabled={loading}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
        >
          {loading ? 'Testing...' : 'Test Agent Bookings API'}
        </button>
      </div>
      
      <div className="bg-gray-100 p-4 rounded-lg">
        <h3 className="font-bold mb-2">Result:</h3>
        <pre className="whitespace-pre-wrap text-sm overflow-auto max-h-96">
          {result || 'Click a button to test the API'}
        </pre>
      </div>
    </div>
  );
}