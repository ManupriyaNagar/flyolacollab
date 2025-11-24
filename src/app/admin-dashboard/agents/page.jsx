"use client";

import { useState, useEffect } from "react";
import { 
  FaUserShield, 
  FaWallet, 
  FaTicketAlt, 
  FaPlus, 
  FaMinus, 
  FaEye, 
  FaSearch,
  FaFilter,
  FaDownload,
  FaRedo
} from "react-icons/fa";
import { 
  Wallet, 
  Users, 
  TrendingUp, 
  Calendar,
  DollarSign,
  Activity
} from "lucide-react";
import BASE_URL from "@/baseUrl/baseUrl";

export default function AgentsPage() {
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [showWalletModal, setShowWalletModal] = useState(false);
  const [walletAction, setWalletAction] = useState('add');
  const [walletAmount, setWalletAmount] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [dashboardData, setDashboardData] = useState(null);

  // Fetch agents data
  const fetchAgents = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${BASE_URL}/agents`, {
        credentials: 'include',
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch agents');
      }
      
      const data = await response.json();
      setAgents(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch dashboard data
  const fetchDashboardData = async () => {
    try {
      const response = await fetch(`${BASE_URL}/agents/admin/dashboard`, {
        credentials: 'include',
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch dashboard data');
      }
      
      const data = await response.json();
      setDashboardData(data.data);
    } catch (err) {
    }
  };

  // Handle wallet operations
  const handleWalletOperation = async () => {
    if (!selectedAgent || !walletAmount || parseFloat(walletAmount) <= 0) {
      alert('Please enter a valid amount');
      return;
    }

    try {
      const endpoint = walletAction === 'add' ? `${BASE_URL}/agents/wallet/add` : `${BASE_URL}/agents/wallet/deduct`;
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          agentId: selectedAgent.id,
          amount: parseFloat(walletAmount),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update wallet');
      }

      const result = await response.json();
      alert(result.message);
      
      // Refresh agents data
      fetchAgents();
      setShowWalletModal(false);
      setWalletAmount('');
    } catch (err) {
      alert(err.message);
    }
  };



  // Recalculate agent statistics
  const recalculateStats = async () => {
    try {
      const response = await fetch(`${BASE_URL}/agents/recalculate-stats`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to recalculate statistics');
      }

      const result = await response.json();
      alert(`Statistics recalculated successfully! Updated ${result.results.filter(r => r.updated).length} agents.`);
      
      // Refresh agents data
      fetchAgents();
      fetchDashboardData();
    } catch (err) {
      alert(`Error: ${err.message}`);
    }
  };

  // Filter agents based on search term
  const filteredAgents = agents.filter(agent =>
    agent.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    agent.agentId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    fetchAgents();
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        {/* Header Skeleton */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="h-8 w-48 bg-gray-200 rounded animate-pulse mb-2"></div>
            <div className="h-4 w-64 bg-gray-200 rounded animate-pulse"></div>
          </div>
          <div className="h-10 w-32 bg-gray-200 rounded-lg animate-pulse"></div>
        </div>

        {/* Stats Cards Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <div className="h-4 w-20 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-8 w-12 bg-gray-200 rounded animate-pulse"></div>
                </div>
                <div className="h-12 w-12 bg-gray-200 rounded-lg animate-pulse"></div>
              </div>
            </div>
          ))}
        </div>

        {/* Table Skeleton */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-4 border-b bg-gray-50">
            <div className="flex space-x-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-4 flex-1 bg-gray-200 rounded animate-pulse"></div>
              ))}
            </div>
          </div>
          <div className="divide-y">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="p-4">
                <div className="flex space-x-4">
                  {Array.from({ length: 6 }).map((_, j) => (
                    <div key={j} className="h-4 flex-1 bg-gray-200 rounded animate-pulse"></div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-600">Error: {error}</p>
        <button 
          onClick={fetchAgents}
          className="mt-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <FaUserShield className="text-blue-600" />
            Agent Management
          </h1>
          <p className="text-gray-600 mt-1">Manage agents, wallets, and bookings</p>
        </div>
        
        <div className="flex items-center gap-3">
          <button
            onClick={recalculateStats}
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            <FaRedo className="text-sm" />
            Recalculate Stats
          </button>
          <button
            onClick={fetchAgents}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <FaRedo className="text-sm" />
            Refresh
          </button>
        </div>
      </div>

      {/* Dashboard Stats */}
      {dashboardData && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm">Total Agents</p>
                <p className="text-2xl font-bold">{dashboardData.summary.totalAgents}</p>
              </div>
              <Users className="h-8 w-8 text-blue-200" />
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm">Total Wallet Amount</p>
                <p className="text-2xl font-bold">₹{dashboardData.summary.totalWalletAmount.toLocaleString()}</p>
              </div>
              <Wallet className="h-8 w-8 text-green-200" />
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm">Total Tickets Booked</p>
                <p className="text-2xl font-bold">{dashboardData.summary.totalTicketsBooked}</p>
              </div>
              <FaTicketAlt className="h-8 w-8 text-purple-200" />
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100 text-sm">Active Agents</p>
                <p className="text-2xl font-bold">{agents.filter(a => a.wallet_amount > 0).length}</p>
              </div>
              <Activity className="h-8 w-8 text-orange-200" />
            </div>
          </div>
        </div>
      )}

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search agents by name or ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Agents Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Agent Details
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Wallet Balance
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tickets Booked
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredAgents.map((agent) => (
                <tr key={agent.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-400 to-blue-600 flex items-center justify-center">
                          <FaUserShield className="text-white text-sm" />
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{agent.username}</div>
                        <div className="text-sm text-gray-500">ID: {agent.agentId}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <FaWallet className="text-green-500 mr-2" />
                      <span className="text-sm font-medium text-gray-900">
                        ₹{agent.wallet_amount.toLocaleString()}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <FaTicketAlt className="text-blue-500 mr-2" />
                      <span className="text-sm text-gray-900">{agent.no_of_ticket_booked}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setSelectedAgent(agent);
                          setWalletAction('add');
                          setShowWalletModal(true);
                        }}
                        className="flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors"
                      >
                        <FaPlus className="text-xs" />
                        Add Money
                      </button>
                      <button
                        onClick={() => {
                          setSelectedAgent(agent);
                          setWalletAction('deduct');
                          setShowWalletModal(true);
                        }}
                        className="flex items-center gap-1 px-3 py-1 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                      >
                        <FaMinus className="text-xs" />
                        Deduct
                      </button>
                      <button
                        onClick={() => window.open(`/admin-dashboard/agent-bookings?agentId=${agent.id}`, '_blank')}
                        className="flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
                      >
                        <FaEye className="text-xs" />
                        View Bookings
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {filteredAgents.length === 0 && (
          <div className="text-center py-12">
            <FaUserShield className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No agents found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm ? 'Try adjusting your search terms.' : 'No agents have been created yet.'}
            </p>
          </div>
        )}
      </div>

      {/* Wallet Modal */}
      {showWalletModal && selectedAgent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {walletAction === 'add' ? 'Add Money to Wallet' : 'Deduct Money from Wallet'}
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Agent: {selectedAgent.username}
                </label>
                <p className="text-sm text-gray-500">
                  Current Balance: ₹{selectedAgent.wallet_amount.toLocaleString()}
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Amount (₹)
                </label>
                <input
                  type="number"
                  value={walletAmount}
                  onChange={(e) => setWalletAmount(e.target.value)}
                  placeholder="Enter amount"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  min="0"
                  step="0.01"
                />
              </div>
            </div>
            
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => {
                  setShowWalletModal(false);
                  setWalletAmount('');
                }}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleWalletOperation}
                className={`px-4 py-2 text-white rounded-lg transition-colors ${
                  walletAction === 'add' 
                    ? 'bg-green-600 hover:bg-green-700' 
                    : 'bg-red-600 hover:bg-red-700'
                }`}
              >
                {walletAction === 'add' ? 'Add Money' : 'Deduct Money'}
              </button>
            </div>
          </div>
        </div>
      )}


    </div>
  );
}