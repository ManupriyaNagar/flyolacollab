"use client";
import BASE_URL from "@/baseUrl/baseUrl";
import { cn } from "@/lib/utils";
import { useEffect, useState } from 'react';
import { FaDownload, FaEye, FaFilter, FaSearch, FaServer, FaTrash } from 'react-icons/fa';

export default function SystemLogsPage() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterLevel, setFilterLevel] = useState('all');
  const [filterDate, setFilterDate] = useState('');
  const [selectedLog, setSelectedLog] = useState(null);

  // Fetch real data from API
  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      const response = await fetch(`${BASE_URL}/logs/system`);
      const data = await response.json();
      
      if (data.success) {
        setLogs(data.data);
      } else {
        setLogs([]);
      }
    } catch (error) {
      console.error('Error fetching logs:', error);
      setLogs([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredLogs = logs.filter(log => {
    const matchesSearch = log.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.source.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (log.userEmail && log.userEmail.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesLevel = filterLevel === 'all' || log.level === filterLevel;
    
    const matchesDate = !filterDate || log.timestamp.startsWith(filterDate);
    
    return matchesSearch && matchesLevel && matchesDate;
  });

  const getLevelColor = (level) => {
    switch (level) {
      case 'ERROR': return 'text-red-600 bg-red-50 border-red-200';
      case 'WARNING': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'INFO': return 'text-blue-600 bg-blue-50 border-blue-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const refreshLogs = () => {
    setLoading(true);
    fetchLogs();
  };

  const clearLogs = () => {
    if (confirm('Are you sure you want to clear all logs? This action cannot be undone.')) {
      setLogs([]);
    }
  };

  const exportLogs = () => {
    const dataStr = JSON.stringify(filteredLogs, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `system-logs-${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className={cn('flex', 'flex-col', 'sm:flex-row', 'justify-between', 'items-start', 'sm:items-center', 'gap-4')}>
        <div>
          <h1 className={cn('text-3xl', 'font-bold', 'text-gray-900', 'flex', 'items-center', 'gap-3')}>
            <FaServer className="text-blue-600" />
            System Logs
          </h1>
          <p className={cn('text-gray-600', 'mt-1')}>Monitor system activities, errors, and performance</p>
        </div>
        
        <div className={cn('flex', 'gap-2')}>
          <button
            onClick={refreshLogs}
            className={cn('flex', 'items-center', 'gap-2', 'px-4', 'py-2', 'bg-blue-600', 'text-white', 'rounded-lg', 'hover:bg-blue-700', 'transition-colors')}
          >
            <FaFilter className={loading ? 'animate-spin' : ''} />
            Refresh
          </button>
          <button
            onClick={exportLogs}
            className={cn('flex', 'items-center', 'gap-2', 'px-4', 'py-2', 'bg-green-600', 'text-white', 'rounded-lg', 'hover:bg-green-700', 'transition-colors')}
          >
            <FaDownload />
            Export
          </button>
          <button
            onClick={clearLogs}
            className={cn('flex', 'items-center', 'gap-2', 'px-4', 'py-2', 'bg-red-600', 'text-white', 'rounded-lg', 'hover:bg-red-700', 'transition-colors')}
          >
            <FaTrash />
            Clear
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className={cn('bg-white', 'p-6', 'rounded-xl', 'shadow-sm', 'border', 'border-gray-200')}>
        <div className={cn('grid', 'grid-cols-1', 'md:grid-cols-4', 'gap-4')}>
          {/* Search */}
          <div className="relative">
            <FaSearch className={cn('absolute', 'left-3', 'top-1/2', 'transform', '-translate-y-1/2', 'text-gray-400')} />
            <input
              type="text"
              placeholder="Search logs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={cn('w-full', 'pl-10', 'pr-4', 'py-2', 'border', 'border-gray-300', 'rounded-lg', 'focus:ring-2', 'focus:ring-blue-500', 'focus:border-transparent')}
            />
          </div>

          {/* Level Filter */}
          <div className="relative">
            <FaFilter className={cn('absolute', 'left-3', 'top-1/2', 'transform', '-translate-y-1/2', 'text-gray-400')} />
            <select
              value={filterLevel}
              onChange={(e) => setFilterLevel(e.target.value)}
              className={cn('w-full', 'pl-10', 'pr-4', 'py-2', 'border', 'border-gray-300', 'rounded-lg', 'focus:ring-2', 'focus:ring-blue-500', 'focus:border-transparent', 'appearance-none')}
            >
              <option value="all">All Levels</option>
              <option value="ERROR">Error</option>
              <option value="WARNING">Warning</option>
              <option value="INFO">Info</option>
            </select>
          </div>

          {/* Date Filter */}
          <div>
            <input
              type="date"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
              className={cn('w-full', 'px-4', 'py-2', 'border', 'border-gray-300', 'rounded-lg', 'focus:ring-2', 'focus:ring-blue-500', 'focus:border-transparent')}
            />
          </div>

          {/* Results Count */}
          <div className={cn('flex', 'items-center', 'justify-center', 'bg-gray-50', 'rounded-lg', 'px-4', 'py-2')}>
            <span className={cn('text-sm', 'text-gray-600')}>
              {filteredLogs.length} log{filteredLogs.length !== 1 ? 's' : ''} found
            </span>
          </div>
        </div>
      </div>

      {/* Logs Table */}
      <div className={cn('bg-white', 'rounded-xl', 'shadow-sm', 'border', 'border-gray-200', 'overflow-hidden')}>
        {loading ? (
          <div className={cn('flex', 'items-center', 'justify-center', 'py-12')}>
            <div className={cn('animate-spin', 'rounded-full', 'h-8', 'w-8', 'border-b-2', 'border-blue-600')}></div>
            <span className={cn('ml-3', 'text-gray-600')}>Loading logs...</span>
          </div>
        ) : filteredLogs.length === 0 ? (
          <div className={cn('text-center', 'py-12')}>
            <FaServer className={cn('mx-auto', 'h-12', 'w-12', 'text-gray-400')} />
            <h3 className={cn('mt-2', 'text-sm', 'font-medium', 'text-gray-900')}>No logs found</h3>
            <p className={cn('mt-1', 'text-sm', 'text-gray-500')}>
              {searchTerm || filterLevel !== 'all' || filterDate 
                ? 'Try adjusting your filters' 
                : 'No system logs available'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className={cn('min-w-full', 'divide-y', 'divide-gray-200')}>
              <thead className="bg-gray-50">
                <tr>
                  <th className={cn('px-6', 'py-3', 'text-left', 'text-xs', 'font-medium', 'text-gray-500', 'uppercase', 'tracking-wider')}>
                    Timestamp
                  </th>
                  <th className={cn('px-6', 'py-3', 'text-left', 'text-xs', 'font-medium', 'text-gray-500', 'uppercase', 'tracking-wider')}>
                    Level
                  </th>
                  <th className={cn('px-6', 'py-3', 'text-left', 'text-xs', 'font-medium', 'text-gray-500', 'uppercase', 'tracking-wider')}>
                    Message
                  </th>
                  <th className={cn('px-6', 'py-3', 'text-left', 'text-xs', 'font-medium', 'text-gray-500', 'uppercase', 'tracking-wider')}>
                    Source
                  </th>
                  <th className={cn('px-6', 'py-3', 'text-left', 'text-xs', 'font-medium', 'text-gray-500', 'uppercase', 'tracking-wider')}>
                    User
                  </th>
                  <th className={cn('px-6', 'py-3', 'text-left', 'text-xs', 'font-medium', 'text-gray-500', 'uppercase', 'tracking-wider')}>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className={cn('bg-white', 'divide-y', 'divide-gray-200')}>
                {filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-gray-50">
                    <td className={cn('px-6', 'py-4', 'whitespace-nowrap', 'text-sm', 'text-gray-900')}>
                      {log.timestamp}
                    </td>
                    <td className={cn('px-6', 'py-4', 'whitespace-nowrap')}>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${getLevelColor(log.level)}`}>
                        {log.level}
                      </span>
                    </td>
                    <td className={cn('px-6', 'py-4', 'text-sm', 'text-gray-900', 'max-w-md', 'truncate')}>
                      {log.message}
                    </td>
                    <td className={cn('px-6', 'py-4', 'whitespace-nowrap', 'text-sm', 'text-gray-500', 'font-mono')}>
                      {log.source}
                    </td>
                    <td className={cn('px-6', 'py-4', 'whitespace-nowrap', 'text-sm', 'text-gray-500')}>
                      {log.userEmail || 'System'}
                    </td>
                    <td className={cn('px-6', 'py-4', 'whitespace-nowrap', 'text-sm', 'font-medium')}>
                      <button
                        onClick={() => setSelectedLog(log)}
                        className={cn('text-blue-600', 'hover:text-blue-900', 'flex', 'items-center', 'gap-1')}
                      >
                        <FaEye />
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Log Details Modal */}
      {selectedLog && (
        <div className={cn('fixed', 'inset-0', 'bg-black', 'bg-opacity-50', 'flex', 'items-center', 'justify-center', 'p-4', 'z-50')}>
          <div className={cn('bg-white', 'rounded-xl', 'max-w-4xl', 'w-full', 'max-h-[80vh]', 'overflow-y-auto')}>
            <div className={cn('p-6', 'border-b', 'border-gray-200')}>
              <div className={cn('flex', 'justify-between', 'items-center')}>
                <h3 className={cn('text-lg', 'font-semibold', 'text-gray-900')}>Log Details</h3>
                <button
                  onClick={() => setSelectedLog(null)}
                  className={cn('text-gray-400', 'hover:text-gray-600')}
                >
                  ✕
                </button>
              </div>
            </div>
            
            <div className={cn('p-6', 'space-y-4')}>
              <div className={cn('grid', 'grid-cols-1', 'md:grid-cols-2', 'gap-4')}>
                <div>
                  <label className={cn('block', 'text-sm', 'font-medium', 'text-gray-700')}>Timestamp</label>
                  <p className={cn('mt-1', 'text-sm', 'text-gray-900')}>{selectedLog.timestamp}</p>
                </div>
                <div>
                  <label className={cn('block', 'text-sm', 'font-medium', 'text-gray-700')}>Level</label>
                  <span className={`mt-1 inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${getLevelColor(selectedLog.level)}`}>
                    {selectedLog.level}
                  </span>
                </div>
                <div>
                  <label className={cn('block', 'text-sm', 'font-medium', 'text-gray-700')}>Source</label>
                  <p className={cn('mt-1', 'text-sm', 'text-gray-900', 'font-mono')}>{selectedLog.source}</p>
                </div>
                {selectedLog.userEmail && (
                  <div>
                    <label className={cn('block', 'text-sm', 'font-medium', 'text-gray-700')}>User Email</label>
                    <p className={cn('mt-1', 'text-sm', 'text-gray-900')}>{selectedLog.userEmail}</p>
                  </div>
                )}
                {selectedLog.userId && (
                  <div>
                    <label className={cn('block', 'text-sm', 'font-medium', 'text-gray-700')}>User ID</label>
                    <p className={cn('mt-1', 'text-sm', 'text-gray-900')}>{selectedLog.userId}</p>
                  </div>
                )}
                {selectedLog.paymentId && (
                  <div>
                    <label className={cn('block', 'text-sm', 'font-medium', 'text-gray-700')}>Payment ID</label>
                    <p className={cn('mt-1', 'text-sm', 'text-gray-900', 'font-mono')}>{selectedLog.paymentId}</p>
                  </div>
                )}
                {selectedLog.bookingId && (
                  <div>
                    <label className={cn('block', 'text-sm', 'font-medium', 'text-gray-700')}>Booking ID</label>
                    <p className={cn('mt-1', 'text-sm', 'text-gray-900', 'font-mono')}>{selectedLog.bookingId}</p>
                  </div>
                )}
              </div>
              
              <div>
                <label className={cn('block', 'text-sm', 'font-medium', 'text-gray-700')}>Message</label>
                <p className={cn('mt-1', 'text-sm', 'text-gray-900', 'bg-gray-50', 'p-3', 'rounded-lg')}>{selectedLog.message}</p>
              </div>
              
              {selectedLog.details && (
                <div>
                  <label className={cn('block', 'text-sm', 'font-medium', 'text-gray-700')}>Details</label>
                  <p className={cn('mt-1', 'text-sm', 'text-gray-900', 'bg-gray-50', 'p-3', 'rounded-lg')}>{selectedLog.details}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}