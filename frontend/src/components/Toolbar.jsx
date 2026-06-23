import React from 'react';
import { Eye } from 'lucide-react';

export default function Toolbar({ 
  theme, 
  useOpenDyslexic, setUseOpenDyslexic, 
  showRuler, setShowRuler, 
  irlenColor, setIrlenColor, 
  fontSize, setFontSize 
}) {
  return (
    <div className="bg-indigo-500/5 border-b border-indigo-500/10 py-3 px-6 text-xs font-bold flex flex-wrap gap-4 items-center justify-between z-20 relative">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-slate-400 flex items-center gap-1"><Eye size={12} /> Adaptive Lens:</span>
        <button 
          onClick={() => setUseOpenDyslexic(!useOpenDyslexic)} 
          className={`px-3 py-1.5 rounded-xl cursor-pointer border transition-all ${useOpenDyslexic ? 'bg-indigo-600 text-white' : 'bg-transparent text-slate-400 dark:border-slate-700'}`}
        >
          Dyslexic Font
        </button>
        <button 
          onClick={() => setShowRuler(!showRuler)} 
          className={`px-3 py-1.5 rounded-xl cursor-pointer border transition-all ${showRuler ? 'bg-indigo-600 text-white' : 'bg-transparent text-slate-400 dark:border-slate-700'}`}
        >
          Focus Ruler
        </button>
        
        <select 
          value={irlenColor} 
          onChange={(e) => setIrlenColor(e.target.value)} 
          disabled={theme === 'dark'} // Disables the whole selector when dark mode is on
          className={`bg-slate-100 dark:bg-slate-800 p-1.5 rounded-xl text-indigo-500 border border-slate-200 dark:border-slate-700 outline-none transition-all ${
            theme === 'dark' 
              ? 'opacity-60 cursor-not-allowed text-slate-500 dark:text-slate-600' // Visual disabled cues
              : 'cursor-pointer'
          }`}
          title={theme === 'dark' ? "Irlen Tints are disabled in Dark Mode." : "Choose Adaptive Tint"}
        >
          <option value="none" disabled={theme === 'dark'}>No Tint</option>
          <option value="soft-blue" disabled={theme === 'dark'}>Soft Aqua</option>
          <option value="soft-yellow" disabled={theme === 'dark'}>Warm Yellow</option>
          <option value="soft-green" disabled={theme === 'dark'}>Mint Pastel</option>
        </select>
      </div>
      <div className="flex items-center gap-2">
        <button onClick={() => setFontSize(Math.max(14, fontSize - 1))} className="w-6 h-6 cursor-pointer bg-slate-200 dark:bg-slate-700 rounded hover:bg-white text-white hover:text-black text-lg flex items-center justify-center pb-0.5"
        > -</button>        
        <span className="min-w-[70px] text-center">Font: {fontSize}px</span>
        <button onClick={() => setFontSize(Math.min(26, fontSize + 1))} className="w-6 h-6 cursor-pointer bg-slate-200 dark:bg-slate-700 rounded hover:bg-white text-white hover:text-black text-lg flex items-center justify-center pb-0.5">+</button>
      </div>
    </div>
  );
}