"use client";
import BASE_URL from "@/baseUrl/baseUrl";
import { cn } from "@/lib/utils";
import { useEffect, useState } from 'react';
import { FaDownload, FaExclamationTriangle, FaEye, FaFilter, FaSearch, FaTrash } from 'react-icons/fa';

export default function ErrorLogsPage() {
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSeverity, setFilterSeverity] = useState('all');
  const [filterDate, setFilterDate] = useState('');
  const [selectedError, setSelectedError] = useState(null);

  // Fetch real data from API
  useEffect(() => {
    fetchErrors();
  }, []);

  const fetchErrors = async () => {
    try {
      const response = await fetch(`${BASE_URL}/logs/errors`);
      const data = await response.json();
      
      if (data.success) {
        setErrors(data.data);
      } else {
        setErrors([]);
      }
    } catch (error) {
      console.error('Error fetching errors:', error);
      setErrors([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredErrors = errors.filter(error => {
    const matchesSearch = error.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         error.source.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         error.errorCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (error.userEmail && error.userEmail.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesSeverity = filterSeverity === 'all' || error.severity === filterSeverity;
    
    const matchesDate = !filterDate || error.timestamp.startsWith(filterDate);
    
    return matchesSearch && matchesSeverity && matchesDate;
  });

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'CRITICAL': return 'text-red-700 bg-red-100 border-red-300';
      case 'HIGH': return 'text-orange-700 bg-orange-100 border-orange-300';
      case 'MEDIUM': return 'text-yellow-700 bg-yellow-100 border-yellow-300';
      case 'LOW': return 'text-blue-700 bg-blue-100 border-blue-300';
      default: return 'text-gray-700 bg-gray-100 border-gray-300';
    }
  };

  const refreshErrors = () => {
    setLoading(true);
    fetchErrors();
  };

  const clearErrors = () => {
    if (confirm('Are you sure you want to clear all error logs? This action cannot be undone.')) {
      setErrors([]);
    }
  };

  const exportErrors = () => {
    const dataStr = JSON.stringify(filteredErrors, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `error-logs-${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const markAsResolved = async (errorId) => {
    try {
      const response = await fetch(`${BASE_URL}/logs/errors/${errorId}/resolve`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          resolvedBy: 'admin@flyola.com'
        })
      });

      if (response.ok) {
        // Update local state
        setErrors(prev => prev.map(error => 
          error.id === errorId 
            ? { 
                ...error, 
                resolved: true, 
                resolved_by: 'admin@flyola.com', 
                resolved_at: new Date().toISOString().replace('T', ' ').slice(0, 19)
              }
            : error
        ));
      } else {
        console.error('Failed to mark error as resolved');
      }
    } catch (error) {
      console.error('Error marking error as resolved:', error);
    }
  };

  const criticalCount = errors.filter(e => e.severity === 'CRITICAL' && !e.resolved).length;
  const unresolvedCount = errors.filter(e => !e.resolved).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className={cn('flex', 'flex-col', 'sm:flex-row', 'justify-between', 'items-start', 'sm:items-center', 'gap-4')}>
        <div>
          <h1 className={cn('text-3xl', 'font-bold', 'text-gray-900', 'flex', 'items-center', 'gap-3')}>
            <FaExclamationTriangle className="text-red-600" />
            Error Logs
          </h1>
          <p className={cn('text-gray-600', 'mt-1')}>Monitor and track system errors and exceptions</p>
          {criticalCount > 0 && (
            <div className={cn('mt-2', 'flex', 'items-center', 'gap-2', 'text-red-600')}>
              <FaExclamationTriangle className="text-sm" />
              <span className={cn('text-sm', 'font-medium')}>{criticalCount} critical error{criticalCount !== 1 ? 's' : ''} need attention</span>
            </div>
          )}
        </div>
        
        <div className={cn('flex', 'gap-2')}>
          <button
            onClick={refreshErrors}
            className={cn('flex', 'items-center', 'gap-2', 'px-4', 'py-2', 'bg-blue-600', 'text-white', 'rounded-lg', 'hover:bg-blue-700', 'transition-colors')}
          >
            <FaFilter className={loading ? 'animate-spin' : ''} />
            Refresh
          </button>
          <button
            onClick={exportErrors}
            className={cn('flex', 'items-center', 'gap-2', 'px-4', 'py-2', 'bg-green-600', 'text-white', 'rounded-lg', 'hover:bg-green-700', 'transition-colors')}
          >
            <FaDownload />
            Export
          </button>
          <button
            onClick={clearErrors}
            className={cn('flex', 'items-center', 'gap-2', 'px-4', 'py-2', 'bg-red-600', 'text-white', 'rounded-lg', 'hover:bg-red-700', 'transition-colors')}
          >
            <FaTrash />
            Clear
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className={cn('grid', 'grid-cols-1', 'md:grid-cols-4', 'gap-6')}>
        <div className={cn('bg-white', 'p-6', 'rounded-xl', 'shadow-sm', 'border', 'border-gray-200')}>
          <div className={cn('flex', 'items-center', 'justify-between')}>
            <div>
              <p className={cn('text-sm', 'font-medium', 'text-gray-600')}>Total Errors</p>
              <p className={cn('text-2xl', 'font-bold', 'text-gray-900')}>{errors.length}</p>
            </div>
            <div className={cn('w-12', 'h-12', 'bg-red-100', 'rounded-lg', 'flex', 'items-center', 'justify-center')}>
              <FaExclamationTriangle className="text-red-600" />
            </div>
          </div>
        </div>

        <div className={cn('bg-white', 'p-6', 'rounded-xl', 'shadow-sm', 'border', 'border-gray-200')}>
          <div className={cn('flex', 'items-center', 'justify-between')}>
            <div>
              <p className={cn('text-sm', 'font-medium', 'text-gray-600')}>Critical Errors</p>
              <p className={cn('text-2xl', 'font-bold', 'text-red-600')}>
                {errors.filter(e => e.severity === 'CRITICAL').length}
              </p>
            </div>
            <div className={cn('w-12', 'h-12', 'bg-red-100', 'rounded-lg', 'flex', 'items-center', 'justify-center')}>
              <FaExclamationTriangle className="text-red-600" />
            </div>
          </div>
        </div>

        <div className={cn('bg-white', 'p-6', 'rounded-xl', 'shadow-sm', 'border', 'border-gray-200')}>
          <div className={cn('flex', 'items-center', 'justify-between')}>
            <div>
              <p className={cn('text-sm', 'font-medium', 'text-gray-600')}>Unresolved</p>
              <p className={cn('text-2xl', 'font-bold', 'text-orange-600')}>{unresolvedCount}</p>
            </div>
            <div className={cn('w-12', 'h-12', 'bg-orange-100', 'rounded-lg', 'flex', 'items-center', 'justify-center')}>
              <FaExclamationTriangle className="text-orange-600" />
            </div>
          </div>
        </div>

        <div className={cn('bg-white', 'p-6', 'rounded-xl', 'shadow-sm', 'border', 'border-gray-200')}>
          <div className={cn('flex', 'items-center', 'justify-between')}>
            <div>
              <p className={cn('text-sm', 'font-medium', 'text-gray-600')}>Resolved</p>
              <p className={cn('text-2xl', 'font-bold', 'text-green-600')}>
                {errors.filter(e => e.resolved).length}
              </p>
            </div>
            <div className={cn('w-12', 'h-12', 'bg-green-100', 'rounded-lg', 'flex', 'items-center', 'justify-center')}>
              <FaExclamationTriangle className="text-green-600" />
            </div>
          </div>
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
              placeholder="Search errors..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={cn('w-full', 'pl-10', 'pr-4', 'py-2', 'border', 'border-gray-300', 'rounded-lg', 'focus:ring-2', 'focus:ring-blue-500', 'focus:border-transparent')}
            />
          </div>

          {/* Severity Filter */}
          <div className="relative">
            <FaFilter className={cn('absolute', 'left-3', 'top-1/2', 'transform', '-translate-y-1/2', 'text-gray-400')} />
            <select
              value={filterSeverity}
              onChange={(e) => setFilterSeverity(e.target.value)}
              className={cn('w-full', 'pl-10', 'pr-4', 'py-2', 'border', 'border-gray-300', 'rounded-lg', 'focus:ring-2', 'focus:ring-blue-500', 'focus:border-transparent', 'appearance-none')}
            >
              <option value="all">All Severities</option>
              <option value="CRITICAL">Critical</option>
              <option value="HIGH">High</option>
              <option value="MEDIUM">Medium</option>
              <option value="LOW">Low</option>
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
              {filteredErrors.length} error{filteredErrors.length !== 1 ? 's' : ''} found
            </span>
          </div>
        </div>
      </div>

      {/* Errors Table */}
      <div className={cn('bg-white', 'rounded-xl', 'shadow-sm', 'border', 'border-gray-200', 'overflow-hidden')}>
        {loading ? (
          <div className={cn('flex', 'items-center', 'justify-center', 'py-12')}>
            <div className={cn('animate-spin', 'rounded-full', 'h-8', 'w-8', 'border-b-2', 'border-blue-600')}></div>
            <span className={cn('ml-3', 'text-gray-600')}>Loading errors...</span>
          </div>
        ) : filteredErrors.length === 0 ? (
          <div className={cn('text-center', 'py-12')}>
            <FaExclamationTriangle className={cn('mx-auto', 'h-12', 'w-12', 'text-gray-400')} />
            <h3 className={cn('mt-2', 'text-sm', 'font-medium', 'text-gray-900')}>No errors found</h3>
            <p className={cn('mt-1', 'text-sm', 'text-gray-500')}>
              {searchTerm || filterSeverity !== 'all' || filterDate 
                ? 'Try adjusting your filters' 
                : 'No error logs available'}
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
                    Severity
                  </th>
                  <th className={cn('px-6', 'py-3', 'text-left', 'text-xs', 'font-medium', 'text-gray-500', 'uppercase', 'tracking-wider')}>
                    Error Code
                  </th>
                  <th className={cn('px-6', 'py-3', 'text-left', 'text-xs', 'font-medium', 'text-gray-500', 'uppercase', 'tracking-wider')}>
                    Message
                  </th>
                  <th className={cn('px-6', 'py-3', 'text-left', 'text-xs', 'font-medium', 'text-gray-500', 'uppercase', 'tracking-wider')}>
                    Source
                  </th>
                  <th className={cn('px-6', 'py-3', 'text-left', 'text-xs', 'font-medium', 'text-gray-500', 'uppercase', 'tracking-wider')}>
                    Status
                  </th>
                  <th className={cn('px-6', 'py-3', 'text-left', 'text-xs', 'font-medium', 'text-gray-500', 'uppercase', 'tracking-wider')}>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className={cn('bg-white', 'divide-y', 'divide-gray-200')}>
                {filteredErrors.map((error) => (
                  <tr key={error.id} className="hover:bg-gray-50">
                    <td className={cn('px-6', 'py-4', 'whitespace-nowrap', 'text-sm', 'text-gray-900')}>
                      {error.timestamp}
                    </td>
                    <td className={cn('px-6', 'py-4', 'whitespace-nowrap')}>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${getSeverityColor(error.severity)}`}>
                        {error.severity}
                      </span>
                    </td>
                    <td className={cn('px-6', 'py-4', 'whitespace-nowrap', 'text-sm', 'text-gray-900', 'font-mono')}>
                      {error.errorCode}
                    </td>
                    <td className={cn('px-6', 'py-4', 'text-sm', 'text-gray-900', 'max-w-md', 'truncate')}>
                      {error.message}
                    </td>
                    <td className={cn('px-6', 'py-4', 'whitespace-nowrap', 'text-sm', 'text-gray-500', 'font-mono')}>
                      {error.source}:{error.lineNumber}
                    </td>
                    <td className={cn('px-6', 'py-4', 'whitespace-nowrap')}>
                      {error.resolved ? (
                        <span className={cn('inline-flex', 'px-2', 'py-1', 'text-xs', 'font-semibold', 'rounded-full', 'text-green-700', 'bg-green-100')}>
                          Resolved
                        </span>
                      ) : (
                        <span className={cn('inline-flex', 'px-2', 'py-1', 'text-xs', 'font-semibold', 'rounded-full', 'text-red-700', 'bg-red-100')}>
                          Open
                        </span>
                      )}
                    </td>
                    <td className={cn('px-6', 'py-4', 'whitespace-nowrap', 'text-sm', 'font-medium')}>
                      <div className={cn('flex', 'gap-2')}>
                        <button
                          onClick={() => setSelectedError(error)}
                          className={cn('text-blue-600', 'hover:text-blue-900', 'flex', 'items-center', 'gap-1')}
                        >
                          <FaEye />
                          View
                        </button>
                        {!error.resolved && (
                          <button
                            onClick={() => markAsResolved(error.id)}
                            className={cn('text-green-600', 'hover:text-green-900', 'text-xs')}
                          >
                            Mark Resolved
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Error Details Modal */}
      {selectedError && (
        <div className={cn('fixed', 'inset-0', 'bg-black', 'bg-opacity-50', 'flex', 'items-center', 'justify-center', 'p-4', 'z-50')}>
          <div className={cn('bg-white', 'rounded-xl', 'max-w-6xl', 'w-full', 'max-h-[90vh]', 'overflow-y-auto')}>
            <div className={cn('p-6', 'border-b', 'border-gray-200')}>
              <div className={cn('flex', 'justify-between', 'items-center')}>
                <h3 className={cn('text-lg', 'font-semibold', 'text-gray-900')}>Error Details</h3>
                <button
                  onClick={() => setSelectedError(null)}
                  className={cn('text-gray-400', 'hover:text-gray-600')}
                >
                  ✕
                </button>
              </div>
            </div>
            
            <div className={cn('p-6', 'space-y-6')}>
              <div className={cn('grid', 'grid-cols-1', 'md:grid-cols-2', 'gap-4')}>
                <div>
                  <label className={cn('block', 'text-sm', 'font-medium', 'text-gray-700')}>Timestamp</label>
                  <p className={cn('mt-1', 'text-sm', 'text-gray-900')}>{selectedError.timestamp}</p>
                </div>
                <div>
                  <label className={cn('block', 'text-sm', 'font-medium', 'text-gray-700')}>Severity</label>
                  <span className={`mt-1 inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${getSeverityColor(selectedError.severity)}`}>
                    {selectedError.severity}
                  </span>
                </div>
                <div>
                  <label className={cn('block', 'text-sm', 'font-medium', 'text-gray-700')}>Error Code</label>
                  <p className={cn('mt-1', 'text-sm', 'text-gray-900', 'font-mono')}>{selectedError.errorCode}</p>
                </div>
                <div>
                  <label className={cn('block', 'text-sm', 'font-medium', 'text-gray-700')}>Source</label>
                  <p className={cn('mt-1', 'text-sm', 'text-gray-900', 'font-mono')}>{selectedError.source}:{selectedError.lineNumber}</p>
                </div>
                {selectedError.userEmail && (
                  <div>
                    <label className={cn('block', 'text-sm', 'font-medium', 'text-gray-700')}>User Email</label>
                    <p className={cn('mt-1', 'text-sm', 'text-gray-900')}>{selectedError.userEmail}</p>
                  </div>
                )}
                {selectedError.paymentId && (
                  <div>
                    <label className={cn('block', 'text-sm', 'font-medium', 'text-gray-700')}>Payment ID</label>
                    <p className={cn('mt-1', 'text-sm', 'text-gray-900', 'font-mono')}>{selectedError.paymentId}</p>
                  </div>
                )}
              </div>
              
              <div>
                <label className={cn('block', 'text-sm', 'font-medium', 'text-gray-700')}>Error Message</label>
                <p className={cn('mt-1', 'text-sm', 'text-gray-900', 'bg-red-50', 'p-3', 'rounded-lg', 'border', 'border-red-200')}>{selectedError.message}</p>
              </div>
              
              <div>
                <label className={cn('block', 'text-sm', 'font-medium', 'text-gray-700')}>Stack Trace</label>
                <pre className={cn('mt-1', 'text-xs', 'text-gray-900', 'bg-gray-50', 'p-3', 'rounded-lg', 'overflow-x-auto', 'border', 'font-mono')}>
                  {selectedError.stackTrace}
                </pre>
              </div>
              
              {selectedError.context && (
                <div>
                  <label className={cn('block', 'text-sm', 'font-medium', 'text-gray-700')}>Context</label>
                  <pre className={cn('mt-1', 'text-sm', 'text-gray-900', 'bg-gray-50', 'p-3', 'rounded-lg', 'overflow-x-auto', 'border')}>
                    {JSON.stringify(selectedError.context, null, 2)}
                  </pre>
                </div>
              )}

              {selectedError.resolved && (
                <div className={cn('bg-green-50', 'border', 'border-green-200', 'rounded-lg', 'p-4')}>
                  <h4 className={cn('text-sm', 'font-medium', 'text-green-800')}>Resolution Details</h4>
                  <p className={cn('text-sm', 'text-green-700', 'mt-1')}>
                    Resolved by: {selectedError.resolvedBy} at {selectedError.resolvedAt}
                  </p>
                </div>
              )}

              {!selectedError.resolved && (
                <div className={cn('flex', 'justify-end')}>
                  <button
                    onClick={() => {
                      markAsResolved(selectedError.id);
                      setSelectedError(null);
                    }}
                    className={cn('px-4', 'py-2', 'bg-green-600', 'text-white', 'rounded-lg', 'hover:bg-green-700', 'transition-colors')}
                  >
                    Mark as Resolved
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}