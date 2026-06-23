import React, { useState } from 'react';
import { BrainCircuit, Eye, EyeOff } from 'lucide-react';

export default function AuthScreen({ onAuthSuccess, apiBase, showToast, triggerAudioCue }) {
  const [authMode, setAuthMode] = useState('login');
  const [authUsername, setAuthUsername] = useState('');
  const [authPassword, setAuthPassword] = useState(''); 
  const [authEmail, setAuthEmail] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Helper checking if input matches the seeded master administrator email identifier
  const isAdminEmail = authEmail.toLowerCase().trim() === 'admin@neuroread.com';

  // Unified sound-action handler
  const handleActionClick = (callback) => {
    if (typeof triggerAudioCue === 'function') {
      triggerAudioCue('click');
    }
    if (callback) callback();
  };

  const handleEmailChange = (e) => {
    const val = e.target.value;
    setAuthEmail(val);
    
    // 👑 ADMIN GUARD: Force form into login layout if admin keys in credentials
    if (val.toLowerCase().trim() === 'admin@neuroread.com') {
      setAuthMode('login');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (authMode === 'signup' && !authUsername.trim()) {
      return showToast("Please provide a valid username tracking identity.", "info");
    }
    if (!authEmail.trim()) {
      return showToast("Please provide a valid email registration identifier.", "info");
    }
    if (authPassword.length < 4) {
      return showToast("Security PIN must be at least 4 digits long.", "info");
    }

    const payload = {
      email: authEmail.toLowerCase().trim(),
      password: authPassword,
      role: isAdminEmail ? 'admin' : 'student', // Map authorization flag intent context bounds
      ...(authMode === 'signup' && { 
        username: authUsername.trim()
      })
    };

    try {
      const res = await fetch(`${apiBase}/auth/${authMode}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload) 
      });
      
      const data = await res.json();
      if (!res.ok || data.error) throw new Error(data.error || "Authentication failed");

      localStorage.setItem('token', data.token);
      onAuthSuccess(data); 
    } catch (err) {
      showToast(err.message, "info");
    }
  };

  return (
    <div className="max-w-md mx-auto px-6 py-4 text-left relative z-10 animate-in fade-in duration-300">
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200/60 dark:border-slate-800/80 shadow-xl space-y-6 transition-colors">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5">
            <BrainCircuit size={16} className="text-indigo-600 dark:text-indigo-400" />
            <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400 tracking-wide">NeuroRead AI</span>
          </div>
          <h3 className="text-xl font-black tracking-tight text-indigo-800 dark:text-slate-100 pt-1">
            {isAdminEmail 
              ? 'Administrative Session' 
              : authMode === 'login' ? 'Access Learning Studio' : 'Create Student Profile'
            }
          </h3>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {authMode === 'signup' && !isAdminEmail && (
            <div className="space-y-1">
              <label className="text-[10px] uppercase font-black text-slate-400 dark:text-slate-500 block tracking-wider px-1">Username</label>
              <input 
                type="text" 
                value={authUsername} 
                onChange={(e) => setAuthUsername(e.target.value)} 
                onFocus={() => typeof triggerAudioCue === 'function' && triggerAudioCue('click')}
                placeholder="Alex" 
                className="w-full bg-slate-50 dark:bg-slate-950 p-3 rounded-xl text-sm font-bold border border-slate-200 dark:border-slate-800 outline-none text-slate-800 dark:text-slate-100 focus:border-indigo-500 dark:focus:border-indigo-500/50 transition-colors" 
              />
            </div>
          )}
  
          <div className="space-y-1">
            <label className="text-[10px] uppercase font-black text-slate-400 dark:text-slate-500 block tracking-wider px-1">Email</label>
            <input 
              type="email" 
              value={authEmail} 
              onChange={handleEmailChange} 
              onFocus={() => typeof triggerAudioCue === 'function' && triggerAudioCue('click')}
              placeholder="alex@example.com" 
              className="w-full bg-slate-50 dark:bg-slate-950 p-3 rounded-xl text-sm font-bold border border-slate-200 dark:border-slate-800 outline-none text-slate-800 dark:text-slate-100 focus:border-indigo-500 dark:focus:border-indigo-500/50 transition-colors" 
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] uppercase font-black text-slate-400 dark:text-slate-500 block tracking-wider px-1">
              {isAdminEmail ? 'System Master PIN' : 'Security PIN'}
            </label>
            <div className="relative flex items-center">
              <input 
                type={showPassword ? "text" : "password"} 
                value={authPassword} 
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, ''); 
                  setAuthPassword(value);
                }} 
                maxLength={6} 
                inputMode="numeric" 
                pattern="[0-9]*" 
                placeholder="Minimum 4 digits" 
                onFocus={() => typeof triggerAudioCue === 'function' && triggerAudioCue('click')}
                className="w-full bg-slate-50 dark:bg-slate-950 p-3 pr-10 rounded-xl text-sm font-bold border border-slate-200 dark:border-slate-800 outline-none text-slate-800 dark:text-slate-100 focus:border-indigo-500 dark:focus:border-indigo-500/50 transition-colors tracking-widest" 
              />
              
              <button
                type="button"
                onClick={() => handleActionClick(() => setShowPassword(!showPassword))}
                className="absolute right-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors focus:outline-none"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>
          
          <div className="flex gap-4 pt-2 text-[10px] uppercase font-black justify-center tracking-wider">
            <button 
              type="button" 
              onClick={() => handleActionClick(() => setAuthMode('login'))} 
              className={`pb-1 transition-all ${authMode === 'login' ? 'text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600 dark:border-indigo-400 font-black' : 'text-slate-400 dark:text-slate-500 opacity-70'}`}
            >
              Sign In
            </button>
            
            {/* 👑 ADAPTIVE VIEW LOCKOUT: Completely hides student signup path if admin email matches */}
            {!isAdminEmail && (
              <button 
                type="button" 
                onClick={() => handleActionClick(() => setAuthMode('signup'))} 
                className={`pb-1 transition-all ${authMode === 'signup' ? 'text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600 dark:border-indigo-400 font-black' : 'text-slate-400 dark:text-slate-500 opacity-70'}`}
              >
                Create Profile
              </button>
            )}
          </div>
          
          <button 
            type="submit" 
            onClick={() => handleActionClick()} 
            className="w-full py-3.5 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 dark:from-indigo-500 dark:to-indigo-400 text-white rounded-2xl font-bold text-sm shadow-md shadow-indigo-500/10 hover:opacity-95 transition-all transform active:scale-[0.99]"
          >
            {authMode === 'login' ? 'Initialize Profile Session' : 'Register Secure Profile'}
          </button>
        </form>
      </div>
    </div>
  );
}