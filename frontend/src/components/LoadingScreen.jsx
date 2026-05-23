import React, { useState, useEffect } from 'react';
import { Activity, ShieldCheck, Heart, Apple, Dumbbell } from 'lucide-react';

const LOADING_STEPS = [
  { text: "Synthesizing bio-metric profile...", icon: <Activity className="w-5 h-5" /> },
  { text: "Cross-referencing medical variables & flags...", icon: <Heart className="w-5 h-5" /> },
  { text: "Evaluating joint injury range thresholds...", icon: <ShieldCheck className="w-5 h-5" /> },
  { text: "Calculating optimal caloric maintenance and macro splits...", icon: <Activity className="w-5 h-5" /> },
  { text: "Structuring budget-friendly, local Indian diet staples...", icon: <Apple className="w-5 h-5" /> },
  { text: "Assembling custom workout durations & safety mods...", icon: <Dumbbell className="w-5 h-5" /> }
];

export default function LoadingScreen() {
  const [currentStep, setCurrentStep] = useState(0);
  const [fadeState, setFadeState] = useState('in');

  useEffect(() => {
    const stepInterval = setInterval(() => {
      // Trigger fade out
      setFadeState('out');
      
      setTimeout(() => {
        setCurrentStep(prev => (prev + 1) % LOADING_STEPS.length);
        setFadeState('in');
      }, 300); // Wait for fade-out to complete

    }, 2200);

    return () => clearInterval(stepInterval);
  }, []);

  return (
    <div className="min-h-[75vh] flex flex-col justify-center items-center px-4 relative overflow-hidden text-center">
      
      {/* Dynamic Ambient Background Highlights */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-neon-green/5 rounded-full blur-[100px] pointer-events-none animate-pulse-slow"></div>

      <div className="max-w-md w-full glass-panel-neon p-8 sm:p-12 z-10 flex flex-col items-center">
        
        {/* Animated concentric loading ring */}
        <div className="relative w-24 h-24 mb-10 flex items-center justify-center">
          {/* Inner ring */}
          <div className="absolute inset-0 rounded-full border-4 border-t-neon-green border-r-transparent border-b-transparent border-l-transparent animate-spin"></div>
          {/* Outer ring running counter-clockwise */}
          <div className="absolute -inset-2 rounded-full border-4 border-b-neon-cyan border-t-transparent border-r-transparent border-l-transparent animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
          {/* Central flashing heartrate icon */}
          <div className="p-4 bg-obsidian-accent rounded-full text-neon-green animate-pulse">
            <Activity className="w-8 h-8" />
          </div>
        </div>

        {/* Loading title */}
        <h2 className="text-white text-xl font-bold uppercase tracking-wider mb-2">
          AURA AI CORE ACTIVE
        </h2>
        
        {/* Subtext */}
        <p className="text-gray-500 text-xs tracking-widest uppercase mb-8">
          Compiling Bespoke Fitness Matrix
        </p>

        {/* Progress bar simulation */}
        <div className="h-1 w-full bg-obsidian-accent rounded-full mb-8 overflow-hidden relative">
          <div className="h-full bg-gradient-to-r from-neon-green to-neon-cyan rounded-full w-2/3 animate-pulse"></div>
        </div>

        {/* Log changes */}
        <div 
          className={`flex items-center gap-3 justify-center min-h-[48px] px-4 text-center transition-opacity duration-300 ${
            fadeState === 'in' ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
          }`}
        >
          <span className="text-neon-cyan shrink-0 animate-bounce">
            {LOADING_STEPS[currentStep].icon}
          </span>
          <span className="text-gray-300 text-sm font-medium leading-relaxed font-sans">
            {LOADING_STEPS[currentStep].text}
          </span>
        </div>

      </div>

      {/* Simulated background dashboard skeleton underlay */}
      <div className="mt-8 max-w-lg w-full opacity-10 blur-[2px] pointer-events-none flex gap-4 select-none">
        <div className="w-1/3 h-20 bg-gray-700 rounded-xl"></div>
        <div className="w-1/3 h-20 bg-gray-700 rounded-xl"></div>
        <div className="w-1/3 h-20 bg-gray-700 rounded-xl"></div>
      </div>
    </div>
  );
}
