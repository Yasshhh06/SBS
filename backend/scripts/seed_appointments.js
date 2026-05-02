const dotenv = require('dotenv');
const path = require('path');
const { db } = require('../config/db');

dotenv.config({ path: path.join(__dirname, '../.env') });

const seedAppointments = async () => {
  try {
    const servicesRef = db.collection('services');
    const servicesSnap = await servicesRef.get();
    
    let defaultService = [];
    if (!servicesSnap.empty) {
      defaultService = [servicesSnap.docs[0].id];
    }

    const dummyData = [
      {
        bookingId: 'SBS-1025-AZ01',
        name: 'Dummy Customer 1',
        mobile: '',
        date: new Date('2026-05-01'),
        time: '10:00',
        location: 'Azade Gaon, Dombivli East',
        services: defaultService,
        totalAmount: '₹500',
        status: 'Confirmed',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        bookingId: 'SBS-1025-SP02',
        name: 'Dummy Customer 2',
        mobile: '',
        date: new Date('2026-05-01'),
        time: '11:30',
        location: 'Sonarpada, Dombivli East',
        services: defaultService,
        totalAmount: '₹750',
        status: 'Pending',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        bookingId: 'SBS-1026-AK0',
        name: 'Dummy Customer 3',
        mobile: '',
        date: new Date('2026-05-02'),
        time: '14:00',
        location: 'Anantam Residency, Dombivli East',
        services: defaultService,
        totalAmount: '₹400',
        status: 'Pending',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        bookingId: 'SBS-1026-GR04',
        name: 'Shalaka Patil',
        mobile: '+91 9300000822',
        date: new Date('2026-05-02'),
        time: '16:00',
        location: 'Gupte Road, Dombivli West',
        services: defaultService,
        totalAmount: '₹1200',
        status: 'Confirmed',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        bookingId: 'SBS-BR-1030-KY05',
        name: 'Bridal Group (8 Members)',
        mobile: '',
        date: new Date('2026-05-10'),
        time: '08:00',
        location: 'Kalyan East',
        services: defaultService,
        totalAmount: 'Price on consultation',
        status: 'Pending',
        message: 'Bridal Group (8 Members)',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    const appointmentsRef = db.collection('appointments');
    const batch = db.batch();

    for (const data of dummyData) {
      // Use query to check if it exists
      const existing = await appointmentsRef.where('bookingId', '==', data.bookingId).get();
      if (existing.empty) {
        const newRef = appointmentsRef.doc();
        batch.set(newRef, data);
      } else {
        // Update existing
        batch.update(existing.docs[0].ref, data);
      }
    }

    await batch.commit();

    console.log('Dummy appointments seeded successfully!');
    process.exit();
  } catch (error) {
    console.error(`Error seeding appointments: ${error.message}`);
    process.exit(1);
  }
};

seedAppointments();
