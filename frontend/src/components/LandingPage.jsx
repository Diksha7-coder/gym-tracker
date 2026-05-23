import React from 'react';
import { Dumbbell, ShieldAlert, BadgeIndianRupee, Timer, Zap, ChevronRight } from 'lucide-react';

export default function LandingPage({ onGetStarted }) {
  return (
    <div className="relative min-h-[90vh] flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8 py-12 text-center overflow-hidden">
      
      {/* Absolute Decorative Ambient Glowing Blobs */}
      <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-neon-green/10 rounded-full blur-[100px] pointer-events-none animate-pulse-slow"></div>
      <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-neon-cyan/10 rounded-full blur-[100px] pointer-events-none animate-pulse-slow"></div>

      {/* Hero Content Area */}
      <div className="max-w-4xl mx-auto z-10">
        
        {/* Neon Tagline */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-neon-green/30 bg-[#16181f]/60 backdrop-blur-sm text-neon-green text-xs font-semibold tracking-wider uppercase mb-8 animate-bounce">
          <Zap className="w-3.5 h-3.5" /> Next-Gen Hyper-Personalized Fitness
        </div>

        {/* Cinematic Main Title */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white mb-6 uppercase leading-tight font-sans">
          Evolve Beyond <br/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-green to-neon-cyan">
            Physical Limits
          </span>
        </h1>

        {/* Motivational Subtext */}
        <p className="text-gray-400 text-base sm:text-xl max-w-2xl mx-auto mb-10 leading-relaxed font-sans font-light">
          AURA Fitness designs luxury-tier, clinical-grade workout routines and cost-optimized, macro-balanced Indian diets tailored directly to your biometrics, injury constraints, and exact budget. Powered by elite AI.
        </p>

        {/* High-Energy Action Button */}
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
          <button
            onClick={onGetStarted}
            className="w-full sm:w-auto px-8 py-4 bg-neon-green text-obsidian font-bold text-lg rounded-xl flex items-center justify-center gap-2 transition-all duration-300 hover:scale-105 btn-neon-glow hover:bg-white"
          >
            GET STARTED NOW
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Grid of Key AI Core Capabilities */}
      <div className="max-w-6xl mx-auto mt-24 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 z-10">
        
        {/* Card 1: Biometric Analysis */}
        <div className="glass-panel p-6 flex flex-col items-center md:items-start text-center md:text-left transition-all duration-300 hover:-translate-y-2 hover:border-gray-700/80">
          <div className="p-3 bg-neon-green/10 rounded-xl text-neon-green mb-4">
            <Dumbbell className="w-6 h-6" />
          </div>
          <h3 className="text-white text-lg font-semibold mb-2">Biometric Synthesis</h3>
          <p className="text-gray-400 text-sm font-light">
            Dynamic BMR calculations custom-mapped to your exact age, height, and weight profiles for optimal deficit or surplus thresholds.
          </p>
        </div>

        {/* Card 2: Injury Prevention */}
        <div className="glass-panel p-6 flex flex-col items-center md:items-start text-center md:text-left transition-all duration-300 hover:-translate-y-2 hover:border-gray-700/80">
          <div className="p-3 bg-[#ff4545]/10 rounded-xl text-[#ff4545] mb-4">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <h3 className="text-white text-lg font-semibold mb-2">Injury Shielding</h3>
          <p className="text-gray-400 text-sm font-light">
            Active joint and medical-flag scanning. Replaces strain-heavy compounds with knee-safe, back-supported, and diabetic-safe alternatives.
          </p>
        </div>

        {/* Card 3: Economical Nutrition */}
        <div className="glass-panel p-6 flex flex-col items-center md:items-start text-center md:text-left transition-all duration-300 hover:-translate-y-2 hover:border-gray-700/80">
          <div className="p-3 bg-neon-cyan/10 rounded-xl text-neon-cyan mb-4">
            <BadgeIndianRupee className="w-6 h-6" />
          </div>
          <h3 className="text-white text-lg font-semibold mb-2">Pocket-Staple Diet</h3>
          <p className="text-gray-400 text-sm font-light">
            Optimized meal mapping using affordable Indian ingredients (dal, oats, paneer, egg whites) structured precisely to fit your INR budget.
          </p>
        </div>

        {/* Card 4: Workout Scaling */}
        <div className="glass-panel p-6 flex flex-col items-center md:items-start text-center md:text-left transition-all duration-300 hover:-translate-y-2 hover:border-gray-700/80">
          <div className="p-3 bg-purple-500/10 rounded-xl text-purple-400 mb-4">
            <Timer className="w-6 h-6" />
          </div>
          <h3 className="text-white text-lg font-semibold mb-2">Adaptive Routines</h3>
          <p className="text-gray-400 text-sm font-light">
            Whether you have 15 minutes of express cardio or 90 minutes of dedicated iron lifting, workout counts scale to maximize utility.
          </p>
        </div>

      </div>

      {/* Decorative footer details */}
      <div className="mt-20 text-gray-600 text-xs tracking-widest uppercase">
        AURA ATHLETICS • STATE OF THE ART AI COACHING
      </div>
    </div>
  );
}
