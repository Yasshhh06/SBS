import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import api from '../utils/api';
import { format } from 'date-fns';
import { parseDate } from '../utils/dateUtils';

const BookingModal = ({ isOpen, onClose, onRefresh, appointment = null }) => {
  const [servicesList, setServicesList] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    date: '',
    time: '',
    location: 'Azade Gaon, Dombivli East',
    message: '',
    services: [],
  });
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (isOpen) {
      const fetchServices = async () => {
        try {
          const { data } = await api.get('/services');
          setServicesList(data);
        } catch (error) {
          console.error('Failed to fetch services', error);
        }
      };
      fetchServices();
      
      if (appointment) {
        setFormData({
          name: appointment.name,
          mobile: appointment.mobile || '',
          date: format(parseDate(appointment.date), 'yyyy-MM-dd'),
          time: appointment.time,
          location: appointment.location,
          message: appointment.message || '',
          services: appointment.services.map(s => typeof s === 'object' ? s._id : s),
        });
      } else {
        // Reset form for new booking
        setFormData({
          name: '', mobile: '', date: '', time: '', location: 'Azade Gaon, Dombivli East', message: '', services: []
        });
      }
    }
  }, [isOpen, appointment]);

  const handleServiceToggle = (serviceId) => {
    setFormData(prev => {
      const isSelected = prev.services.includes(serviceId);
      if (isSelected) {
        return { ...prev, services: prev.services.filter(id => id !== serviceId) };
      } else {
        return { ...prev, services: [...prev.services, serviceId] };
      }
    });
  };

  const calculateTotal = () => {
    let total = 0;
    let hasConsultation = false;

    formData.services.forEach(id => {
      const service = servicesList.find(s => s._id === id);
      if (service) {
        if (service.price.includes('₹')) {
          const match = service.price.match(/₹(\d+)/);
          if (match) total += parseInt(match[1]);
        } else if (service.price.toLowerCase().includes('consultation') || service.price.toLowerCase().includes('length')) {
          hasConsultation = true;
        }
      }
    });

    return hasConsultation ? `₹${total} + Consultation` : `₹${total}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.services.length === 0) {
      alert("Please select at least one service.");
      return;
    }
    try {
      if (appointment) {
        await api.put(`/appointments/${appointment._id}`, {
          ...formData,
          totalAmount: calculateTotal()
        });
      } else {
        await api.post('/appointments', {
          ...formData,
          totalAmount: calculateTotal()
        });
      }
      onRefresh();
      onClose();
    } catch (error) {
      console.error('Failed to save appointment', error);
      alert('Failed to save appointment');
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-white dark:bg-gray-800 rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
        >
          <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-gray-800/50">
            <h2 className="text-xl font-bold text-gray-800 dark:text-white">
              {appointment ? `Edit Appointment (${appointment.bookingId})` : 'New Appointment'}
            </h2>
            <button onClick={onClose} className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-colors">
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
          
          <div className="p-6 overflow-y-auto flex-1">
            <form id="booking-form" onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Customer Name</label>
                  <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-salon-primary outline-none bg-white dark:bg-gray-700" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Mobile Number (Optional)</label>
                  <input type="text" value={formData.mobile} onChange={e => setFormData({...formData, mobile: e.target.value})} className="w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-salon-primary outline-none bg-white dark:bg-gray-700" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Date</label>
                  <input required type="date" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} className="w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-salon-primary outline-none bg-white dark:bg-gray-700" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Time</label>
                  <input required type="time" value={formData.time} onChange={e => setFormData({...formData, time: e.target.value})} className="w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-salon-primary outline-none bg-white dark:bg-gray-700" />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Services</label>
                  <input 
                    type="text" 
                    placeholder="Search services..." 
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className="text-xs px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 outline-none focus:ring-1 focus:ring-salon-primary w-40"
                  />
                </div>
                <div className="space-y-6">
                  {Object.entries(
                    servicesList
                      .filter(s => 
                        s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                        s.category.toLowerCase().includes(searchTerm.toLowerCase())
                      )
                      .reduce((acc, service) => {
                        if (!acc[service.category]) acc[service.category] = [];
                        acc[service.category].push(service);
                        return acc;
                      }, {})
                  ).map(([category, services]) => (
                    <div key={category} className="space-y-3">
                      <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider">{category}</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {services.map(service => (
                          <div 
                            key={service._id}
                            onClick={() => handleServiceToggle(service._id)}
                            className={`cursor-pointer border p-3 rounded-xl transition-all ${formData.services.includes(service._id) ? 'border-salon-primary bg-salon-pink/30 dark:bg-salon-primary/20' : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'}`}
                          >
                            <div className="flex justify-between items-start mb-1">
                              <span className="font-semibold text-sm text-gray-800 dark:text-gray-200">{service.name}</span>
                              <span className="text-salon-primary font-bold text-xs whitespace-nowrap ml-2">{service.price}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Location</label>
                <input 
                  type="text" 
                  value={formData.location} 
                  onChange={e => setFormData({...formData, location: e.target.value})} 
                  className="w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-salon-primary outline-none bg-white dark:bg-gray-700"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Notes (Optional)</label>
                <textarea rows="2" value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})} className="w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-salon-primary outline-none bg-white dark:bg-gray-700"></textarea>
              </div>
            </form>
          </div>
          
          <div className="p-6 border-t border-gray-100 dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-gray-800/50">
            <div>
              <p className="text-sm text-gray-500">Estimated Total</p>
              <p className="text-2xl font-bold text-salon-primary">{calculateTotal()}</p>
            </div>
            <div className="flex gap-3">
              <button type="button" onClick={onClose} className="px-6 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 font-medium hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-gray-700 dark:text-gray-300">
                Cancel
              </button>
              <button type="submit" form="booking-form" className="px-6 py-2.5 rounded-xl bg-salon-primary hover:bg-salon-secondary text-white font-semibold transition-colors shadow-lg shadow-pink-500/30">
                {appointment ? 'Update Appointment' : 'Create Booking'}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default BookingModal;
