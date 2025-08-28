require('dotenv').config();
const mongoose = require('mongoose');

const Category = require('./src/models/Category');
const connectDB = require('./src/config/db');

const categories = [
  {
    name: 'Electronics',
    subcategories: [
      'Mobiles',
      'Laptops',
      'Tablets',
      'Cameras',
      'Audio',
      'Accessories',
    ],
  },
  {
    name: 'Home Appliances',
    subcategories: [
      'Refrigerators',
      'Washing Machines',
      'Microwaves',
      'Air Conditioners',
      'Kitchen Appliances',
      'Vacuum Cleaners',
    ],
  },
];

(async () => {
  try {
    await connectDB();

    for (const cat of categories) {
      const existing = await Category.findOne({ name: cat.name });
      if (existing) {
        existing.subcategories = cat.subcategories;
        await existing.save();
        console.log(`Updated: ${cat.name}`);
      } else {
        await Category.create(cat);
        console.log(`Created: ${cat.name}`);
      }
    }

    console.log('Seeding complete.');
    await mongoose.connection.close();
    process.exit(0);
  } catch (err) {
    console.error('Seeding failed:', err);
    await mongoose.connection.close();
    process.exit(1);
  }
})();
