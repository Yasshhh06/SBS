const { db } = require('../config/db');

// @desc    Get all appointments
// @route   GET /api/appointments
// @access  Private
const getAppointments = async (req, res) => {
  try {
    const { status, date, search } = req.query;
    
    let query = db.collection('appointments');
    
    if (status) {
      query = query.where('status', '==', status);
    }

    const limit = parseInt(req.query.limit) || 50;
    const snapshot = await query.orderBy('createdAt', 'desc').limit(limit).get();
    
    let appointments = [];
    snapshot.forEach(doc => {
      appointments.push({ _id: doc.id, ...doc.data() });
    });

    // In-memory filter for date and search due to Firestore limitations
    if (date) {
      const targetDate = new Date(date).toDateString();
      appointments = appointments.filter(app => {
        const appDate = app.date && app.date.toDate ? app.date.toDate() : new Date(app.date);
        return appDate.toDateString() === targetDate;
      });
    }

    if (search) {
      const lowerSearch = search.toLowerCase();
      appointments = appointments.filter(app => 
        (app.name && app.name.toLowerCase().includes(lowerSearch)) || 
        (app.mobile && app.mobile.includes(lowerSearch))
      );
    }

    // Populate services
    for (let app of appointments) {
      if (app.services && Array.isArray(app.services)) {
        const populatedServices = [];
        for (let srv of app.services) {
          // Check if srv is an object (already populated) or a string/id
          const id = typeof srv === 'string' ? srv : (srv._id || srv.id || srv);
          if (typeof id === 'string' || typeof id === 'number') {
            const srvDoc = await db.collection('services').doc(id.toString()).get();
            if (srvDoc.exists) {
              populatedServices.push({ _id: srvDoc.id, ...srvDoc.data() });
            }
          }
        }
        app.services = populatedServices;
      } else {
        app.services = [];
      }
    }

    res.json(appointments);
  } catch (error) {
    console.error('Error fetching appointments:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Create an appointment
// @route   POST /api/appointments
// @access  Private
const createAppointment = async (req, res) => {
  const { name, mobile, date, time, services, totalAmount, location, message } = req.body;

  try {
    const today = new Date();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    const datePrefix = `SBS-${mm}${dd}`;
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);
    
    // Count docs for today
    const snapshot = await db.collection('appointments')
      .where('createdAt', '>=', startOfDay)
      .where('createdAt', '<=', endOfDay)
      .get();
      
    const dailyCount = snapshot.size;
    const sequence = String(dailyCount + 1).padStart(2, '0');
    const locCode = (location && location.includes('Azade')) ? 'AZ' : 'LOC';
    const bookingId = `${datePrefix}-${locCode}${sequence}`;

    const appointmentData = {
      bookingId,
      name,
      mobile: mobile || '',
      date: new Date(date), // store as Date object or ISO string
      time,
      services: services || [],
      totalAmount: String(totalAmount),
      location: location || 'Azade Gaon, Dombivli East',
      message: message || '',
      status: 'Pending',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const docRef = await db.collection('appointments').add(appointmentData);
    const createdAppointment = { _id: docRef.id, ...appointmentData };
    res.status(201).json(createdAppointment);
  } catch (error) {
    console.error('Create appointment error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update appointment
// @route   PUT /api/appointments/:id
// @access  Private
const updateAppointment = async (req, res) => {
  const { name, mobile, date, time, services, totalAmount, location, message, status } = req.body;

  try {
    const docRef = db.collection('appointments').doc(req.params.id);
    const doc = await docRef.get();

    if (doc.exists) {
      const updateData = {
        updatedAt: new Date()
      };
      if (name !== undefined) updateData.name = name;
      if (mobile !== undefined) updateData.mobile = mobile;
      if (date !== undefined) updateData.date = new Date(date);
      if (time !== undefined) updateData.time = time;
      if (services !== undefined) updateData.services = services;
      if (totalAmount !== undefined) updateData.totalAmount = String(totalAmount);
      if (location !== undefined) updateData.location = location;
      if (message !== undefined) updateData.message = message;
      if (status !== undefined) updateData.status = status;

      await docRef.update(updateData);
      
      const updatedDoc = await docRef.get();
      res.json({ _id: updatedDoc.id, ...updatedDoc.data() });
    } else {
      res.status(404).json({ message: 'Appointment not found' });
    }
  } catch (error) {
    console.error('Update appointment error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update appointment status
// @route   PATCH /api/appointments/:id/status
// @access  Private
const updateAppointmentStatus = async (req, res) => {
  const { status } = req.body;

  try {
    const docRef = db.collection('appointments').doc(req.params.id);
    const doc = await docRef.get();

    if (doc.exists) {
      await docRef.update({ status, updatedAt: new Date() });
      const updatedDoc = await docRef.get();
      res.json({ _id: updatedDoc.id, ...updatedDoc.data() });
    } else {
      res.status(404).json({ message: 'Appointment not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete appointment
// @route   DELETE /api/appointments/:id
// @access  Private
const deleteAppointment = async (req, res) => {
  try {
    const docRef = db.collection('appointments').doc(req.params.id);
    const doc = await docRef.get();

    if (doc.exists) {
      await docRef.delete();
      res.json({ message: 'Appointment removed' });
    } else {
      res.status(404).json({ message: 'Appointment not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getAppointments, createAppointment, updateAppointment, updateAppointmentStatus, deleteAppointment };
