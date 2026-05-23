import React, { useState } from 'react';
import { ChevronRight, ChevronLeft, Sparkles, User, Dumbbell, Wallet, Lock, Mail } from 'lucide-react';

export default function OnboardingWizard({ onSubmit }) {
  const totalSteps = 4;
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    age: '',
    gender: 'Male',
    height: '',
    weight: '',
    medicalConditions: 'None',
    injuries: 'None',
    dailyRoutine: '',
    workoutTime: 45,
    dietType: 'Vegetarian',
    budget: 5000
  });

  const [errors, setErrors] = useState({});

  const validateStep = () => {
    const err = {};
    if (step === 1) {
      if (!formData.name.trim()) err.name = 'Name is required';
      if (!formData.age || formData.age <= 0) err.age = 'Provide a valid age';
      if (!formData.height || formData.height <= 0) err.height = 'Provide a valid height';
      if (!formData.weight || formData.weight <= 0) err.weight = 'Provide a valid weight';
    } else if (step === 2) {
      if (!formData.dailyRoutine.trim()) err.dailyRoutine = 'Please describe your daily routine';
    } else if (step === 3) {
      if (!formData.budget || formData.budget < 1000) err.budget = 'Provide a budget of at least ₹1000';
    } else if (step === 4) {
      if (!formData.email.trim()) err.email = 'Email is required';
      else if (!/\S+@\S+\.\S+/.test(formData.email)) err.email = 'Enter a valid email address';
      if (!formData.password) err.password = 'Password is required';
      else if (formData.password.length < 6) err.password = 'Password must be at least 6 characters';
    }
    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleNext = () => {
    if (validateStep()) {
      setStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    setStep(prev => prev - 1);
  };

  const handleInputChange = (field, val) => {
    setFormData(prev => ({
      ...prev,
      [field]: val
    }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateStep()) {
      onSubmit(formData);
    }
  };

  const getBudgetLabel = (val) => {
    if (val <= 3000) return 'Economical (Local staples like Daal, Rice, Eggs, Soya Chunks)';
    if (val <= 7000) return 'Balanced (Standard diet including Paneer, Milk, Sprouts)';
    return 'Premium Athlete (Includes Whey Protein, Greek Yogurt, Avocados, Organic items)';
  };

  const stepLabels = ['Bio Stats', 'Health & Time', 'Diet & Economy', 'Create Account'];

  return (
    <div className="w-full max-w-2xl mx-auto py-8 px-4 sm:px-6">
      
      {/* Step Indicator Progress Bar */}
      <div className="mb-10">
        <div className="flex justify-between items-center text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
          {stepLabels.map((label, idx) => (
            <span key={idx} className={step >= idx + 1 ? 'text-neon-green' : ''}>{label}</span>
          ))}
        </div>
        <div className="h-1.5 w-full bg-[#1f222b] rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-neon-green to-neon-cyan transition-all duration-500"
            style={{ width: `${((step - 1) / (totalSteps - 1)) * 100}%` }}
          />
        </div>
      </div>

      <div className="glass-panel p-6 sm:p-10 relative overflow-hidden">
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-neon-green/5 rounded-full blur-3xl pointer-events-none"></div>

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* STEP 1: BIO STATS */}
          {step === 1 && (
            <div className="space-y-6 animate-fadeIn">
              <div className="flex items-center gap-3 border-b border-gray-800 pb-4 mb-4">
                <div className="p-2 bg-neon-green/10 rounded-lg text-neon-green">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white uppercase tracking-wide">Step 1: Biometric Stats</h2>
                  <p className="text-gray-400 text-xs font-light">Input baseline vitals for BMR energy profiling</p>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-300">Name</label>
                <input
                  type="text"
                  placeholder="Enter your name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className={`aura-input ${errors.name ? 'border-red-500' : ''}`}
                />
                {errors.name && <p className="text-red-400 text-xs">{errors.name}</p>}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-300">Age (years)</label>
                  <input
                    type="number"
                    placeholder="e.g. 25"
                    value={formData.age}
                    onChange={(e) => handleInputChange('age', e.target.value)}
                    className={`aura-input ${errors.age ? 'border-red-500' : ''}`}
                  />
                  {errors.age && <p className="text-red-400 text-xs">{errors.age}</p>}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-300">Gender</label>
                  <div className="grid grid-cols-3 gap-2">
                    {['Male', 'Female', 'Other'].map((g) => (
                      <button
                        key={g}
                        type="button"
                        onClick={() => handleInputChange('gender', g)}
                        className={`py-3 rounded-xl text-sm font-medium border transition-all duration-300 ${
                          formData.gender === g
                            ? 'bg-neon-green/10 border-neon-green text-neon-green'
                            : 'bg-[#1f222b] border-gray-800 text-gray-400 hover:border-gray-700'
                        }`}
                      >
                        {g}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-300">Height (cm)</label>
                  <input
                    type="number"
                    placeholder="e.g. 175"
                    value={formData.height}
                    onChange={(e) => handleInputChange('height', e.target.value)}
                    className={`aura-input ${errors.height ? 'border-red-500' : ''}`}
                  />
                  {errors.height && <p className="text-red-400 text-xs">{errors.height}</p>}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-300">Weight (kg)</label>
                  <input
                    type="number"
                    placeholder="e.g. 70"
                    value={formData.weight}
                    onChange={(e) => handleInputChange('weight', e.target.value)}
                    className={`aura-input ${errors.weight ? 'border-red-500' : ''}`}
                  />
                  {errors.weight && <p className="text-red-400 text-xs">{errors.weight}</p>}
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: HEALTH & SCHEDULE */}
          {step === 2 && (
            <div className="space-y-6 animate-fadeIn">
              <div className="flex items-center gap-3 border-b border-gray-800 pb-4 mb-4">
                <div className="p-2 bg-neon-green/10 rounded-lg text-neon-green">
                  <Dumbbell className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white uppercase tracking-wide">Step 2: Health & Schedule</h2>
                  <p className="text-gray-400 text-xs font-light">Set up limitations and available workout duration</p>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-300">Medical Conditions / Illnesses</label>
                <select
                  value={formData.medicalConditions}
                  onChange={(e) => handleInputChange('medicalConditions', e.target.value)}
                  className="aura-input bg-[#1f222b] cursor-pointer"
                >
                  <option value="None">None</option>
                  <option value="Diabetes">Diabetes</option>
                  <option value="PCOS">PCOS</option>
                  <option value="Thyroid">Thyroid</option>
                </select>
                <p className="text-gray-500 text-xs font-light">We will adapt nutrition macro balances to accommodate conditions.</p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-300">Joint Pain / Injuries</label>
                <select
                  value={formData.injuries}
                  onChange={(e) => handleInputChange('injuries', e.target.value)}
                  className="aura-input bg-[#1f222b] cursor-pointer"
                >
                  <option value="None">None</option>
                  <option value="Knee pain">Knee pain</option>
                  <option value="Back pain">Back pain</option>
                  <option value="Shoulder pain">Shoulder pain / Impingement</option>
                </select>
                <p className="text-gray-500 text-xs font-light">We will flag and swap workouts affecting these specific areas.</p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-300">Daily Routine Description</label>
                <textarea
                  rows="3"
                  placeholder="e.g. 9-to-5 desk job sitting all day, moderately active student, or busy parent moving around..."
                  value={formData.dailyRoutine}
                  onChange={(e) => handleInputChange('dailyRoutine', e.target.value)}
                  className={`aura-input resize-none py-2.5 ${errors.dailyRoutine ? 'border-red-500' : ''}`}
                />
                {errors.dailyRoutine && <p className="text-red-400 text-xs">{errors.dailyRoutine}</p>}
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-semibold text-gray-300">Available Workout Time</label>
                  <span className="text-sm font-bold text-neon-green px-2 py-0.5 bg-neon-green/10 rounded-lg">
                    {formData.workoutTime} mins
                  </span>
                </div>
                <input
                  type="range"
                  min="15"
                  max="90"
                  step="5"
                  value={formData.workoutTime}
                  onChange={(e) => handleInputChange('workoutTime', Number(e.target.value))}
                  className="w-full h-1.5 bg-[#1f222b] rounded-lg appearance-none cursor-pointer accent-neon-green"
                />
                <div className="flex justify-between text-xs text-gray-600">
                  <span>15m (Express)</span>
                  <span>45m (Optimal)</span>
                  <span>90m (Athlete)</span>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: NUTRITION & ECONOMY */}
          {step === 3 && (
            <div className="space-y-6 animate-fadeIn">
              <div className="flex items-center gap-3 border-b border-gray-800 pb-4 mb-4">
                <div className="p-2 bg-neon-green/10 rounded-lg text-neon-green">
                  <Wallet className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white uppercase tracking-wide">Step 3: Nutrition & Economy</h2>
                  <p className="text-gray-400 text-xs font-light">Set dietary targets and optimization parameters</p>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-300">Diet Type</label>
                <div className="grid grid-cols-2 gap-3">
                  {['Vegetarian', 'Non-Vegetarian', 'Eggitarian', 'Vegan'].map((d) => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => handleInputChange('dietType', d)}
                      className={`p-4 rounded-xl text-left border flex flex-col justify-between transition-all duration-300 ${
                        formData.dietType === d
                          ? 'bg-[#16181f] border-neon-cyan text-white shadow-[0_0_10px_rgba(0,245,255,0.05)]'
                          : 'bg-[#1f222b] border-gray-800 text-gray-400 hover:border-gray-700'
                      }`}
                    >
                      <span className="text-sm font-bold block mb-1 uppercase tracking-wider">{d}</span>
                      <span className="text-xs text-gray-500 font-light">
                        {d === 'Vegetarian' && 'Pure veg meals'}
                        {d === 'Non-Vegetarian' && 'Chicken, eggs, fish'}
                        {d === 'Eggitarian' && 'Veg + whole eggs'}
                        {d === 'Vegan' && '100% plant-based'}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-semibold text-gray-300">Monthly Food Budget (INR ₹)</label>
                  <span className="text-sm font-bold text-neon-cyan px-2.5 py-0.5 bg-neon-cyan/10 rounded-lg">
                    ₹{formData.budget.toLocaleString('en-IN')} / month
                  </span>
                </div>
                
                <input
                  type="number"
                  placeholder="e.g. 5000"
                  value={formData.budget}
                  onChange={(e) => handleInputChange('budget', Number(e.target.value))}
                  className="aura-input mb-2"
                />

                <input
                  type="range"
                  min="2000"
                  max="18000"
                  step="500"
                  value={formData.budget}
                  onChange={(e) => handleInputChange('budget', Number(e.target.value))}
                  className="w-full h-1.5 bg-[#1f222b] rounded-lg appearance-none cursor-pointer accent-neon-cyan"
                />

                <div className="p-3.5 bg-obsidian-accent border border-gray-800 rounded-xl mt-3">
                  <span className="text-xs font-bold text-gray-400 block mb-1 uppercase tracking-wider">AI Optimizer Focus:</span>
                  <p className="text-xs text-gray-400 font-light leading-relaxed">
                    {getBudgetLabel(formData.budget)}
                  </p>
                </div>
                {errors.budget && <p className="text-red-400 text-xs">{errors.budget}</p>}
              </div>
            </div>
          )}

          {/* STEP 4: CREATE ACCOUNT */}
          {step === 4 && (
            <div className="space-y-6 animate-fadeIn">
              <div className="flex items-center gap-3 border-b border-gray-800 pb-4 mb-4">
                <div className="p-2 bg-neon-cyan/10 rounded-lg text-neon-cyan">
                  <Lock className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white uppercase tracking-wide">Step 4: Secure Your Profile</h2>
                  <p className="text-gray-400 text-xs font-light">Create credentials to save and access your AI-generated plan anytime</p>
                </div>
              </div>

              <div className="p-4 bg-neon-green/5 border border-neon-green/20 rounded-2xl">
                <p className="text-xs text-gray-300 font-light leading-relaxed">
                  <span className="text-neon-green font-bold">✓ Bio stats captured.</span>{' '}
                  <span className="text-neon-green font-bold">✓ Health flags mapped.</span>{' '}
                  <span className="text-neon-green font-bold">✓ Diet & budget locked.</span>{' '}
                  Now create your secure athlete profile to permanently save your AI-generated workout and nutrition plan.
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-300">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input
                    type="email"
                    placeholder="athlete@example.com"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className={`aura-input pl-11 ${errors.email ? 'border-red-500' : ''}`}
                  />
                </div>
                {errors.email && <p className="text-red-400 text-xs">{errors.email}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-300">Create Password</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input
                    type="password"
                    placeholder="Minimum 6 characters"
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    className={`aura-input pl-11 ${errors.password ? 'border-red-500' : ''}`}
                  />
                </div>
                {errors.password && <p className="text-red-400 text-xs">{errors.password}</p>}
                <p className="text-gray-600 text-xs font-light">Your password is salt-hashed and stored securely. We never store plain-text credentials.</p>
              </div>
            </div>
          )}

          {/* Navigation Controls */}
          <div className="flex items-center justify-between border-t border-gray-800 pt-6 mt-8">
            {step > 1 ? (
              <button
                type="button"
                onClick={handleBack}
                className="px-6 py-3 border border-gray-700 hover:border-gray-500 text-gray-300 font-medium rounded-xl flex items-center gap-1.5 transition-all duration-300"
              >
                <ChevronLeft className="w-4 h-4" /> Back
              </button>
            ) : (
              <div />
            )}

            {step < totalSteps ? (
              <button
                type="button"
                onClick={handleNext}
                className="px-6 py-3 bg-neon-green text-obsidian font-bold rounded-xl flex items-center gap-1.5 transition-all duration-300 hover:scale-105 btn-neon-glow"
              >
                Continue <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="submit"
                className="px-6 py-3 bg-gradient-to-r from-neon-green to-neon-cyan text-obsidian font-extrabold rounded-xl flex items-center gap-2 transition-all duration-300 hover:scale-105 btn-neon-glow"
              >
                CREATE ACCOUNT & SYNTHESIZE <Sparkles className="w-4 h-4" />
              </button>
            )}
          </div>

        </form>
      </div>
    </div>
  );
}
