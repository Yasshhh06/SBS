import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '../utils/api';
import { CalendarCheck, CalendarDays, DollarSign, Clock, Plus, ArrowRight, User, Phone, Edit3 } from 'lucide-react';
import { format } from 'date-fns';
import { parseDate } from '../utils/dateUtils';
import BookingModal from '../components/BookingModal';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalBookings: 0,
    todaysBookings: 0,
    totalRevenue: 0,
    pendingAppointments: 0,
  });
  const [recentAppointments, setRecentAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  const fetchData = async () => {
    try {
      const [statsRes, recentRes] = await Promise.all([
        api.get('/analytics/summary'),
        api.get('/appointments?limit=5')
      ]);
      setStats(statsRes.data || { totalBookings: 0, todaysBookings: 0, totalRevenue: 0, pendingAppointments: 0 });
      setRecentAppointments(Array.isArray(recentRes.data) ? recentRes.data.slice(0, 5) : []);
    } catch (error) {
      console.error('Failed to fetch dashboard data', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleEdit = (appointment) => {
    setSelectedAppointment(appointment);
    setIsModalOpen(true);
  };

  const closePickModal = () => {
    setIsModalOpen(false);
    setSelectedAppointment(null);
  };

  const cards = [
    { title: 'Total Bookings', value: stats.totalBookings, icon: CalendarCheck, color: 'bg-blue-500', shadow: 'shadow-blue-500/30' },
    { title: "Today's Bookings", value: stats.todaysBookings, icon: CalendarDays, color: 'bg-green-500', shadow: 'shadow-green-500/30' },
    { title: 'Total Revenue', value: `₹${stats.totalRevenue}`, icon: DollarSign, color: 'bg-salon-primary', shadow: 'shadow-pink-500/30' },
    { title: 'Pending Actions', value: stats.pendingAppointments, icon: Clock, color: 'bg-yellow-500', shadow: 'shadow-yellow-500/30' },
  ];

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-salon-primary"></div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex justify-between items-center mb-2">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Dashboard Overview</h1>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-salon-primary hover:bg-salon-secondary text-white font-semibold shadow-lg shadow-pink-500/20 transition-all active:scale-95"
        >
          <Plus className="w-5 h-5" /> Quick Booking
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, index) => {
          const Icon = card.icon;
          return (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="glass p-6 rounded-3xl flex items-center justify-between border border-white/20 dark:border-gray-700/30"
            >
              <div>
                <p className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-1">{card.title}</p>
                <h3 className="text-3xl font-bold text-gray-800 dark:text-white">{card.value}</h3>
              </div>
              <div className={`${card.color} w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg ${card.shadow}`}>
                <Icon className="w-7 h-7 text-white" />
              </div>
            </motion.div>
          );
        })}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Appointments */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-2 glass rounded-3xl overflow-hidden border border-white/20 dark:border-gray-700/30"
        >
          <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
            <h3 className="text-lg font-bold text-gray-800 dark:text-white">Recent Bookings</h3>
            <Link to="/appointments" className="text-salon-primary text-sm font-semibold flex items-center gap-1 hover:underline">
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50/50 dark:bg-gray-800/50">
                <tr>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Customer</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Service</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {recentAppointments.length === 0 ? (
                  <tr><td colSpan="3" className="px-6 py-8 text-center text-gray-500">No recent bookings</td></tr>
                ) : (
                  recentAppointments.map((app) => (
                    <tr key={app._id} className="hover:bg-white/40 dark:hover:bg-gray-800/40 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-pink-100 dark:bg-pink-900/30 flex items-center justify-center text-salon-primary">
                            <User className="w-5 h-5" />
                          </div>
                          <div>
                            <div className="font-semibold text-gray-800 dark:text-gray-200">{app.name}</div>
                            <div className="text-xs text-gray-500">{app.mobile || 'No Phone'}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-700 dark:text-gray-300 font-medium">
                          {app.services && app.services[0] ? app.services[0].name : 'General Service'}
                        </div>
                        <div className="text-xs text-gray-500">{format(parseDate(app.date), 'MMM dd')} at {app.time}</div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button 
                          onClick={() => handleEdit(app)}
                          className="p-2 text-gray-400 hover:text-salon-primary hover:bg-pink-50 dark:hover:bg-pink-900/20 rounded-xl transition-all opacity-0 group-hover:opacity-100"
                        >
                          <Edit3 className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Quick Tips / Analytics Summary */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="glass p-6 rounded-3xl border border-white/20 dark:border-gray-700/30 flex flex-col"
        >
          <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4">Quick Insights</h3>
          <div className="space-y-4 flex-1">
            <div className="p-4 rounded-2xl bg-pink-50 dark:bg-pink-900/10 border border-pink-100 dark:border-pink-900/20">
              <p className="text-xs text-pink-600 dark:text-pink-400 font-bold uppercase mb-1">Top Service This Week</p>
              <p className="text-lg font-bold text-gray-800 dark:text-white">Hair Smoothing</p>
            </div>
            <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/20">
              <p className="text-xs text-blue-600 dark:text-blue-400 font-bold uppercase mb-1">Estimated Revenue Today</p>
              <p className="text-lg font-bold text-gray-800 dark:text-white">₹{stats.todaysBookings * 450}+</p>
            </div>
          </div>
        </motion.div>
      </div>

      <BookingModal 
        isOpen={isModalOpen} 
        appointment={selectedAppointment}
        onClose={closePickModal} 
        onRefresh={fetchData}
      />
    </div>
  );
};

export default Dashboard;
