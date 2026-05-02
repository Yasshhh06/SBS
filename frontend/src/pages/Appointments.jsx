import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import BookingModal from '../components/BookingModal';
import { Search, Plus, Download, Trash2, CheckCircle, XCircle, Edit3 } from 'lucide-react';
import { format } from 'date-fns';
import { parseDate } from '../utils/dateUtils';

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  
  // Filters
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      let query = '?';
      if (search) query += `search=${search}&`;
      if (statusFilter) query += `status=${statusFilter}&`;
      if (dateFilter) query += `date=${dateFilter}`;
      
      const { data } = await api.get(`/appointments${query}`);
      setAppointments(data);
    } catch (error) {
      console.error('Failed to fetch appointments', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchAppointments();
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [search, statusFilter, dateFilter]);

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      await api.patch(`/appointments/${id}/status`, { status: newStatus });
      fetchAppointments();
    } catch (error) {
      alert('Failed to update status');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this appointment?')) {
      try {
        await api.delete(`/appointments/${id}`);
        fetchAppointments();
      } catch (error) {
        alert('Failed to delete appointment');
      }
    }
  };

  const handleEdit = (appointment) => {
    setSelectedAppointment(appointment);
    setIsModalOpen(true);
  };

  const closePickModal = () => {
    setIsModalOpen(false);
    setSelectedAppointment(null);
  };

  const exportCSV = () => {
    if (appointments.length === 0) return;
    const headers = ['Booking ID', 'Name', 'Mobile', 'Date', 'Time', 'Total Amount', 'Status', 'Location', 'Message'];
    const csvContent = [
      headers.join(','),
      ...appointments.map(a => [
        a.bookingId || '',
        a.name,
        a.mobile || '',
        format(parseDate(a.date), 'yyyy-MM-dd'),
        a.time,
        a.totalAmount,
        a.status,
        a.location,
        a.message?.replace(/,/g, '') || ''
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `appointments_${format(new Date(), 'yyyyMMdd')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getStatusBadge = (status) => {
    switch(status) {
      case 'Confirmed': return <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium border border-green-200">Confirmed</span>;
      case 'Completed': return <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium border border-blue-200">Completed</span>;
      case 'Cancelled': return <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium border border-red-200">Cancelled</span>;
      default: return <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-medium border border-yellow-200">Pending</span>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="glass p-6 rounded-3xl flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
          <div className="relative">
            <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search name or mobile..."
              className="pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-800/50 outline-none focus:ring-2 focus:ring-salon-primary w-full md:w-64"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <select 
            className="px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-800/50 outline-none"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="Confirmed">Confirmed</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
          </select>
          <input 
            type="date"
            className="px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-800/50 outline-none"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
          />
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <button onClick={exportCSV} className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium transition-colors">
            <Download className="w-5 h-5" /> Export
          </button>
          <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-salon-primary hover:bg-salon-secondary text-white font-medium shadow-lg shadow-pink-500/30 transition-all">
            <Plus className="w-5 h-5" /> Add Booking
          </button>
        </div>
      </div>

      <div className="glass rounded-3xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700">
                <th className="px-6 py-4 font-semibold text-gray-600 dark:text-gray-300 text-sm">Booking ID</th>
                <th className="px-6 py-4 font-semibold text-gray-600 dark:text-gray-300 text-sm">Customer</th>
                <th className="px-6 py-4 font-semibold text-gray-600 dark:text-gray-300 text-sm">Date & Time</th>
                <th className="px-6 py-4 font-semibold text-gray-600 dark:text-gray-300 text-sm">Services</th>
                <th className="px-6 py-4 font-semibold text-gray-600 dark:text-gray-300 text-sm">Total</th>
                <th className="px-6 py-4 font-semibold text-gray-600 dark:text-gray-300 text-sm">Status</th>
                <th className="px-6 py-4 font-semibold text-gray-600 dark:text-gray-300 text-sm text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {loading ? (
                <tr><td colSpan="7" className="text-center py-8">Loading...</td></tr>
              ) : appointments.length === 0 ? (
                <tr><td colSpan="7" className="text-center py-8 text-gray-500">No appointments found.</td></tr>
              ) : (
                appointments.map(app => (
                  <tr key={app._id} className="hover:bg-white/40 dark:hover:bg-gray-800/40 transition-colors">
                    <td className="px-6 py-4">
                      <span className="font-mono text-xs font-bold bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded border border-gray-200 dark:border-gray-600">
                        {app.bookingId || 'N/A'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-800 dark:text-gray-200">{app.name}</div>
                      <div className="text-sm text-gray-500 flex items-center gap-2">
                        {app.mobile || 'N/A'}
                        {app.mobile && (
                          <a 
                            href={`https://wa.me/${app.mobile.replace(/\D/g, '')}`} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-green-500 hover:text-green-600"
                            title="Message on WhatsApp"
                          >
                            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.72.937 3.659 1.432 5.631 1.433h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                            </svg>
                          </a>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-gray-800 dark:text-gray-200">{format(parseDate(app.date), 'MMM dd, yyyy')}</div>
                      <div className="text-sm text-gray-500">{app.time}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-600 dark:text-gray-400 max-w-[200px] truncate">
                        {app.services.map(s => s.name).join(', ')}
                      </div>
                      <div className="text-xs text-gray-400">{app.location}</div>
                    </td>
                    <td className="px-6 py-4 font-bold text-salon-primary">{app.totalAmount}</td>
                    <td className="px-6 py-4">{getStatusBadge(app.status)}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => handleEdit(app)} className="p-1.5 text-blue-500 hover:bg-blue-100 rounded-lg transition-colors" title="Edit">
                          <Edit3 className="w-5 h-5" />
                        </button>
                        {app.status === 'Pending' && (
                          <button onClick={() => handleStatusUpdate(app._id, 'Confirmed')} className="p-1.5 text-green-600 hover:bg-green-100 rounded-lg transition-colors" title="Confirm">
                            <CheckCircle className="w-5 h-5" />
                          </button>
                        )}
                        {app.status === 'Confirmed' && (
                          <button onClick={() => handleStatusUpdate(app._id, 'Completed')} className="p-1.5 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors" title="Mark Completed">
                            <CheckCircle className="w-5 h-5" />
                          </button>
                        )}
                        {(app.status === 'Pending' || app.status === 'Confirmed') && (
                          <button onClick={() => handleStatusUpdate(app._id, 'Cancelled')} className="p-1.5 text-orange-600 hover:bg-orange-100 rounded-lg transition-colors" title="Cancel">
                            <XCircle className="w-5 h-5" />
                          </button>
                        )}
                        <button onClick={() => handleDelete(app._id)} className="p-1.5 text-red-600 hover:bg-red-100 rounded-lg transition-colors" title="Delete">
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <BookingModal 
        isOpen={isModalOpen} 
        appointment={selectedAppointment}
        onClose={closePickModal} 
        onRefresh={fetchAppointments}
      />
    </div>
  );
};

export default Appointments;
