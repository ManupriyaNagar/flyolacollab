"use client";

import BASE_URL from "@/baseUrl/baseUrl";
import { cn } from "@/lib/utils";
import { useState } from "react";

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

  const testCitiesAPI = async () => {
    setLoading(true);
    setResult('Testing cities API...');
    
    try {
      const response = await API.hotels.getCities();
      setResult(JSON.stringify(response, null, 2));
    } catch (error) {
      setResult(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const testHotelsAPI = async () => {
    setLoading(true);
    setResult('Testing hotels API...');
    
    try {
      const response = await API.hotels.getHotels();
      setResult(JSON.stringify(response, null, 2));
    } catch (error) {
      setResult(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const testRoomsAPI = async () => {
    setLoading(true);
    setResult('Testing rooms API...');
    
    try {
      const response = await API.hotels.getRooms();
      setResult(JSON.stringify(response, null, 2));
    } catch (error) {
      setResult(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const testRoomCategoriesAPI = async () => {
    setLoading(true);
    setResult('Testing room categories API...');
    
    try {
      const response = await API.hotels.getRoomCategories();
      setResult(JSON.stringify(response, null, 2));
    } catch (error) {
      setResult(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const testReviewsAPI = async () => {
    setLoading(true);
    setResult('Testing reviews API...');
    
    try {
      const response = await API.hotels.getAllHotelReviews();
      setResult(JSON.stringify(response, null, 2));
    } catch (error) {
      setResult(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h1 className={cn('text-2xl', 'font-bold', 'mb-6')}>API Test Page</h1>
      
      <div className={cn('space-y-4', 'mb-6')}>
        <div>
          <strong>Node.js API URL:</strong> {BASE_URL}
        </div>
        <div>
          <strong>Go API URL:</strong> {GO_BASE_URL}
        </div>
        <div>
          <strong>Environment:</strong> {process.env.NODE_ENV}
        </div>
      </div>
      
      <div className={cn('mb-6')}>
        <h3 className={cn('text-lg', 'font-semibold', 'mb-3')}>Node.js Backend Tests (Port 4000)</h3>
        <div className={cn('space-x-4', 'mb-4')}>
          <button
            onClick={testAgentsAPI}
            disabled={loading}
            className={cn('px-4', 'py-2', 'bg-blue-600', 'text-white', 'rounded-lg', 'hover:bg-blue-700', 'disabled:opacity-50')}
          >
            {loading ? 'Testing...' : 'Test Agents API'}
          </button>
          
          <button
            onClick={testAgentBookingsAPI}
            disabled={loading}
            className={cn('px-4', 'py-2', 'bg-green-600', 'text-white', 'rounded-lg', 'hover:bg-green-700', 'disabled:opacity-50')}
          >
            {loading ? 'Testing...' : 'Test Agent Bookings API'}
          </button>
        </div>

        <h3 className={cn('text-lg', 'font-semibold', 'mb-3')}>Go Backend Tests (Port 8080)</h3>
        <div className={cn('grid', 'grid-cols-2', 'md:grid-cols-5', 'gap-4')}>
          <button
            onClick={testCitiesAPI}
            disabled={loading}
            className={cn('px-4', 'py-2', 'bg-purple-600', 'text-white', 'rounded-lg', 'hover:bg-purple-700', 'disabled:opacity-50')}
          >
            {loading ? 'Testing...' : 'Test Cities API'}
          </button>
          
          <button
            onClick={testHotelsAPI}
            disabled={loading}
            className={cn('px-4', 'py-2', 'bg-indigo-600', 'text-white', 'rounded-lg', 'hover:bg-indigo-700', 'disabled:opacity-50')}
          >
            {loading ? 'Testing...' : 'Test Hotels API'}
          </button>

          <button
            onClick={testRoomsAPI}
            disabled={loading}
            className={cn('px-4', 'py-2', 'bg-teal-600', 'text-white', 'rounded-lg', 'hover:bg-teal-700', 'disabled:opacity-50')}
          >
            {loading ? 'Testing...' : 'Test Rooms API'}
          </button>

          <button
            onClick={testRoomCategoriesAPI}
            disabled={loading}
            className={cn('px-4', 'py-2', 'bg-orange-600', 'text-white', 'rounded-lg', 'hover:bg-orange-700', 'disabled:opacity-50')}
          >
            {loading ? 'Testing...' : 'Test Categories API'}
          </button>

          <button
            onClick={testReviewsAPI}
            disabled={loading}
            className={cn('px-4', 'py-2', 'bg-pink-600', 'text-white', 'rounded-lg', 'hover:bg-pink-700', 'disabled:opacity-50')}
          >
            {loading ? 'Testing...' : 'Test Reviews API'}
          </button>
        </div>
      </div>
      
      <div className={cn('bg-gray-100', 'p-4', 'rounded-lg')}>
        <h3 className={cn('font-bold', 'mb-2')}>Result:</h3>
        <pre className={cn('whitespace-pre-wrap', 'text-sm', 'overflow-auto', 'max-h-96')}>
          {result || 'Click a button to test the API'}
        </pre>
      </div>
    </div>
  );
}