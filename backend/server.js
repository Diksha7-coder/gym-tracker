require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { connectDB, getInMemoryStatus } = require('./config/db');
const fitnessRoutes = require('./routes/fitness');
const authRoutes = require('./routes/auth');

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB (will automatically toggle In-Memory Mode if DB is not running)
connectDB();

// Middlewares
app.use(cors({
  origin: '*', // Allow all origins for local pairing/testing
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Routes
app.use('/api/fitness', fitnessRoutes);
app.use('/api/auth', authRoutes);

// Health check endpoint to diagnose environment setup in real-time
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    mode: getInMemoryStatus() ? 'IN-MEMORY TEST MODE (No MongoDB service detected)' : 'LIVE MONGODB MODE',
    timestamp: new Date()
  });
});

// Root fallback check
app.get('/', (req, res) => {
  res.send('🌌 AURA Fitness Core AI Backend is Online.');
});

// Start Server
app.listen(PORT, () => {
  console.log(`===================================================`);
  console.log(`🌌 AURA Fitness AI Server booted on port ${PORT}`);
  console.log(`🌍 Health Check: http://localhost:${PORT}/api/health`);
  console.log(`===================================================`);
});
