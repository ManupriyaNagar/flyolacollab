"use client";

import { useState, useEffect } from 'react';
import { FaChartLine, FaDownload,  FaEye, FaSortDown, FaSortAlphaUp, FaAngleUp } from 'react-icons/fa';

export default function StrategicReports() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTimeframe, setSelectedTimeframe] = useState('quarterly');

  // Mock data - replace with actual API call
  useEffect(() => {
    const mockReports = [
      {
        id: 1,
        title: 'Q4 2024 Business Performance',
        type: 'Performance',
        timeframe: 'Quarterly',
        generatedDate: '2024-01-15',
        status: 'Ready',
        keyMetrics: {
          revenue: '+15.2%',
          growth: '+8.7%',
          efficiency: '+12.1%'
        }
      },
      {
        id: 2,
        title: 'Annual Strategic Review 2024',
        type: 'Strategic',
        timeframe: 'Annual',
        generatedDate: '2024-01-10',
        status: 'Ready',
        keyMetrics: {
          revenue: '+22.5%',
          growth: '+18.3%',
          efficiency: '+9.8%'
        }
      },
      {
        id: 3,
        title: 'Market Analysis & Competitive Position',
        type: 'Market Analysis',
        timeframe: 'Monthly',
        generatedDate: '2024-01-08',
        status: 'Ready',
        keyMetrics: {
          revenue: '+5.1%',
          growth: '+3.2%',
          efficiency: '+7.4%'
        }
      },
      {
        id: 4,
        title: 'Risk Assessment & Mitigation',
        type: 'Risk Management',
        timeframe: 'Quarterly',
        generatedDate: '2024-01-05',
        status: 'Processing',
        keyMetrics: {
          revenue: 'N/A',
          growth: 'N/A',
          efficiency: 'N/A'
        }
      }
    ];
    
    setTimeout(() => {
      setReports(mockReports);
      setLoading(false);
    }, 1000);
  }, []);

  const getTypeColor = (type) => {
    switch (type.toLowerCase()) {
      case 'performance': return 'bg-blue-100 text-blue-800';
      case 'strategic': return 'bg-purple-100 text-purple-800';
      case 'market analysis': return 'bg-green-100 text-green-800';
      case 'risk management': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status) => {
    return status === 'Ready' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800';
  };

  const getTrendIcon = (value) => {
    if (value === 'N/A') return null;
    const numValue = parseFloat(value.replace('%', '').replace('+', ''));
    return numValue > 0 ? <FaSortAlphaUp className="text-green-500" /> : <FaSortDown className="text-red-500" />;
  };

  if (loading) {
    return (
      <div className="space-y-6">
        {/* Header Skeleton */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="h-8 w-48 bg-gray-200 rounded animate-pulse mb-2"></div>
            <div className="h-4 w-64 bg-gray-200 rounded animate-pulse"></div>
          </div>
          <div className="flex items-center gap-3">
            <div className="h-10 w-32 bg-gray-200 rounded-lg animate-pulse"></div>
            <div className="h-10 w-32 bg-gray-200 rounded-lg animate-pulse"></div>
          </div>
        </div>

        {/* KPI Cards Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-gradient-to-r from-gray-200 to-gray-300 p-6 rounded-xl animate-pulse">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <div className="h-4 w-24 bg-gray-400 rounded"></div>
                  <div className="h-8 w-16 bg-gray-400 rounded"></div>
                  <div className="h-3 w-20 bg-gray-400 rounded"></div>
                </div>
                <div className="h-12 w-12 bg-gray-400 rounded"></div>
              </div>
            </div>
          ))}
        </div>

        {/* Reports List Skeleton */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="h-6 w-32 bg-gray-200 rounded animate-pulse"></div>
          </div>
          <div className="divide-y divide-gray-200">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="h-5 w-48 bg-gray-200 rounded animate-pulse"></div>
                      <div className="h-5 w-20 bg-gray-200 rounded-full animate-pulse"></div>
                      <div className="h-5 w-16 bg-gray-200 rounded-full animate-pulse"></div>
                    </div>
                    <div className="h-4 w-32 bg-gray-200 rounded animate-pulse mb-3"></div>
                    <div className="flex items-center gap-6">
                      {Array.from({ length: 3 }).map((_, j) => (
                        <div key={j} className="flex items-center gap-2">
                          <div className="h-4 w-12 bg-gray-200 rounded animate-pulse"></div>
                          <div className="h-4 w-8 bg-gray-200 rounded animate-pulse"></div>
                          <div className="h-4 w-4 bg-gray-200 rounded animate-pulse"></div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <div className="h-8 w-16 bg-gray-200 rounded-md animate-pulse"></div>
                    <div className="h-8 w-20 bg-gray-200 rounded-md animate-pulse"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Strategic Insights Skeleton */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="h-6 w-32 bg-gray-200 rounded animate-pulse mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="p-4 bg-gray-50 rounded-lg">
                <div className="h-5 w-32 bg-gray-200 rounded animate-pulse mb-2"></div>
                <div className="h-4 w-full bg-gray-200 rounded animate-pulse"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Strategic Reports</h1>
          <p className="text-gray-600 mt-1">Executive-level insights and strategic analysis</p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={selectedTimeframe}
            onChange={(e) => setSelectedTimeframe(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value="monthly">Monthly</option>
            <option value="quarterly">Quarterly</option>
            <option value="annual">Annual</option>
          </select>
          <button className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors">
            <FaChartLine />
            Generate Report
          </button>
        </div>
      </div>

      {/* Key Performance Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 rounded-xl text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100">Total Revenue Growth</p>
              <p className="text-2xl font-bold">+18.7%</p>
              <p className="text-sm text-blue-200">vs last quarter</p>
            </div>
            <FaAngleUp className="text-3xl text-blue-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-500 to-green-600 p-6 rounded-xl text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100">Market Share</p>
              <p className="text-2xl font-bold">34.2%</p>
              <p className="text-sm text-green-200">+2.1% increase</p>
            </div>
            <FaChartLine className="text-3xl text-green-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-6 rounded-xl text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100">Operational Efficiency</p>
              <p className="text-2xl font-bold">92.8%</p>
              <p className="text-sm text-purple-200">+5.3% improvement</p>
            </div>
            <FaAngleUp className="text-3xl text-purple-200" />
          </div>
        </div>
      </div>

      {/* Strategic Reports List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Available Reports</h2>
        </div>
        <div className="divide-y divide-gray-200">
          {reports.map((report) => (
            <div key={report.id} className="p-6 hover:bg-gray-50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-medium text-gray-900">{report.title}</h3>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getTypeColor(report.type)}`}>
                      {report.type}
                    </span>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(report.status)}`}>
                      {report.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 mb-3">
                    {report.timeframe} • Generated on {report.generatedDate}
                  </p>
                  
                  {/* Key Metrics */}
                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600">Revenue:</span>
                      <span className="font-medium text-gray-900">{report.keyMetrics.revenue}</span>
                      {getTrendIcon(report.keyMetrics.revenue)}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600">Growth:</span>
                      <span className="font-medium text-gray-900">{report.keyMetrics.growth}</span>
                      {getTrendIcon(report.keyMetrics.growth)}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600">Efficiency:</span>
                      <span className="font-medium text-gray-900">{report.keyMetrics.efficiency}</span>
                      {getTrendIcon(report.keyMetrics.efficiency)}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 ml-4">
                  {report.status === 'Ready' && (
                    <>
                      <button className="flex items-center gap-1 text-purple-600 hover:text-purple-800 px-3 py-2 rounded-md hover:bg-purple-50 transition-colors">
                        <FaEye className="text-sm" />
                        View
                      </button>
                      <button className="flex items-center gap-1 text-blue-600 hover:text-blue-800 px-3 py-2 rounded-md hover:bg-blue-50 transition-colors">
                        <FaDownload className="text-sm" />
                        Download
                      </button>
                    </>
                  )}
                  {report.status === 'Processing' && (
                    <span className="text-yellow-600 text-sm px-3 py-2">Processing...</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Strategic Insights */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Strategic Insights</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-4 bg-blue-50 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">Market Opportunities</h4>
            <p className="text-sm text-blue-800">
              Emerging markets showing 25% growth potential in Q1 2025. Recommend strategic expansion.
            </p>
          </div>
          <div className="p-4 bg-green-50 rounded-lg">
            <h4 className="font-medium text-green-900 mb-2">Operational Excellence</h4>
            <p className="text-sm text-green-800">
              Process optimization initiatives have improved efficiency by 12% this quarter.
            </p>
          </div>
          <div className="p-4 bg-purple-50 rounded-lg">
            <h4 className="font-medium text-purple-900 mb-2">Innovation Pipeline</h4>
            <p className="text-sm text-purple-800">
              3 new service offerings in development, projected to increase revenue by 8%.
            </p>
          </div>
          <div className="p-4 bg-orange-50 rounded-lg">
            <h4 className="font-medium text-orange-900 mb-2">Risk Mitigation</h4>
            <p className="text-sm text-orange-800">
              Identified and addressed 2 critical operational risks. Overall risk score improved.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}