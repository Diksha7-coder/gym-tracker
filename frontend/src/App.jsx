import React, { useState } from 'react';
import LandingPage from './components/LandingPage';
import OnboardingWizard from './components/OnboardingWizard';
import LoadingScreen from './components/LoadingScreen';
import Dashboard from './components/Dashboard';
import { registerUser } from './utils/api';
import { Zap, ShieldAlert, Award } from 'lucide-react';

export default function App() {
  const [view, setView] = useState('landing');
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState(null);

  const handleGetStarted = () => {
    setError(null);
    setView('onboarding');
  };

  const handleOnboardingSubmit = async (formData) => {
    setView('loading');
    setError(null);
    try {
      const { token, user } = await registerUser(formData);
      if (token) {
        localStorage.setItem('aura_token', token);
      }
      setUserData(user);

      setTimeout(() => {
        setView('dashboard');
      }, 1500);
    } catch (err) {
      console.error('Onboarding Submission Failed:', err);
      const message =
        err?.error ||
        err?.message ||
        (typeof err === 'string' ? err : 'An unexpected connection error occurred.');
      setError(message);
      setView('onboarding');
    }
  };

  const handleReset = () => {
    setUserData(null);
    setError(null);
    setView('landing');
  };

  return (
    <div className="min-h-screen bg-[#0b0c10] text-[#ffffff] flex flex-col justify-between font-sans">
      
      {/* 1. Brand Header Navbar */}
      <header className="sticky top-0 z-50 bg-[#0b0c10]/70 backdrop-blur-md border-b border-gray-900/60 px-4 sm:px-6 lg:px-8 py-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          
          {/* Brand Logo with Pulsing Neon Dot */}
          <div 
            onClick={handleReset} 
            className="flex items-center gap-2 cursor-pointer select-none group"
          >
            <div className="p-2 bg-gradient-to-br from-neon-green to-neon-cyan rounded-lg text-obsidian font-black flex items-center justify-center">
              <Zap className="w-5 h-5 text-obsidian fill-obsidian group-hover:scale-110 transition-all duration-300" />
            </div>
            <span className="text-xl font-extrabold tracking-widest text-white font-sans uppercase">
              AURA<span className="text-neon-green">.</span>FIT
            </span>
          </div>

          {/* Quick status bar */}
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-neon-green opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-neon-green"></span>
            </span>
            <span className="text-gray-500 text-[10px] uppercase font-bold tracking-widest hidden sm:inline">
              Core Engine Online
            </span>
          </div>

        </div>
      </header>

      {/* 2. Global API Connection Error Banner */}
      {error && (
        <div className="max-w-2xl mx-auto w-full px-4 mt-6">
          <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-300 rounded-2xl flex items-start gap-3 shadow-lg animate-bounce">
            <ShieldAlert className="w-5 h-5 shrink-0 text-red-400 mt-0.5" />
            <div className="space-y-1">
              <span className="text-xs font-bold uppercase text-red-400 block">System Connection Alert</span>
              <p className="text-xs font-light leading-relaxed">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* 3. Master Screen Switcher */}
      <main className="flex-grow">
        {view === 'landing' && (
          <LandingPage onGetStarted={handleGetStarted} />
        )}
        {view === 'onboarding' && (
          <OnboardingWizard onSubmit={handleOnboardingSubmit} />
        )}
        {view === 'loading' && (
          <LoadingScreen />
        )}
        {view === 'dashboard' && (
          <Dashboard userData={userData} onReset={handleReset} />
        )}
      </main>

      {/* 4. Luxury Footer Area */}
      <footer className="bg-obsidian border-t border-gray-950 px-4 py-8 text-center text-gray-600 text-xs">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          <span className="font-light tracking-wide">
            © {new Date().getFullYear()} AURA Fitness Tech. All Rights Reserved.
          </span>
          <div className="flex gap-4 uppercase font-bold tracking-widest text-[10px]">
            <a href="#" onClick={(e) => { e.preventDefault(); handleReset(); }} className="hover:text-neon-green transition-colors">Portal Home</a>
            <span className="text-gray-800">|</span>
            <span className="text-gray-500">Luxury Level AI Coaching</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
