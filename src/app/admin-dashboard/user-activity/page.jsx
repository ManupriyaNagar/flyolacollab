"use client";
import BASE_URL from "@/baseUrl/baseUrl";
import { cn } from "@/lib/utils";
import { useEffect, useState } from 'react';
import { FaEye, FaFilter, FaSearch, FaUser, FaUsers } from 'react-icons/fa';

export default function UserActivityPage() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterAction, setFilterAction] = useState('all');
  const [filterDate, setFilterDate] = useState('');
  const [selectedActivity, setSelectedActivity] = useState(null);

  // Fetch real data from API
  useEffect(() => {
    fetchActivities();
  }, []);

  const fetchActivities = async () => {
    try {
      const response = await fetch(`${BASE_URL}/logs/activity`);
      const data = await response.json();
      
      if (data.success) {
        setActivities(data.data);
      } else {
        setActivities([]);
      }
    } catch (error) {
      console.error('Error fetching activities:', error);
      setActivities([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredActivities = activities.filter(activity => {
    const matchesSearch = (activity.userEmail?.toLowerCase() ?? '').includes(searchTerm.toLowerCase()) ||
                         (activity.userName?.toLowerCase() ?? '').includes(searchTerm.toLowerCase()) ||
                         (activity.description?.toLowerCase() ?? '').includes(searchTerm.toLowerCase());
    
    let matchesAction = true;
    if (filterAction === 'admin') {
      matchesAction = activity.action?.startsWith('ADMIN_');
    } else if (filterAction === 'user') {
      matchesAction = !activity.action?.startsWith('ADMIN_');
    } else if (filterAction !== 'all') {
      matchesAction = activity.action === filterAction;
    }
    
    const matchesDate = !filterDate || activity.timestamp?.startsWith(filterDate);
    
    return matchesSearch && matchesAction && matchesDate;
  });

  const getActionColor = (action) => {
    // Admin actions
    if (action.startsWith('ADMIN_')) {
      return 'text-purple-600 bg-purple-50 border-purple-200';
    }
    
    switch (action) {
      case 'LOGIN': return 'text-green-600 bg-green-50 border-green-200';
      case 'LOGIN_FAILED': return 'text-red-600 bg-red-50 border-red-200';
      case 'BOOKING_SUCCESS': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'BOOKING_ATTEMPT': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'PAYMENT_ATTEMPT': return 'text-purple-600 bg-purple-50 border-purple-200';
      case 'SEARCH': return 'text-gray-600 bg-gray-50 border-gray-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'SUCCESS': return 'text-green-600 bg-green-50';
      case 'FAILED': return 'text-red-600 bg-red-50';
      case 'PENDING': return 'text-yellow-600 bg-yellow-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const refreshActivities = () => {
    setLoading(true);
    fetchActivities();
  };

  const uniqueActions = [...new Set(activities.map(a => a.action))];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className={cn('flex', 'flex-col', 'sm:flex-row', 'justify-between', 'items-start', 'sm:items-center', 'gap-4')}>
        <div>
          <h1 className={cn('text-3xl', 'font-bold', 'text-gray-900', 'flex', 'items-center', 'gap-3')}>
            <FaUsers className="text-blue-600" />
            User Activity
          </h1>
          <p className={cn('text-gray-600', 'mt-1')}>Monitor user actions, logins, and system interactions</p>
        </div>
        
        <div className={cn('flex', 'gap-2')}>
          <button
            onClick={refreshActivities}
            className={cn('flex', 'items-center', 'gap-2', 'px-4', 'py-2', 'bg-blue-600', 'text-white', 'rounded-lg', 'hover:bg-blue-700', 'transition-colors')}
          >
            <FaFilter className={loading ? 'animate-spin' : ''} />
            Refresh
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className={cn('grid', 'grid-cols-1', 'md:grid-cols-4', 'gap-6')}>
        <div className={cn('bg-white', 'p-6', 'rounded-xl', 'shadow-sm', 'border', 'border-gray-200')}>
          <div className={cn('flex', 'items-center', 'justify-between')}>
            <div>
              <p className={cn('text-sm', 'font-medium', 'text-gray-600')}>Total Activities</p>
              <p className={cn('text-2xl', 'font-bold', 'text-gray-900')}>{activities.length}</p>
            </div>
            <div className={cn('w-12', 'h-12', 'bg-blue-100', 'rounded-lg', 'flex', 'items-center', 'justify-center')}>
              <FaUser className="text-blue-600" />
            </div>
          </div>
        </div>

        <div className={cn('bg-white', 'p-6', 'rounded-xl', 'shadow-sm', 'border', 'border-gray-200')}>
          <div className={cn('flex', 'items-center', 'justify-between')}>
            <div>
              <p className={cn('text-sm', 'font-medium', 'text-gray-600')}>Successful Actions</p>
              <p className={cn('text-2xl', 'font-bold', 'text-green-600')}>
                {activities.filter(a => a.status === 'SUCCESS').length}
              </p>
            </div>
            <div className={cn('w-12', 'h-12', 'bg-green-100', 'rounded-lg', 'flex', 'items-center', 'justify-center')}>
              <FaUser className="text-green-600" />
            </div>
          </div>
        </div>

        <div className={cn('bg-white', 'p-6', 'rounded-xl', 'shadow-sm', 'border', 'border-gray-200')}>
          <div className={cn('flex', 'items-center', 'justify-between')}>
            <div>
              <p className={cn('text-sm', 'font-medium', 'text-gray-600')}>Failed Actions</p>
              <p className={cn('text-2xl', 'font-bold', 'text-red-600')}>
                {activities.filter(a => a.status === 'FAILED').length}
              </p>
            </div>
            <div className={cn('w-12', 'h-12', 'bg-red-100', 'rounded-lg', 'flex', 'items-center', 'justify-center')}>
              <FaUser className="text-red-600" />
            </div>
          </div>
        </div>

        <div className={cn('bg-white', 'p-6', 'rounded-xl', 'shadow-sm', 'border', 'border-gray-200')}>
          <div className={cn('flex', 'items-center', 'justify-between')}>
            <div>
              <p className={cn('text-sm', 'font-medium', 'text-gray-600')}>Admin Activities</p>
              <p className={cn('text-2xl', 'font-bold', 'text-purple-600')}>
                {activities.filter(a => a.action?.startsWith('ADMIN_')).length}
              </p>
            </div>
            <div className={cn('w-12', 'h-12', 'bg-purple-100', 'rounded-lg', 'flex', 'items-center', 'justify-center')}>
              <FaUser className="text-purple-600" />
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
              placeholder="Search users or actions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={cn('w-full', 'pl-10', 'pr-4', 'py-2', 'border', 'border-gray-300', 'rounded-lg', 'focus:ring-2', 'focus:ring-blue-500', 'focus:border-transparent')}
            />
          </div>

          {/* Action Filter */}
          <div className="relative">
            <FaFilter className={cn('absolute', 'left-3', 'top-1/2', 'transform', '-translate-y-1/2', 'text-gray-400')} />
            <select
              value={filterAction}
              onChange={(e) => setFilterAction(e.target.value)}
              className={cn('w-full', 'pl-10', 'pr-4', 'py-2', 'border', 'border-gray-300', 'rounded-lg', 'focus:ring-2', 'focus:ring-blue-500', 'focus:border-transparent', 'appearance-none')}
            >
              <option value="all">All Actions</option>
              <option value="admin">Admin Actions Only</option>
              <option value="user">User Actions Only</option>
              {uniqueActions.map(action => (
                <option key={action} value={action}>{action.replace('_', ' ')}</option>
              ))}
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
              {filteredActivities.length} activit{filteredActivities.length !== 1 ? 'ies' : 'y'} found
            </span>
          </div>
        </div>
      </div>

      {/* Activities Table */}
      <div className={cn('bg-white', 'rounded-xl', 'shadow-sm', 'border', 'border-gray-200', 'overflow-hidden')}>
        {loading ? (
          <div className={cn('flex', 'items-center', 'justify-center', 'py-12')}>
            <div className={cn('animate-spin', 'rounded-full', 'h-8', 'w-8', 'border-b-2', 'border-blue-600')}></div>
            <span className={cn('ml-3', 'text-gray-600')}>Loading activities...</span>
          </div>
        ) : filteredActivities.length === 0 ? (
          <div className={cn('text-center', 'py-12')}>
            <FaUsers className={cn('mx-auto', 'h-12', 'w-12', 'text-gray-400')} />
            <h3 className={cn('mt-2', 'text-sm', 'font-medium', 'text-gray-900')}>No activities found</h3>
            <p className={cn('mt-1', 'text-sm', 'text-gray-500')}>
              {searchTerm || filterAction !== 'all' || filterDate 
                ? 'Try adjusting your filters' 
                : 'No user activities available'}
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
                    User
                  </th>
                  <th className={cn('px-6', 'py-3', 'text-left', 'text-xs', 'font-medium', 'text-gray-500', 'uppercase', 'tracking-wider')}>
                    Action
                  </th>
                  <th className={cn('px-6', 'py-3', 'text-left', 'text-xs', 'font-medium', 'text-gray-500', 'uppercase', 'tracking-wider')}>
                    Description
                  </th>
                  <th className={cn('px-6', 'py-3', 'text-left', 'text-xs', 'font-medium', 'text-gray-500', 'uppercase', 'tracking-wider')}>
                    Status
                  </th>
                  <th className={cn('px-6', 'py-3', 'text-left', 'text-xs', 'font-medium', 'text-gray-500', 'uppercase', 'tracking-wider')}>
                    IP Address
                  </th>
                  <th className={cn('px-6', 'py-3', 'text-left', 'text-xs', 'font-medium', 'text-gray-500', 'uppercase', 'tracking-wider')}>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className={cn('bg-white', 'divide-y', 'divide-gray-200')}>
                {filteredActivities.map((activity) => (
                  <tr key={activity.id} className="hover:bg-gray-50">
                    <td className={cn('px-6', 'py-4', 'whitespace-nowrap', 'text-sm', 'text-gray-900')}>
                      {activity.timestamp}
                    </td>
                    <td className={cn('px-6', 'py-4', 'whitespace-nowrap')}>
                      <div className={cn('flex', 'items-center')}>
                        <div className={cn('flex-shrink-0', 'h-8', 'w-8')}>
                          <div className={cn('h-8', 'w-8', 'rounded-full', 'bg-gray-200', 'flex', 'items-center', 'justify-center')}>
                            <FaUser className={cn('text-gray-500', 'text-xs')} />
                          </div>
                        </div>
                        <div className="ml-3">
                          <div className={cn('text-sm', 'font-medium', 'text-gray-900')}>{activity.userName}</div>
                          <div className={cn('text-sm', 'text-gray-500')}>{activity.userEmail}</div>
                        </div>
                      </div>
                    </td>
                    <td className={cn('px-6', 'py-4', 'whitespace-nowrap')}>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${getActionColor(activity.action)}`}>
                        {activity.action.replace('_', ' ')}
                      </span>
                    </td>
                    <td className={cn('px-6', 'py-4', 'text-sm', 'text-gray-900', 'max-w-md', 'truncate')}>
                      {activity.description}
                    </td>
                    <td className={cn('px-6', 'py-4', 'whitespace-nowrap')}>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(activity.status)}`}>
                        {activity.status}
                      </span>
                    </td>
                    <td className={cn('px-6', 'py-4', 'whitespace-nowrap', 'text-sm', 'text-gray-500', 'font-mono')}>
                      {activity.ipAddress}
                    </td>
                    <td className={cn('px-6', 'py-4', 'whitespace-nowrap', 'text-sm', 'font-medium')}>
                      <button
                        onClick={() => setSelectedActivity(activity)}
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

      {/* Activity Details Modal */}
      {selectedActivity && (
        <div className={cn('fixed', 'inset-0', 'bg-black', 'bg-opacity-50', 'flex', 'items-center', 'justify-center', 'p-4', 'z-50')}>
          <div className={cn('bg-white', 'rounded-xl', 'max-w-4xl', 'w-full', 'max-h-[80vh]', 'overflow-y-auto')}>
            <div className={cn('p-6', 'border-b', 'border-gray-200')}>
              <div className={cn('flex', 'justify-between', 'items-center')}>
                <h3 className={cn('text-lg', 'font-semibold', 'text-gray-900')}>Activity Details</h3>
                <button
                  onClick={() => setSelectedActivity(null)}
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
                  <p className={cn('mt-1', 'text-sm', 'text-gray-900')}>{selectedActivity.timestamp}</p>
                </div>
                <div>
                  <label className={cn('block', 'text-sm', 'font-medium', 'text-gray-700')}>Action</label>
                  <span className={`mt-1 inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${getActionColor(selectedActivity.action)}`}>
                    {selectedActivity.action.replace('_', ' ')}
                  </span>
                </div>
                <div>
                  <label className={cn('block', 'text-sm', 'font-medium', 'text-gray-700')}>User Name</label>
                  <p className={cn('mt-1', 'text-sm', 'text-gray-900')}>{selectedActivity.userName}</p>
                </div>
                <div>
                  <label className={cn('block', 'text-sm', 'font-medium', 'text-gray-700')}>User Email</label>
                  <p className={cn('mt-1', 'text-sm', 'text-gray-900')}>{selectedActivity.userEmail}</p>
                </div>
                <div>
                  <label className={cn('block', 'text-sm', 'font-medium', 'text-gray-700')}>User ID</label>
                  <p className={cn('mt-1', 'text-sm', 'text-gray-900')}>{selectedActivity.userId}</p>
                </div>
                <div>
                  <label className={cn('block', 'text-sm', 'font-medium', 'text-gray-700')}>Status</label>
                  <span className={`mt-1 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(selectedActivity.status)}`}>
                    {selectedActivity.status}
                  </span>
                </div>
                <div>
                  <label className={cn('block', 'text-sm', 'font-medium', 'text-gray-700')}>IP Address</label>
                  <p className={cn('mt-1', 'text-sm', 'text-gray-900', 'font-mono')}>{selectedActivity.ipAddress}</p>
                </div>
              </div>
              
              <div>
                <label className={cn('block', 'text-sm', 'font-medium', 'text-gray-700')}>Description</label>
                <p className={cn('mt-1', 'text-sm', 'text-gray-900', 'bg-gray-50', 'p-3', 'rounded-lg')}>{selectedActivity.description}</p>
              </div>
              
              <div>
                <label className={cn('block', 'text-sm', 'font-medium', 'text-gray-700')}>User Agent</label>
                <p className={cn('mt-1', 'text-sm', 'text-gray-900', 'bg-gray-50', 'p-3', 'rounded-lg', 'font-mono', 'break-all')}>{selectedActivity.userAgent}</p>
              </div>
              
              {selectedActivity.details && (
                <div>
                  <label className={cn('block', 'text-sm', 'font-medium', 'text-gray-700')}>Additional Details</label>
                  <pre className={cn('mt-1', 'text-sm', 'text-gray-900', 'bg-gray-50', 'p-3', 'rounded-lg', 'overflow-x-auto')}>
                    {JSON.stringify(selectedActivity.details, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}