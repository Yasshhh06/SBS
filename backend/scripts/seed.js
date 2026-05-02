const dotenv = require('dotenv');
const { db } = require('../config/db');

dotenv.config();

const services = [
  // Facial
  { category: 'Facial', name: 'Herbal Facial', price: '₹400', description: 'Gentle herbal facial for refreshed and healthy skin.' },
  { category: 'Facial', name: 'Chandan Facial', price: '₹400', description: 'Cooling sandalwood facial for calm skin.' },
  { category: 'Facial', name: 'Fruit Facial', price: '₹500', description: 'Fruit-based facial for natural glow.' },
  { category: 'Facial', name: 'Papaya Facial', price: '₹500', description: 'Brightening facial to improve skin texture.' },
  { category: 'Facial', name: 'Coffee Facial', price: '₹450', description: 'Revitalizing coffee facial for tired skin.' },
  { category: 'Facial', name: 'D-Tan Facial', price: '₹450', description: 'Removes tan and restores natural tone.' },
  { category: 'Facial', name: 'Whitening Facial', price: '₹500', description: 'Facial treatment for brighter complexion.' },

  // Advance Facial
  { category: 'Advance Facial', name: 'Rich Feel Whitening Facial', price: '₹600', description: 'Advanced facial for instant brightness.' },
  { category: 'Advance Facial', name: 'Lotus Facial', price: 'Price on consultation', description: 'Premium lotus-based skin treatment.' },
  { category: 'Advance Facial', name: 'O3+ Facial', price: 'Price on consultation', description: 'Professional O3+ facial for deep nourishment.' },
  { category: 'Advance Facial', name: 'Ragga Facial', price: 'Price on consultation', description: 'Specialized facial for skin rejuvenation.' },
  { category: 'Advance Facial', name: 'Aroma Sound Therapy Facial', price: 'Price on consultation', description: 'Relaxing facial with aroma therapy benefits.' },

  // Clean-Up
  { category: 'Clean-Up', name: 'Herbal Clean-Up', price: '₹350', description: 'Natural clean-up for fresh skin.' },
  { category: 'Clean-Up', name: 'Fruit Clean-Up', price: '₹300', description: 'Fruit-based clean-up for glow.' },
  { category: 'Clean-Up', name: 'Whitening Clean-Up', price: '₹370', description: 'Brightening clean-up for even tone.' },
  { category: 'Clean-Up', name: 'Papaya Clean-Up', price: '₹370', description: 'Exfoliating papaya clean-up.' },
  { category: 'Clean-Up', name: 'D-Tan Clean-Up', price: '₹300', description: 'Removes tan and dullness.' },

  // Bleach
  { category: 'Bleach', name: 'Herbal Bleach', price: 'Front ₹150 | Back ₹70', description: 'Natural herbal bleach for skin brightening.' },
  { category: 'Bleach', name: 'Gold Bleach', price: 'Price on consultation', description: 'Premium gold bleach for radiant skin.' },
  { category: 'Bleach', name: 'Anti-Ageing Bleach', price: 'Price on consultation', description: 'Bleach with anti-ageing benefits.' },
  { category: 'Bleach', name: 'D-Tan Bleach', price: 'Front ₹200 | Back ₹90', description: 'Bleach with tan removal properties.' },
  { category: 'Bleach', name: 'D-Tan Full Hand', price: '₹300', description: 'Complete tan removal for hands.' },
  { category: 'Bleach', name: 'D-Tan Legs (Half)', price: '₹350', description: 'Tan removal for half legs.' },

  // Treatment Facial
  { category: 'Treatment Facial', name: 'Acne / Pimple Treatment Facial', price: 'Price on consultation', description: 'Targeted treatment to reduce acne and pimples.' },
  { category: 'Treatment Facial', name: 'Anti-Ageing Treatment Facial', price: 'Price on consultation', description: 'Reduces fine lines and improves skin youthfulness.' },
  { category: 'Treatment Facial', name: 'Skin Tightening Facial', price: 'Price on consultation', description: 'Treatment to improve skin firmness and elasticity.' },
  { category: 'Treatment Facial', name: 'Skin Glow Treatment', price: 'Price on consultation', description: 'Enhances skin brightness and natural glow.' },
  { category: 'Treatment Facial', name: 'Pigmentation Treatment Facial', price: 'Price on consultation', description: 'Helps lighten pigmentation and uneven skin tone.' },

  // Waxing
  { category: 'Waxing', name: 'Chocolate Wax – Hand', price: 'Half ₹200 | Full ₹200', description: 'Smooth chocolate waxing for soft hands.' },
  { category: 'Waxing', name: 'Chocolate Wax – Legs', price: 'Half ₹200 | Full ₹400', description: 'Chocolate waxing for smooth legs.' },
  { category: 'Waxing', name: 'White Chocolate Wax – Hand', price: 'Half ₹250 | Full ₹250', description: 'Premium white chocolate waxing for hands.' },
  { category: 'Waxing', name: 'White Chocolate Wax – Legs', price: 'Half ₹250 | Full ₹500', description: 'Premium white chocolate waxing for legs.' },
  { category: 'Waxing', name: 'Rica Hand Wax', price: '₹350', description: 'Gentle Rica waxing for hands.' },
  { category: 'Waxing', name: 'Rica Legs Wax', price: '₹600', description: 'Gentle Rica waxing for legs.' },
  { category: 'Waxing', name: 'Rica Face Wax', price: '₹150', description: 'Gentle Rica waxing for face.' },
  { category: 'Waxing', name: 'Chocolate Face Wax', price: '₹100', description: 'Chocolate waxing for facial hair removal.' },

  // Manicure
  { category: 'Manicure', name: 'Normal Manicure', price: '₹350', description: 'Basic nail and skin care for hands.' },
  { category: 'Manicure', name: 'Manicure with D-Tan', price: '₹550', description: 'Manicure with tan removal treatment.' },
  { category: 'Manicure', name: 'Manicure with Bleach', price: '₹550', description: 'Brightening manicure with bleach.' },

  // Pedicure
  { category: 'Pedicure', name: 'Normal Pedicure', price: '₹350', description: 'Basic nail and skin care for feet.' },
  { category: 'Pedicure', name: 'Pedicure with D-Tan', price: '₹550', description: 'Pedicure with tan removal treatment.' },
  { category: 'Pedicure', name: 'Pedicure with Bleach', price: '₹550', description: 'Brightening pedicure with bleach.' },

  // Hair
  { category: 'Hair', name: 'Hair Spa', price: '₹500 – ₹1000', description: 'Deep conditioning hair spa treatment.' },
  { category: 'Hair', name: 'Head Massage', price: '₹350', description: 'Relaxing head massage for stress relief.' },
  { category: 'Hair', name: 'Hair Fall Treatment', price: '₹380', description: 'Treatment to reduce hair fall.' },
  { category: 'Hair', name: 'Dandruff Treatment', price: '₹380', description: 'Anti-dandruff scalp care.' },
  { category: 'Hair', name: 'Hair Colour (Grey Coverage)', price: '₹400 – ₹1200', description: 'Natural-looking colour coverage for grey hair.' },
  { category: 'Hair', name: 'Hair Colour Application', price: '₹150 – ₹250', description: 'Professional colour application for even finish.' },
  { category: 'Hair', name: 'Mehndi Application', price: '₹300 – ₹400', description: 'Herbal mehndi application for natural conditioning.' },
  { category: 'Hair', name: 'Highlighting', price: '₹1000 – ₹1500', description: 'Professional hair highlighting service.' },
  { category: 'Hair', name: 'Global Highlighting', price: '₹2000', description: 'Full head highlighting for a complete look.' },
  { category: 'Hair', name: 'Hair Straightening', price: 'Depends on hair length', description: 'Professional hair straightening treatment.' },
  { category: 'Hair', name: 'Hair Smoothing', price: 'Depends on hair length', description: 'Smoothing treatment for frizz-free hair.' },
  { category: 'Hair', name: 'Botox Treatment', price: 'Depends on hair length', description: 'Hair botox for deep conditioning and repair.' },
  { category: 'Hair', name: 'Nanoplasty', price: 'Depends on hair length', description: 'Advanced nanoplasty hair treatment.' },
  { category: 'Hair', name: 'Hairoplasty', price: 'Depends on hair length', description: 'Premium hairoplasty treatment.' },
];

const importData = async () => {
  try {
    const servicesRef = db.collection('services');
    
    // Delete existing services
    const snapshot = await servicesRef.get();
    const batch = db.batch();
    snapshot.docs.forEach((doc) => {
      batch.delete(doc.ref);
    });
    await batch.commit();

    console.log('Cleared existing services.');

    // Insert new services
    const insertBatch = db.batch();
    services.forEach((service) => {
      const newRef = servicesRef.doc();
      insertBatch.set(newRef, {
        ...service,
        createdAt: new Date(),
        updatedAt: new Date()
      });
    });
    await insertBatch.commit();

    console.log('Data Imported to Firestore!');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

importData();
