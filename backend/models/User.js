const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  age: {
    type: Number,
    required: true
  },
  gender: {
    type: String,
    enum: ['Male', 'Female', 'Other'],
    required: true
  },
  height: {
    type: Number,
    required: true
  },
  weight: {
    type: Number,
    required: true
  },
  medicalConditions: {
    type: String,
    default: 'None'
  },
  injuries: {
    type: String,
    default: 'None'
  },
  dailyRoutine: {
    type: String,
    required: true
  },
  workoutTime: {
    type: Number,
    required: true,
    min: 15,
    max: 90
  },
  dietType: {
    type: String,
    enum: ['Vegetarian', 'Non-Vegetarian', 'Eggitarian', 'Vegan'],
    required: true
  },
  budget: {
    type: Number,
    required: true
  },
  generatedPlan: {
    workout: {
      routineName: String,
      availableTime: Number,
      safetyModifier: String,
      exercises: [
        {
          name: String,
          sets: String,
          reps: String,
          rest: String,
          instructions: String,
          safetyNote: String
        }
      ]
    },
    diet: {
      dietType: String,
      monthlyBudgetINR: Number,
      estimatedDailyCostINR: Number,
      macros: {
        protein: String,
        carbs: String,
        fats: String,
        calories: String
      },
      meals: {
        breakfast: {
          name: String,
          ingredients: [String],
          costEstimateINR: Number
        },
        lunch: {
          name: String,
          ingredients: [String],
          costEstimateINR: Number
        },
        snack: {
          name: String,
          ingredients: [String],
          costEstimateINR: Number
        },
        dinner: {
          name: String,
          ingredients: [String],
          costEstimateINR: Number
        }
      }
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Pre-save hook: Hash plain text passwords securely
UserSchema.pre('save', async function (next) {
  const user = this;
  if (!user.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(user.password, salt);
    user.password = hash;
    next();
  } catch (error) {
    return next(error);
  }
});

// Instance method to compare input password with stored hash
UserSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);
