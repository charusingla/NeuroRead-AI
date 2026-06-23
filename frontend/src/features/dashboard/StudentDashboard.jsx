import React from 'react';
import { BookOpen, Trophy, Flame, Star } from 'lucide-react';

export default function StudentDashboard({ currentUser, setCurrentView, triggerAudioCue }) {
  const handleNavigation = (viewTarget) => {
    if (typeof triggerAudioCue === 'function') {
      triggerAudioCue('click');
    }
    setCurrentView(viewTarget);
  };

  const streakCount = currentUser?.gamification?.streak || 0;
  const currentXp = currentUser?.gamification?.xp || 0;
  const currentLevel = currentUser?.gamification?.level || 1;

  return (
    <div className="space-y-6 text-left animate-in fade-in duration-300">
      
      {/* Welcome Banner */}
      <div className="p-8 rounded-3xl bg-gradient-to-r from-indigo-900 via-indigo-800 to-indigo-700 text-white space-y-2 shadow-md relative overflow-hidden">
        <div className="absolute -right-6 -top-6 w-24 h-24 bg-white/5 rounded-full blur-xl pointer-events-none" />
        <span className="text-[10px] font-black tracking-wider uppercase bg-white/20 px-2 py-0.5 rounded">
          Adaptive System Status : Active
        </span>
        <h2 className="text-2xl font-black tracking-tight">Welcome back, {currentUser?.username || 'Learner'}!</h2>
        <p className="text-xs text-indigo-100 max-w-lg font-medium leading-relaxed">
          Your custom workspace is fully optimized behind the scenes. Let's protect your eyes and crush some learning goals today!
        </p>
      </div>

      {/* 👑 NEW LIVE PROGRESS STATS BAR CONTAINER */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        
        {/* 1. Dynamic Daily Progress Flame Counter Card */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200/60 dark:border-slate-800/80 shadow-sm flex items-center gap-4 transition-colors">
          <div className={`p-3 rounded-xl flex-shrink-0 transition-all ${
            streakCount > 0 
              ? 'bg-amber-500 text-white shadow-md shadow-amber-500/20' 
              : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
          }`}>
            <Flame size={24} className={streakCount > 0 ? 'animate-pulse' : ''} />
          </div>
          <div>
            <div className="text-[10px] font-black uppercase text-slate-400 dark:text-slate-500 tracking-wider">Progress Streak</div>
            <div className="text-xl font-black text-slate-800 dark:text-white mt-0.5">
              {streakCount} {streakCount === 1 ? 'Day' : 'Days'}
            </div>
          </div>
        </div>

        {/* 2. Total Cumulative Experience Ledger Card */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200/60 dark:border-slate-800/80 shadow-sm flex items-center gap-4 transition-colors">
          <div className="p-3 rounded-xl bg-indigo-600 text-white shadow-md shadow-indigo-500/10 flex-shrink-0">
            <Trophy size={24} />
          </div>
          <div>
            <div className="text-[10px] font-black uppercase text-slate-400 dark:text-slate-500 tracking-wider">Total Experience</div>
            <div className="text-xl font-black text-slate-800 dark:text-white mt-0.5">
              {currentXp} <span className="text-xs font-bold text-indigo-500 dark:text-indigo-400">XP</span>
            </div>
          </div>
        </div>

        {/* 3. Operational Performance Level Badge Card */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200/60 dark:border-slate-800/80 shadow-sm flex items-center gap-4 transition-colors">
          <div className="p-3 rounded-xl bg-emerald-600 text-white shadow-md shadow-emerald-500/10 flex-shrink-0">
            <Star size={24} className="fill-current" />
          </div>
          <div>
            <div className="text-[10px] font-black uppercase text-slate-400 dark:text-slate-500 tracking-wider">Current Tier</div>
            <div className="text-xl font-black text-slate-800 dark:text-white mt-0.5">
              Level {currentLevel}
            </div>
          </div>
        </div>

      </div>

      {/* Grid Menu Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Spacer Studio Card */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/60 dark:border-slate-800/80 shadow-sm space-y-4 flex flex-col justify-between transition-colors">
          <div className="space-y-2">
            <h4 className="font-black text-lg flex items-center gap-2 text-slate-800 dark:text-slate-100">
              <BookOpen className="text-indigo-500 dark:text-indigo-400" size={20} /> Spacer Studio
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold leading-relaxed">
              Modify character tracking layouts across literature frames, shift line metrics, or implement focus masks to target crowded words.
            </p>
          </div>
          <button 
            onClick={() => handleNavigation('ai-reader')} 
            className="w-full py-2.5 border-2 border-indigo-600 dark:border-indigo-500/40 hover:bg-indigo-600 dark:hover:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 rounded-xl font-bold text-xs shadow-sm hover:text-white dark:hover:text-white transition-all transform hover:scale-[1.01] active:scale-[0.99]"
          >
            Launch Layout Spacers
          </button>
        </div>

        {/* Phonics Arcade Card */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/60 dark:border-slate-800/80 shadow-sm space-y-4 flex flex-col justify-between transition-colors">
          <div className="space-y-2">
            <h4 className="font-black text-lg flex items-center gap-2 text-slate-800 dark:text-slate-100">
              <Trophy className="text-teal-500 dark:text-teal-400" size={20} /> Phonics Interactive Arcade
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold leading-relaxed">
              Engage natively with symmetrical mirror letters, fluid segment sound blenders, and custom syllabic structure puzzles.
            </p>
          </div>
          <button 
            onClick={() => handleNavigation('gaming-zone')} 
            className="w-full py-2.5 border-2 border-indigo-600 dark:border-indigo-500/40 hover:bg-indigo-600 dark:hover:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 rounded-xl font-bold text-xs shadow-sm hover:text-white dark:hover:text-white transition-all transform hover:scale-[1.01] active:scale-[0.99]"
          >
            Open Interactive Arcade
          </button>
        </div>

      </div>
    </div>
  );
}