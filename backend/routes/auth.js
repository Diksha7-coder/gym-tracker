const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const auth = require('../middleware/auth');
const { generateAIFitnessPlan } = require('../services/openaiService');
const { getInMemoryStatus, memoryDb } = require('../config/db');

// Helper to sign JWT tokens
function signToken(userId) {
  return jwt.sign(
    { id: userId }, 
    process.env.JWT_SECRET || 'AURA_FITNESS_JWT_SECRET_KEY',
    { expiresIn: '30d' }
  );
}

/**
 * @route   POST /api/auth/register
 * @desc    Create a new account, generate custom AI plan, and login
 * @access  Public
 */
router.post('/register', async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      age,
      gender,
      height,
      weight,
      medicalConditions,
      injuries,
      dailyRoutine,
      workoutTime,
      dietType,
      budget
    } = req.body;

    // Simple validations
    if (!name || !email || !password || !age || !gender || !height || !weight || !dailyRoutine || !workoutTime || !dietType || !budget) {
      return res.status(400).json({ error: 'Please provide all registration and biometric fields.' });
    }

    const isInMemory = getInMemoryStatus();
    let emailExists = false;

    if (isInMemory) {
      emailExists = memoryDb.users.some(u => u.email.toLowerCase() === email.toLowerCase());
    } else {
      emailExists = await User.findOne({ email });
    }

    if (emailExists) {
      return res.status(400).json({ error: 'An account is already registered with this email address.' });
    }

    // Compile biometric dataset
    const userData = {
      name,
      email: email.toLowerCase(),
      age: Number(age),
      gender,
      height: Number(height),
      weight: Number(weight),
      medicalConditions: medicalConditions || 'None',
      injuries: injuries || 'None',
      dailyRoutine,
      workoutTime: Number(workoutTime),
      dietType,
      budget: Number(budget)
    };

    console.log(`🧠 Synthesizing custom AI plan for new athlete ${name}...`);

    // Compile workout & nutrition plan
    const generatedPlan = await generateAIFitnessPlan(userData);

    let savedUser = null;
    let token = null;

    if (isInMemory) {
      const generatedId = `mem_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
      savedUser = {
        _id: generatedId,
        ...userData,
        password, // stored as raw in-memory for basic sandbox checks
        generatedPlan,
        createdAt: new Date()
      };
      memoryDb.users.push(savedUser);
      token = signToken(generatedId);
      console.log(`💾 Saved profile temporarily in-memory (ID: ${generatedId})`);
    } else {
      const newUser = new User({
        ...userData,
        password, // Will be hashed automatically by user.pre('save')
        generatedPlan
      });
      savedUser = await newUser.save();
      token = signToken(savedUser._id);
      console.log(`💾 Saved profile securely in MongoDB (ID: ${savedUser._id})`);
    }

    const userProfile = savedUser.toObject ? savedUser.toObject() : { ...savedUser };
    delete userProfile.password;

    return res.status(201).json({
      token,
      user: userProfile
    });

  } catch (error) {
    console.error('❌ Registration Router Error:', error);
    return res.status(500).json({ error: 'Failed to create your account.', details: error.message });
  }
});

/**
 * @route   POST /api/auth/login
 * @desc    Authenticate credentials, retrieve user & persistent AI plan
 * @access  Public
 */
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Please provide email and password.' });
    }

    const isInMemory = getInMemoryStatus();
    let user = null;

    if (isInMemory) {
      user = memoryDb.users.find(u => u.email.toLowerCase() === email.toLowerCase());
      if (!user || user.password !== password) {
        return res.status(400).json({ error: 'Invalid email or password.' });
      }
    } else {
      user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ error: 'Invalid email or password.' });
      }
      
      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        return res.status(400).json({ error: 'Invalid email or password.' });
      }
    }

    // Generate JWT token
    const token = signToken(user._id);

    // Strip password from returned details
    const userProfile = user.toObject ? user.toObject() : { ...user };
    delete userProfile.password;

    console.log(`🔑 Login successful for athlete ${userProfile.name}`);

    return res.json({
      token,
      user: userProfile
    });

  } catch (error) {
    console.error('❌ Login Router Error:', error);
    return res.status(500).json({ error: 'Authentication failed.', details: error.message });
  }
});

/**
 * @route   GET /api/auth/me
 * @desc    Get current logged in user & plan from active session
 * @access  Private
 */
router.get('/me', auth, async (req, res) => {
  // auth middleware automatically populates req.user
  return res.json(req.user);
});

/**
 * @route   POST /api/auth/regenerate
 * @desc    Regenerate plan inside an active logged-in session
 * @access  Private
 */
router.post('/regenerate', auth, async (req, res) => {
  try {
    const {
      age,
      gender,
      height,
      weight,
      medicalConditions,
      injuries,
      dailyRoutine,
      workoutTime,
      dietType,
      budget
    } = req.body;

    const isInMemory = getInMemoryStatus();
    const updatedData = {
      name: req.user.name,
      email: req.user.email,
      age: Number(age),
      gender,
      height: Number(height),
      weight: Number(weight),
      medicalConditions: medicalConditions || 'None',
      injuries: injuries || 'None',
      dailyRoutine,
      workoutTime: Number(workoutTime),
      dietType,
      budget: Number(budget)
    };

    console.log(`🧠 Re-synthesizing AI plan in-session for ${req.user.name}...`);
    const generatedPlan = await generateAIFitnessPlan(updatedData);

    let savedUser = null;

    if (isInMemory || req.user._id.startsWith('mem_')) {
      const uIndex = memoryDb.users.findIndex(u => u._id === req.user._id);
      if (uIndex !== -1) {
        memoryDb.users[uIndex] = {
          ...memoryDb.users[uIndex],
          ...updatedData,
          generatedPlan
        };
        savedUser = memoryDb.users[uIndex];
      }
    } else {
      savedUser = await User.findByIdAndUpdate(
        req.user._id,
        { ...updatedData, generatedPlan },
        { new: true }
      ).select('-password');
    }

    return res.json(savedUser);

  } catch (error) {
    console.error('❌ Regenerate Route Error:', error);
    return res.status(500).json({ error: 'Failed to update your fitness plan.', details: error.message });
  }
});

module.exports = router;
