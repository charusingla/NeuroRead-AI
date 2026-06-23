import React, { useState, useEffect } from 'react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import marioAnimation from '../../../assets/Among Us.lottie?url';

export default function SoundBlender({ pool, onExit, addXP, playCalmSound }) {
  const [index, setIndex] = useState(0);
  const [shuffled, setShuffled] = useState([]);
  const [progress, setProgress] = useState([]);
  const [complete, setComplete] = useState(false);
  const current = pool[index];

  useEffect(() => { 
    initBlender(); 
  }, [index]);

  const initBlender = () => {
    setProgress([]);
    setComplete(false);
    setShuffled([...pool[index].sounds].sort(() => Math.random() - 0.5));
  };

  const handleClick = (sound) => {
    const expected = current.sounds[progress.length];
    if (sound === expected) {
      const updated = [...progress, sound];
      setProgress(updated);
      setShuffled((prev) => prev.filter((s, idx) => idx !== prev.indexOf(sound)));
      if (typeof playCalmSound === 'function') playCalmSound('click');

      if (updated.length === current.sounds.length) {
        if (typeof playCalmSound === 'function') playCalmSound('correct');
        setComplete(true);
        addXP(40);
      }
    } else {
      if (typeof playCalmSound === 'function') playCalmSound('incorrect');
    }
  };

  const handleNextClick = () => {
    if (typeof playCalmSound === 'function') playCalmSound('click');
    setIndex((prev) => (prev + 1) % pool.length);
  };

  const handleExitClick = () => {
    if (typeof playCalmSound === 'function') playCalmSound('click');
    onExit();
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 md:p-8 border border-slate-200/60 dark:border-slate-800/80 shadow-md max-w-3xl mx-auto text-left animate-in zoom-in-95 duration-200 transition-colors">
      
      {/* Header Deck */}
      <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3 mb-5">
        <span className="text-xs font-black text-rose-600 dark:text-rose-400 uppercase tracking-wider">Phoneme Segment Sound Blender</span>
        <button 
          onClick={handleExitClick} 
          className="text-xs font-bold text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
        >
          Exit
        </button>
      </div>

      {/* Split Layout Panel Wrapper */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        
        {/* LEFT COMPANION ANIMATION - Borderless Style */}
        <div className="md:col-span-4 flex items-center justify-center min-h-[120px] md:min-h-[180px]">
          <div className="w-24 h-24 md:w-28 md:h-28 flex items-center justify-center overflow-hidden filter contrast-200 brightness-95 saturate-200 dark:contrast-150 dark:brightness-110 dark:saturate-150">
            <DotLottieReact
              src={marioAnimation}
              loop
              autoplay
              style={{ width: '800%', height: '800%' }}
            />
          </div>
        </div>

        {/* RIGHT CORE SANDBOX GAMEPLAY AREA */}
        <div className="md:col-span-8 space-y-5">
          <p className="p-4 bg-slate-50 dark:bg-slate-950/40 border border-slate-100 dark:border-slate-800 rounded-xl text-center font-bold text-xs italic text-slate-500 dark:text-slate-400 leading-relaxed transition-colors">
            Context: "{current.text}"
          </p>

          <div className="flex flex-wrap justify-center gap-2 py-1">
            {shuffled.map((b, idx) => (
              <button 
                key={idx} 
                onClick={() => handleClick(b)} 
                className="px-5 py-3 bg-white dark:bg-slate-950 font-black border-2 border-slate-200 dark:border-slate-800 rounded-2xl text-xl text-rose-600 dark:text-rose-400 hover:border-rose-400 dark:hover:border-rose-500/60 transform active:scale-95 transition-all shadow-sm"
              >
                {b}
              </button>
            ))}
          </div>
        </div>

      </div>

      {/* LOWER TRACKER FOOTER BAR */}
      <div className="flex flex-wrap justify-center items-center gap-2 border-t border-slate-100 dark:border-slate-800 pt-5 mt-5 min-h-[60px]">
        {progress.map((p, idx) => (
          <span 
            key={idx} 
            className="px-4 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 font-mono font-black text-sm text-slate-800 dark:text-slate-200 rounded-xl shadow-sm animate-fade-in"
          >
            {p}
          </span>
        ))}
        
        {complete && (
          <button 
            onClick={handleNextClick} 
            className="ml-4 px-5 py-2.5 bg-gradient-to-r from-teal-500 to-teal-400 dark:from-teal-600 dark:to-teal-500 text-white text-xs font-bold rounded-xl shadow-sm hover:opacity-95 transition-all transform active:scale-[0.97] animate-in fade-in"
          >
            Next Sound Mix
          </button>
        )}
      </div>

    </div>
  );
}