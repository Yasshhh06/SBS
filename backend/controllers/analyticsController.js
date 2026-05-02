const { db } = require('../config/db');

// @desc    Get dashboard summary analytics
// @route   GET /api/analytics/summary
// @access  Private
const getAnalyticsSummary = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const appointmentsRef = db.collection('appointments');

    // Firestore count queries
    const totalBookingsSnap = await appointmentsRef.count().get();
    const todaysBookingsSnap = await appointmentsRef
      .where('date', '>=', today)
      .where('date', '<', tomorrow)
      .count()
      .get();
    
    const pendingSnap = await appointmentsRef
      .where('status', '==', 'Pending')
      .count()
      .get();

    // For revenue, we need to fetch documents since Firestore count doesn't sum string fields
    const completedDocs = await appointmentsRef
      .where('status', '==', 'Completed')
      .get();

    let totalRevenue = 0;
    completedDocs.forEach(doc => {
      const data = doc.data();
      if (data.totalAmount) {
        const match = String(data.totalAmount).match(/₹?(\d+)/);
        if (match) {
          totalRevenue += parseInt(match[1]);
        }
      }
    });

    res.json({
      totalBookings: totalBookingsSnap.data().count,
      todaysBookings: todaysBookingsSnap.data().count,
      totalRevenue,
      pendingAppointments: pendingSnap.data().count
    });
  } catch (error) {
    console.error('Analytics error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getAnalyticsSummary };
