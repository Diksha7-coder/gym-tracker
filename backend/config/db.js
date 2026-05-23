const mongoose = require('mongoose');

let isInMemory = false;
// Simple in-memory storage fallback for test sessions if MongoDB is unavailable
const memoryDb = {
  users: [],
  plans: []
};

async function connectDB() {
  const mongoURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/gym-tracker';
  try {
    // Set connection timeout options so it doesn't hang indefinitely
    mongoose.set('strictQuery', false);
    await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 3000
    });
    console.log('🔌 MongoDB Connected Successfully!');
    isInMemory = false;
  } catch (error) {
    console.error('⚠️ MongoDB Connection Failed:', error.message);
    console.log('🔄 Server starting in IN-MEMORY MODE. Data will be saved temporarily in memory and reset on server restart.');
    isInMemory = true;
  }
}

module.exports = {
  connectDB,
  getInMemoryStatus: () => isInMemory,
  memoryDb
};
