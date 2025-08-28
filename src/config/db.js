const mongoose = require('mongoose');

// Connect to MongoDB database
const connectDB = async () => {
  try {
    const uri =
      process.env.MONGO_URI ||
      'mongodb+srv://5umit:RnRvSoBGSxJ1LsLL@5umit.ziksdbl.mongodb.net/?retryWrites=true&w=majority&appName=5umit';
    await mongoose.connect(uri);
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection failed:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
