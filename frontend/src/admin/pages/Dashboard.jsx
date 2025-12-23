import { useState, useEffect, useRef, useCallback } from 'react';
import { toast } from 'react-hot-toast';
import adminApi from '../services/api';
import BottomNav from '../components/BottomNav';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const toastShownRef = useRef(false);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalEnquiries: 0,
    newEnquiries: 0,
    contactedEnquiries: 0,
    closedEnquiries: 0
  });
  const [recentEnquiries, setRecentEnquiries] = useState([]);

  const fetchDashboardData = useCallback(async () => {
    try {
      setIsLoading(true);

      // Fetch dashboard stats
      const statsResponse = await adminApi.dashboard.getStats();
      const dashboardData = statsResponse.data || statsResponse;

      setStats({
        totalProducts: dashboardData.totalProducts || 0,
        totalEnquiries: dashboardData.totalEnquiries || 0,
        newEnquiries: dashboardData.newEnquiries || 0,
        contactedEnquiries: dashboardData.contactedEnquiries || 0,
        closedEnquiries: dashboardData.closedEnquiries || 0
      });

      // Fetch recent enquiries
      try {
        const enquiriesResponse = await adminApi.enquiries.getAll();
        // Since backend returns { success: true, data: [...] }, we need to access response.data.data
        const enquiriesData = enquiriesResponse.data?.data || enquiriesResponse.data || [];
        setRecentEnquiries(Array.isArray(enquiriesData) ? enquiriesData.slice(0, 5) : []);
      } catch (err) {
        console.log('Could not fetch enquiries:', err);
        setRecentEnquiries([]);
      }

      setLastUpdated(new Date());
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
      if (!toastShownRef.current) {
        toast.error('Failed to load dashboard data');
        toastShownRef.current = true;
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
    const interval = setInterval(fetchDashboardData, 60000); // Refresh every minute
    return () => clearInterval(interval);
  }, [fetchDashboardData]);

  const handleRefresh = async () => {
    toastShownRef.current = false;
    await fetchDashboardData();
    toast.success('Dashboard refreshed');
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'new': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'contacted': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'closed': return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  if (isLoading && !stats.totalProducts && !stats.totalEnquiries) {
    return (
      <div className="p-4 md:p-6 bg-black min-h-screen pb-20 md:pb-6 text-white">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400"></div>
        </div>
        <BottomNav />
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 bg-black min-h-screen pb-20 md:pb-6 text-white">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
            ChemZwap Dashboard
          </h1>
          {lastUpdated && (
            <p className="text-xs text-gray-400 mt-1">
              Last updated: {lastUpdated.toLocaleTimeString()}
            </p>
          )}
        </div>
        <button
          onClick={handleRefresh}
          disabled={isLoading}
          className={`flex items-center gap-2 bg-cyan-600 text-white px-6 py-2.5 rounded-lg transition-all ${isLoading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-cyan-500'
            }`}
        >
          <svg className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24">
            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Refresh
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {/* Total Products */}
        <Link to="/admin/products" className="bg-gradient-to-br from-blue-600/20 to-blue-800/20 p-4 md:p-6 rounded-xl border border-blue-500/30 hover:border-blue-400 transition-all group">
          <div className="flex items-center justify-between mb-2">
            <span className="text-blue-400 text-2xl">📦</span>
            <span className="text-xs text-blue-300 bg-blue-500/20 px-2 py-1 rounded-full">View All →</span>
          </div>
          <p className="text-3xl md:text-4xl font-bold text-white">{stats.totalProducts}</p>
          <p className="text-sm text-gray-400 mt-1">Total Products</p>
        </Link>

        {/* Total Enquiries */}
        <Link to="/admin/enquiries" className="bg-gradient-to-br from-purple-600/20 to-purple-800/20 p-4 md:p-6 rounded-xl border border-purple-500/30 hover:border-purple-400 transition-all group">
          <div className="flex items-center justify-between mb-2">
            <span className="text-purple-400 text-2xl">📋</span>
            <span className="text-xs text-purple-300 bg-purple-500/20 px-2 py-1 rounded-full">View All →</span>
          </div>
          <p className="text-3xl md:text-4xl font-bold text-white">{stats.totalEnquiries}</p>
          <p className="text-sm text-gray-400 mt-1">Total Enquiries</p>
        </Link>

        {/* New Enquiries */}
        <div className="bg-gradient-to-br from-green-600/20 to-green-800/20 p-4 md:p-6 rounded-xl border border-green-500/30">
          <div className="flex items-center justify-between mb-2">
            <span className="text-green-400 text-2xl">🆕</span>
            <span className="text-xs text-green-300 bg-green-500/20 px-2 py-1 rounded-full">New</span>
          </div>
          <p className="text-3xl md:text-4xl font-bold text-white">{stats.newEnquiries}</p>
          <p className="text-sm text-gray-400 mt-1">New Enquiries</p>
        </div>

        {/* Contacted Enquiries */}
        <div className="bg-gradient-to-br from-yellow-600/20 to-yellow-800/20 p-4 md:p-6 rounded-xl border border-yellow-500/30">
          <div className="flex items-center justify-between mb-2">
            <span className="text-yellow-400 text-2xl">📞</span>
            <span className="text-xs text-yellow-300 bg-yellow-500/20 px-2 py-1 rounded-full">In Progress</span>
          </div>
          <p className="text-3xl md:text-4xl font-bold text-white">{stats.contactedEnquiries}</p>
          <p className="text-sm text-gray-400 mt-1">Contacted</p>
        </div>
      </div>

      {/* Enquiry Status Overview */}
      <div className="bg-gray-900/50 rounded-xl border border-gray-800 p-4 md:p-6 mb-6">
        <h2 className="text-lg font-semibold text-white mb-4">Enquiry Status Overview</h2>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 bg-green-500/10 rounded-lg p-4 border border-green-500/20">
            <div className="flex items-center justify-between">
              <span className="text-green-400 font-medium">New</span>
              <span className="text-2xl font-bold text-green-400">{stats.newEnquiries}</span>
            </div>
            <div className="mt-2 bg-gray-800 rounded-full h-2">
              <div
                className="bg-green-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${stats.totalEnquiries > 0 ? (stats.newEnquiries / stats.totalEnquiries) * 100 : 0}%` }}
              ></div>
            </div>
          </div>
          <div className="flex-1 bg-yellow-500/10 rounded-lg p-4 border border-yellow-500/20">
            <div className="flex items-center justify-between">
              <span className="text-yellow-400 font-medium">Contacted</span>
              <span className="text-2xl font-bold text-yellow-400">{stats.contactedEnquiries}</span>
            </div>
            <div className="mt-2 bg-gray-800 rounded-full h-2">
              <div
                className="bg-yellow-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${stats.totalEnquiries > 0 ? (stats.contactedEnquiries / stats.totalEnquiries) * 100 : 0}%` }}
              ></div>
            </div>
          </div>
          <div className="flex-1 bg-gray-500/10 rounded-lg p-4 border border-gray-500/20">
            <div className="flex items-center justify-between">
              <span className="text-gray-400 font-medium">Closed</span>
              <span className="text-2xl font-bold text-gray-400">{stats.closedEnquiries}</span>
            </div>
            <div className="mt-2 bg-gray-800 rounded-full h-2">
              <div
                className="bg-gray-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${stats.totalEnquiries > 0 ? (stats.closedEnquiries / stats.totalEnquiries) * 100 : 0}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Enquiries */}
      <div className="bg-gray-900/50 rounded-xl border border-gray-800 p-4 md:p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-white">Recent Enquiries</h2>
          <Link to="/admin/enquiries" className="text-cyan-400 hover:text-cyan-300 text-sm">View All →</Link>
        </div>

        {recentEnquiries.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-4xl mb-2">📭</div>
            <p className="text-gray-400">No enquiries yet</p>
            <p className="text-sm text-gray-500">Enquiries from customers will appear here</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-700">
              <thead>
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">Customer</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">Product</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">Email</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {recentEnquiries.map((enquiry) => (
                  <tr key={enquiry.id} className="hover:bg-gray-800/50 transition-colors">
                    <td className="px-4 py-3 text-sm text-white font-medium">{enquiry.customer_name}</td>
                    <td className="px-4 py-3 text-sm text-gray-300 max-w-xs truncate">{enquiry.product_name}</td>
                    <td className="px-4 py-3 text-sm text-cyan-400">{enquiry.email}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 text-xs rounded-full border ${getStatusColor(enquiry.status)}`}>
                        {enquiry.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-400">
                      {new Date(enquiry.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-4 mt-6">
        <Link
          to="/admin/products"
          className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white p-4 rounded-xl transition-all"
        >
          <span className="text-xl">📦</span>
          <span>Manage Products</span>
        </Link>
        <Link
          to="/admin/enquiries"
          className="flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-500 text-white p-4 rounded-xl transition-all"
        >
          <span className="text-xl">📋</span>
          <span>View Enquiries</span>
        </Link>
      </div>

      <BottomNav />
    </div>
  );
};

export default Dashboard;