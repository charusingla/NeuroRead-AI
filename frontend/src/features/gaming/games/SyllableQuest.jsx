import React, { useState, useEffect } from 'react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import syllableBotAnimation from '../../../assets/SyllableBot.lottie?url';

export default function SyllableQuest({ wordPool, onExit, addXP, showToast, playCalmSound }) {
  const [target, setTarget] = useState(null);
  const [shuffled, setShuffled] = useState([]);
  const [progress, setProgress] = useState([]);

  useEffect(() => { 
    initGame(); 
  }, []);

  const initGame = () => {
    const item = wordPool[Math.floor(Math.random() * wordPool.length)];
    setTarget(item);
    setProgress([]);
    setShuffled([...item.syllables].sort(() => Math.random() - 0.5));
  };

  const handleSyllableClick = (seg) => {
    const expected = target.syllables[progress.length];
    if (seg === expected) {
      const updated = [...progress, seg];
      setProgress(updated);
      setShuffled((prev) => prev.filter((s, idx) => idx !== prev.indexOf(seg)));
      if (typeof playCalmSound === 'function') playCalmSound('click');

      if (updated.length === target.syllables.length) {
        if (typeof playCalmSound === 'function') playCalmSound('correct');
        addXP(40);
        showToast("Perfect Syllabic Processing!");
      }
    } else {
      if (typeof playCalmSound === 'function') playCalmSound('incorrect');
    }
  };

  const handleNextClick = () => {
    if (typeof playCalmSound === 'function') playCalmSound('click');
    initGame();
  };

  const handleExitClick = () => {
    if (typeof playCalmSound === 'function') playCalmSound('click');
    onExit();
  };

  if (!target) return null;

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 md:p-8 border border-slate-200/60 dark:border-slate-800/80 shadow-md max-w-3xl mx-auto text-left animate-in zoom-in-95 duration-200 transition-colors">
      
      {/* Header Panel */}
      <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3 mb-5">
        <span className="text-xs font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">Syllable Order Quest</span>
        <button 
          onClick={handleExitClick} 
          className="text-xs font-bold text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
        >
          Exit
        </button>
      </div>

      {/* Split Interactive Dashboard Grid layout */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        
        {/* LEFT COMPANION ANIMATION DECK */}
        <div className="md:col-span-4 flex flex-col items-center justify-center p-4 rounded-2xl relative overflow-hidden min-h-[120px] md:min-h-[180px]">
          {/* 💡 Sizing controlled cleanly via parent layout box wrappers to prevent overflow errors */}
          <div className="w-24 h-24 md:w-28 md:h-28 flex items-center justify-center overflow-hidden filter contrast-200 brightness-95 saturate-200 dark:contrast-150 dark:brightness-110 dark:saturate-150 z-10">
            <DotLottieReact
              src={syllableBotAnimation}
              loop
              autoplay
              style={{ width: '100%', height: '100%' }}
            />
          </div>
          <div className="absolute w-28 h-28 bg-indigo-500/5 rounded-full blur-xl pointer-events-none z-0" />
        </div>

        {/* RIGHT CORE SANDBOX GAMEPLAY AREA */}
        <div className="md:col-span-8 space-y-5">
          <div className="p-4 bg-slate-50 dark:bg-slate-950/40 border border-slate-100 dark:border-slate-800 text-center font-bold text-xs italic text-slate-500 dark:text-slate-400 rounded-xl leading-relaxed transition-colors">
            Clue: "{target.clue}"
          </div>

          <div className="flex flex-wrap justify-center gap-2 py-1">
            {shuffled.map((s, idx) => (
              <button 
                key={idx} 
                onClick={() => handleSyllableClick(s)} 
                className="px-5 py-3 bg-white dark:bg-slate-950 font-black border-2 border-slate-200 dark:border-slate-800 rounded-2xl text-xl text-indigo-600 dark:text-indigo-400 hover:border-indigo-500 dark:hover:border-indigo-400 transform active:scale-95 transition-all shadow-sm"
              >
                {s}
              </button>
            ))}
          </div>
        </div>

      </div>

      {/* PROGRESS TRACKER LOWER BLOCK FOOTER */}
      <div className="flex flex-wrap justify-center items-center gap-2 border-t border-slate-100 dark:border-slate-800 pt-5 mt-5 min-h-[60px]">
        {progress.map((p, idx) => (
          <span 
            key={idx} 
            className="px-5 py-2 bg-teal-500 dark:bg-teal-600 text-white font-black text-lg rounded-xl shadow-sm animate-bounce"
          >
            {p}
          </span>
        ))}
        
        {shuffled.length === 0 && (
          <button 
            onClick={handleNextClick} 
            className="ml-4 px-5 py-2.5 bg-slate-900 dark:bg-slate-800 text-white text-xs font-bold rounded-xl hover:bg-slate-800 dark:hover:bg-slate-700 transition-all transform active:scale-[0.97] shadow-sm animate-in fade-in"
          >
            Next Word
          </button>
        )}
      </div>

    </div>
  );
}