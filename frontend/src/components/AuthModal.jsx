import React, { useState } from 'react';
import { X, Lock, Mail, User, Sparkles, ChevronRight } from 'lucide-react';
import { loginUser } from '../utils/api';

export default function AuthModal({ isOpen, onClose, onAuthSuccess, onLaunchWizard }) {
  const [mode, setMode] = useState('login'); // 'login' | 'signup'
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError(null);
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      setError('Please fill in all credentials.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      if (mode === 'login') {
        const data = await loginUser(formData.email, formData.password);
        // Save to local storage
        localStorage.setItem('aura_token', data.token);
        onAuthSuccess(data.user);
        onClose();
      }
    } catch (err) {
      console.error('Auth Error:', err);
      setError(err.error || err.message || 'Credentials invalid. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      onClick={handleBackdropClick}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-fadeIn"
    >
      <div className="relative max-w-md w-full glass-panel-neon p-6 sm:p-10 relative overflow-hidden transition-all duration-300">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 bg-[#1f222b] border border-gray-800 rounded-lg text-gray-400 hover:text-white transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Ambient background blur inside card */}
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-neon-green/5 rounded-full blur-3xl pointer-events-none"></div>

        {/* Header Tabs */}
        <div className="flex border-b border-gray-800 mb-6">
          <button
            onClick={() => { setMode('login'); setError(null); }}
            className={`w-1/2 pb-3 font-bold text-sm sm:text-base uppercase tracking-wider transition-all duration-300 border-b-2 ${
              mode === 'login'
                ? 'border-neon-green text-neon-green'
                : 'border-transparent text-gray-500 hover:text-gray-400'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => { setMode('signup'); setError(null); }}
            className={`w-1/2 pb-3 font-bold text-sm sm:text-base uppercase tracking-wider transition-all duration-300 border-b-2 ${
              mode === 'signup'
                ? 'border-neon-cyan text-neon-cyan'
                : 'border-transparent text-gray-500 hover:text-gray-400'
            }`}
          >
            New Athlete
          </button>
        </div>

        {/* Dynamic Forms */}
        {mode === 'login' ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <h3 className="text-white text-lg font-bold uppercase tracking-wide mb-1">Welcome back, Athlete</h3>
            <p className="text-gray-400 text-xs font-light mb-4">Enter credentials to load your bespoke dashboard plan.</p>

            {/* Error prompt */}
            {error && (
              <p className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-medium rounded-xl">
                {error}
              </p>
            )}

            {/* Email field */}
            <div className="space-y-1.5 relative">
              <label className="text-xs font-semibold text-gray-400 block uppercase tracking-wider">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-500" />
                <input
                  type="email"
                  placeholder="name@email.com"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="aura-input pl-11"
                  required
                />
              </div>
            </div>

            {/* Password field */}
            <div className="space-y-1.5 relative">
              <label className="text-xs font-semibold text-gray-400 block uppercase tracking-wider">Security Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-500" />
                <input
                  type="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  className="aura-input pl-11 focus:border-neon-green focus:ring-neon-green"
                  required
                />
              </div>
            </div>

            {/* Login Action Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-6 py-3.5 bg-neon-green text-obsidian font-extrabold text-sm rounded-xl flex items-center justify-center gap-2 transition-all duration-300 hover:scale-[1.02] btn-neon-glow disabled:opacity-50"
            >
              {loading ? 'AUTHENTICATING PROFILE...' : 'SIGN IN ATHLETE'}
              <ChevronRight className="w-4 h-4" />
            </button>
          </form>
        ) : (
          /* Signup UI Frame: Redirects to Onboarding wizard because signup requires biometrics first! */
          <div className="space-y-6 text-center py-4">
            <div className="p-4 bg-neon-cyan/10 rounded-2xl text-neon-cyan inline-flex mb-2">
              <Sparkles className="w-8 h-8 animate-pulse" />
            </div>
            
            <h3 className="text-white text-xl font-bold uppercase tracking-wide">
              Bespeaking Your Performance
            </h3>
            
            <p className="text-gray-400 text-sm font-light leading-relaxed max-w-sm mx-auto">
              To create an account, you must register your vital statistics first. This allows the AI Engine to construct custom macro budgets and joint-safe workouts!
            </p>

            <div className="p-4 bg-obsidian-accent border border-gray-800 rounded-2xl text-left mt-4">
              <span className="text-xs font-bold text-neon-cyan block mb-1 uppercase tracking-wider">How to Sign Up:</span>
              <p className="text-xs text-gray-500 font-light leading-normal">
                Click the button below to initiate our interactive Onboarding Wizard. At the very final step, you will be prompted to enter your password to save your generated credentials!
              </p>
            </div>

            {/* Onboarding trigger action */}
            <button
              onClick={() => {
                onLaunchWizard();
                onClose();
              }}
              className="w-full mt-6 py-3.5 bg-gradient-to-r from-neon-green to-neon-cyan text-obsidian font-extrabold text-sm rounded-xl flex items-center justify-center gap-2 transition-all duration-300 hover:scale-[1.02] btn-cyan-glow"
            >
              LAUNCH ONBOARDING WIZARD
              <Sparkles className="w-4.5 h-4.5" />
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
