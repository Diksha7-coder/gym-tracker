import React, { useState } from 'react';
import { Dumbbell, Utensils, Heart, ShieldAlert, Award, DollarSign, RefreshCw, UserCheck, Flame } from 'lucide-react';

export default function Dashboard({ userData, onReset }) {
  const [activeTab, setActiveTab] = useState('workout');
  const { name, age, gender, height, weight, medicalConditions, injuries, dailyRoutine, workoutTime, dietType, budget, generatedPlan } = userData;

  const workout = generatedPlan?.workout || {};
  const diet = generatedPlan?.diet || {};

  // Simple check for medical/injury warnings to apply highlight classes
  const hasMedicalFlags = medicalConditions !== 'None';
  const hasInjuryFlags = injuries !== 'None';

  return (
    <div className="w-full max-w-6xl mx-auto py-8 px-4 sm:px-6 animate-fadeIn">
      
      {/* 1. Header Greeting & Biometrics Banner */}
      <div className="glass-panel p-6 mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative overflow-hidden">
        {/* Ambient border glow */}
        <div className="absolute top-0 left-0 w-1 bg-gradient-to-b from-neon-green to-neon-cyan h-full"></div>
        
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white uppercase font-sans">
              Welcome, {name}
            </h1>
            <span className="p-1 bg-neon-green/10 rounded-md text-neon-green text-[10px] uppercase font-bold tracking-widest animate-pulse">
              Athlete Active
            </span>
          </div>
          <p className="text-gray-400 text-sm font-light">
            AI-Engine successfully synthesized your bespoke conditioning matrix.
          </p>
        </div>

        {/* Action Button: Reset/Generate new plan */}
        <button
          onClick={onReset}
          className="flex items-center gap-2 px-5 py-3 border border-gray-800 hover:border-neon-green/50 text-gray-400 hover:text-neon-green bg-[#1f222b] rounded-xl text-sm font-medium transition-all duration-300 hover:scale-105"
        >
          <RefreshCw className="w-4 h-4" /> Reset Onboarding
        </button>
      </div>

      {/* Biometrics Badges Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-8">
        {[
          { label: 'Age', value: `${age} yrs` },
          { label: 'Weight', value: `${weight} kg` },
          { label: 'Height', value: `${height} cm` },
          { label: 'Workout Time', value: `${workoutTime}m / day` },
          { label: 'Dietary Preference', value: dietType },
          { label: 'Monthly Budget', value: `₹${budget.toLocaleString('en-IN')}` }
        ].map((item, idx) => (
          <div key={idx} className="glass-panel p-4 text-center bg-[#16181f]/40">
            <span className="text-gray-500 text-[10px] uppercase font-bold block mb-1 tracking-wider">{item.label}</span>
            <span className="text-white text-base font-semibold">{item.value}</span>
          </div>
        ))}
      </div>

      {/* 2. Interactive Navigation Tabs */}
      <div className="flex border-b border-gray-800 mb-8">
        <button
          onClick={() => setActiveTab('workout')}
          className={`flex items-center justify-center gap-2.5 w-1/2 py-4 font-bold text-sm sm:text-base uppercase tracking-wider transition-all duration-300 border-b-2 ${
            activeTab === 'workout'
              ? 'border-neon-green text-neon-green bg-gradient-to-t from-neon-green/5 to-transparent'
              : 'border-transparent text-gray-400 hover:text-gray-300'
          }`}
        >
          <Dumbbell className="w-5 h-5" /> 🏋️ Training regiment
        </button>
        <button
          onClick={() => setActiveTab('diet')}
          className={`flex items-center justify-center gap-2.5 w-1/2 py-4 font-bold text-sm sm:text-base uppercase tracking-wider transition-all duration-300 border-b-2 ${
            activeTab === 'diet'
              ? 'border-neon-cyan text-neon-cyan bg-gradient-to-t from-neon-cyan/5 to-transparent'
              : 'border-transparent text-gray-400 hover:text-gray-300'
          }`}
        >
          <Utensils className="w-5 h-5" /> 🥗 Nutrition & Macros
        </button>
      </div>

      {/* 3. WORKOUT TAB CONTENT */}
      {activeTab === 'workout' && (
        <div className="space-y-8 animate-fadeIn">
          
          {/* Overarching Plan Header */}
          <div className="glass-panel p-6 bg-[#16181f]/60 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-neon-green/5 rounded-full blur-2xl pointer-events-none"></div>
            <span className="text-neon-green text-[10px] font-bold uppercase tracking-widest block mb-1">Generated Workout Plan</span>
            <h2 className="text-2xl font-extrabold text-white uppercase tracking-wide font-sans">{workout.routineName || 'AURA Custom Routine'}</h2>
            <p className="text-gray-400 text-sm font-light mt-1">
              Optimized for a daily window of <span className="text-neon-green font-semibold">{workout.availableTime || workoutTime} minutes</span> based on your metabolic structure.
            </p>
          </div>

          {/* Safety Modifier Notice Banner */}
          {(hasInjuryFlags || hasMedicalFlags || workout.safetyModifier) && (
            <div className="glass-panel p-5 border-amber-500/30 bg-amber-500/5 flex items-start gap-4">
              <div className="p-2.5 bg-amber-500/10 rounded-xl text-amber-500 shrink-0 mt-0.5 animate-pulse">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <span className="text-amber-500 text-xs font-bold uppercase tracking-wider">Safety Modifier Protocol Active</span>
                <p className="text-gray-300 text-sm font-light leading-relaxed">
                  {workout.safetyModifier || `Exercise selection automatically adjusted to account for medical status (${medicalConditions}) and physical flags (${injuries}).`}
                </p>
              </div>
            </div>
          )}

          {/* Exercises list */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {workout.exercises && workout.exercises.length > 0 ? (
              workout.exercises.map((ex, idx) => (
                <div key={idx} className="glass-panel p-6 flex flex-col justify-between transition-all duration-300 hover:border-gray-700 relative overflow-hidden">
                  
                  {/* Glowing index badge */}
                  <div className="absolute -top-3 -right-3 w-12 h-12 bg-neon-green/5 rounded-full flex items-center justify-center border border-neon-green/10 text-xs font-bold text-neon-green">
                    0{idx + 1}
                  </div>

                  <div>
                    {/* Exercise Name */}
                    <h3 className="text-white text-lg font-bold uppercase tracking-wide mb-4 pr-6">
                      {ex.name}
                    </h3>
                    
                    {/* Instructions */}
                    <p className="text-gray-400 text-sm font-light mb-6 leading-relaxed">
                      {ex.instructions}
                    </p>
                  </div>

                  <div>
                    {/* Reps/Sets Bar */}
                    <div className="flex gap-2 flex-wrap mb-4">
                      <span className="px-2.5 py-1 bg-neon-green/10 text-neon-green rounded-lg text-xs font-bold uppercase tracking-wider">
                        {ex.sets} Sets
                      </span>
                      <span className="px-2.5 py-1 bg-neon-green/10 text-neon-green rounded-lg text-xs font-bold uppercase tracking-wider">
                        {ex.reps} Reps
                      </span>
                      <span className="px-2.5 py-1 bg-obsidian-accent text-gray-400 rounded-lg text-xs font-bold uppercase tracking-wider border border-gray-800">
                        ⏱️ {ex.rest} Rest
                      </span>
                    </div>

                    {/* Specific Exercise Safety Notes */}
                    {ex.safetyNote && ex.safetyNote !== 'None' && (
                      <div className="p-3 bg-red-500/5 border border-red-500/20 rounded-xl flex items-start gap-2">
                        <span className="text-red-400 text-xs font-bold block shrink-0 mt-0.5">⚠️</span>
                        <p className="text-red-300 text-xs font-light leading-snug">
                          <span className="font-semibold uppercase text-red-400">Modifier:</span> {ex.safetyNote}
                        </p>
                      </div>
                    )}
                  </div>

                </div>
              ))
            ) : (
              <p className="text-gray-400 text-center py-10 col-span-2">No exercise routines registered.</p>
            )}
          </div>

        </div>
      )}

      {/* 4. DIET TAB CONTENT */}
      {activeTab === 'diet' && (
        <div className="space-y-8 animate-fadeIn">
          
          {/* Caloric maintenance & macros row */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* Calories Dial */}
            <div className="glass-panel p-5 bg-gradient-to-br from-[#16181f]/80 to-[#1f222b]/50 flex items-center gap-4 relative overflow-hidden">
              <div className="p-3.5 bg-neon-cyan/10 rounded-2xl text-neon-cyan">
                <Flame className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <span className="text-gray-500 text-[10px] uppercase font-bold block tracking-wider mb-0.5">Calorie Target</span>
                <span className="text-xl sm:text-2xl font-black text-white">{diet.macros?.calories || '2000 kcal'}</span>
              </div>
            </div>

            {/* Protein Dial */}
            <div className="glass-panel p-5 bg-[#16181f]/80 flex items-center gap-4">
              <div className="p-3.5 bg-[#f44336]/10 rounded-2xl text-[#f44336] text-xs font-bold uppercase w-12 h-12 flex items-center justify-center">
                P
              </div>
              <div>
                <span className="text-gray-500 text-[10px] uppercase font-bold block tracking-wider mb-0.5">Protein</span>
                <span className="text-xl sm:text-2xl font-black text-white">{diet.macros?.protein || '120g'}</span>
              </div>
            </div>

            {/* Carbs Dial */}
            <div className="glass-panel p-5 bg-[#16181f]/80 flex items-center gap-4">
              <div className="p-3.5 bg-[#4caf50]/10 rounded-2xl text-[#4caf50] text-xs font-bold uppercase w-12 h-12 flex items-center justify-center">
                C
              </div>
              <div>
                <span className="text-gray-500 text-[10px] uppercase font-bold block tracking-wider mb-0.5">Carbohydrates</span>
                <span className="text-xl sm:text-2xl font-black text-white">{diet.macros?.carbs || '200g'}</span>
              </div>
            </div>

            {/* Fats Dial */}
            <div className="glass-panel p-5 bg-[#16181f]/80 flex items-center gap-4">
              <div className="p-3.5 bg-[#ffeb3b]/10 rounded-2xl text-[#ffeb3b] text-xs font-bold uppercase w-12 h-12 flex items-center justify-center">
                F
              </div>
              <div>
                <span className="text-gray-500 text-[10px] uppercase font-bold block tracking-wider mb-0.5">Healthy Fats</span>
                <span className="text-xl sm:text-2xl font-black text-white">{diet.macros?.fats || '60g'}</span>
              </div>
            </div>

          </div>

          {/* Special Medical Diet Notice */}
          {hasMedicalFlags && (
            <div className="glass-panel p-5 border-neon-cyan/30 bg-neon-cyan/5 flex items-start gap-4">
              <div className="p-2.5 bg-neon-cyan/10 rounded-xl text-neon-cyan shrink-0 mt-0.5 animate-pulse">
                <Heart className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <span className="text-neon-cyan text-xs font-bold uppercase tracking-wider">Biometric Medical Diet Sync Active</span>
                <p className="text-gray-300 text-sm font-light leading-relaxed">
                  Dietary composition is custom-tailored for <span className="font-semibold text-white">{medicalConditions}</span>. Fiber indexes have been elevated, carbohydrate types are localized, and specific food groups are optimized to normalize systemic markers.
                </p>
              </div>
            </div>
          )}

          {/* Meals list */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {diet.meals && Object.keys(diet.meals).length > 0 ? (
              Object.entries(diet.meals).map(([mealKey, meal], idx) => {
                const labelMap = {
                  breakfast: '🌅 Breakfast plan',
                  lunch: '🍱 Midday Lunch',
                  snack: '🍵 Evening Nutrition / Snack',
                  dinner: '🌃 Recovery Dinner'
                };
                return (
                  <div key={mealKey} className="glass-panel p-6 flex flex-col justify-between transition-all duration-300 hover:border-gray-700 relative">
                    
                    {/* Cost Badge */}
                    <div className="absolute top-6 right-6 flex items-center text-xs font-bold text-neon-cyan px-2 py-0.5 bg-neon-cyan/10 rounded-lg">
                      Est. ₹{meal.costEstimateINR}
                    </div>

                    <div className="space-y-4">
                      {/* Meal title */}
                      <span className="text-neon-cyan text-[10px] uppercase font-bold tracking-widest block">
                        {labelMap[mealKey] || mealKey}
                      </span>
                      
                      {/* Meal Name */}
                      <h3 className="text-white text-lg font-bold uppercase tracking-wide">
                        {meal.name}
                      </h3>
                      
                      {/* Ingredients list */}
                      <div className="space-y-2 border-t border-gray-800/80 pt-3 mt-3">
                        <span className="text-gray-500 text-[10px] font-bold uppercase block tracking-wider mb-2">Cost & Ingredient Break-Up:</span>
                        <ul className="space-y-1.5">
                          {meal.ingredients && meal.ingredients.map((ing, iIdx) => (
                            <li key={iIdx} className="text-xs text-gray-300 font-light flex items-center gap-2">
                              <span className="w-1.5 h-1.5 rounded-full bg-neon-cyan/40"></span>
                              {ing}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-gray-400 text-center py-10 col-span-2">No dietary records generated.</p>
            )}
          </div>

          {/* Economic Optimization Summary */}
          <div className="glass-panel p-6 bg-gradient-to-br from-[#16181f]/80 to-[#1f222b]/30">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
              <div>
                <h3 className="text-white text-base font-bold uppercase tracking-wider flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-neon-cyan" /> Wallet-Staple Economic Audit
                </h3>
                <p className="text-gray-400 text-xs font-light mt-0.5">
                  Cost projection generated utilizing localized Indian staples.
                </p>
              </div>
              
              <div className="text-right">
                <span className="text-gray-500 text-[10px] font-bold uppercase tracking-widest block">Daily Cost</span>
                <span className="text-xl font-extrabold text-neon-cyan">₹{diet.estimatedDailyCostINR || 0} / day</span>
              </div>
            </div>

            {/* Budget Progress Gauge */}
            <div className="space-y-2 pt-3 border-t border-gray-800">
              <div className="flex justify-between items-center text-xs text-gray-400">
                <span>Estimated Monthly Cost: <span className="text-white font-bold">₹{((diet.estimatedDailyCostINR || 0) * 30).toLocaleString('en-IN')}</span></span>
                <span>User Input Budget Limit: <span className="text-white font-bold">₹{budget.toLocaleString('en-IN')}</span></span>
              </div>
              
              <div className="h-2 w-full bg-obsidian-accent rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all duration-500 ${
                    ((diet.estimatedDailyCostINR || 0) * 30) > budget ? 'bg-red-500' : 'bg-neon-cyan'
                  }`}
                  style={{ width: `${Math.min((((diet.estimatedDailyCostINR || 0) * 30) / budget) * 100, 100)}%` }}
                />
              </div>
              
              <div className="flex justify-between items-center text-[10px] text-gray-500 uppercase tracking-wider">
                <span>₹0</span>
                <span>Safe Limit Cap</span>
                <span>₹{budget.toLocaleString('en-IN')} max</span>
              </div>
            </div>
          </div>

        </div>
      )}
    </div>
  );
}
