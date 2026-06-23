import React from 'react';

export default function GameCard({ title, category, description, badgeColor, onLaunch, triggerAudioCue }) {
  const badgeColors = {
    indigo: "bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400",
    teal: "bg-teal-50 text-teal-600 dark:bg-teal-950/40 dark:text-teal-400",
    amber: "bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400",
    rose: "bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400"
  };

  const handleLaunchClick = () => {
    if (typeof triggerAudioCue === 'function') {
      triggerAudioCue('click');
    }
    if (onLaunch) onLaunch();
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/60 dark:border-slate-800/80 shadow-sm flex flex-col justify-between space-y-4 transition-colors">
      <div className="space-y-3">
        <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded tracking-wider ${badgeColors[badgeColor] || badgeColors.indigo}`}>
          {category}
        </span>
        <h3 className="font-black text-lg text-slate-800 dark:text-slate-100">{title}</h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold leading-relaxed">{description}</p>
      </div>
      
      <button 
        onClick={handleLaunchClick} 
        className="w-full py-2.5 bg-gradient-to-r from-indigo-600 to-indigo-500 dark:from-indigo-500 dark:to-indigo-400 text-white text-xs font-bold rounded-xl shadow-md shadow-indigo-500/5 transition-all transform hover:scale-[1.01] active:scale-[0.99]"
      >
        Launch Module
      </button>
    </div>
  );
}