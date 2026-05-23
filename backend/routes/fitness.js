const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { generateAIFitnessPlan } = require('../services/openaiService');
const { getInMemoryStatus, memoryDb } = require('../config/db');

/**
 * @route   POST /api/fitness/generate
 * @desc    Generate personalized workout & diet plan and save user details
 * @access  Public
 */
router.post('/generate', async (req, res) => {
  try {
    const {
      name,
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

    // Simple validation
    if (!name || !age || !gender || !height || !weight || !dailyRoutine || !workoutTime || !dietType || !budget) {
      return res.status(400).json({ error: 'Please provide all required biometric and economic stats.' });
    }

    // Prepare user object for the generator
    const userData = {
      name,
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

    console.log(`🧠 Synthesizing custom fitness plan for ${name}...`);
    
    // Generate the personalized plan
    const generatedPlan = await generateAIFitnessPlan(userData);

    const { email, password } = req.body;

    // Guest flow: return plan without persisting (no account credentials)
    if (!email || !password) {
      return res.status(201).json({
        _id: `guest_${Date.now()}`,
        ...userData,
        generatedPlan,
        createdAt: new Date()
      });
    }

    const isInMemory = getInMemoryStatus();
    let savedUser = null;

    if (isInMemory) {
      savedUser = {
        _id: `mem_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
        email: email.toLowerCase(),
        ...userData,
        generatedPlan,
        createdAt: new Date()
      };
      memoryDb.users.push(savedUser);
      console.log(`💾 Saved profile temporarily in-memory (ID: ${savedUser._id})`);
    } else {
      const newUser = new User({
        ...userData,
        email: email.toLowerCase(),
        password,
        generatedPlan
      });
      savedUser = await newUser.save();
      console.log(`💾 Saved profile securely in MongoDB (ID: ${savedUser._id})`);
    }

    const profile = savedUser.toObject ? savedUser.toObject() : { ...savedUser };
    delete profile.password;

    return res.status(201).json(profile);

  } catch (error) {
    console.error('❌ Server Route Error:', error);
    return res.status(500).json({ 
      error: 'An internal server error occurred while processing your fitness plan.',
      details: error.message 
    });
  }
});

/**
 * @route   GET /api/fitness/user/:id
 * @desc    Get user and generated plan by ID
 * @access  Public
 */
router.get('/user/:id', async (req, res) => {
  try {
    const isInMemory = getInMemoryStatus();
    let user = null;

    if (isInMemory || req.params.id.startsWith('mem_')) {
      // Fetch from in-memory array
      user = memoryDb.users.find(u => u._id === req.params.id);
    } else {
      // Fetch from MongoDB
      user = await User.findById(req.params.id);
    }

    if (!user) {
      return res.status(404).json({ error: 'User profile not found.' });
    }

    return res.json(user);
  } catch (error) {
    console.error('❌ Server Fetch Error:', error);
    return res.status(500).json({ error: 'Failed to retrieve user profile.', details: error.message });
  }
});

module.exports = router;
