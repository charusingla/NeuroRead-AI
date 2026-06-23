import React, { useState } from 'react';

export default function VisualPath({ questions, onExit, addXP, playCalmSound }) {
  const [index, setIndex] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const current = questions[index];

  const handleSelection = (selectedIdx) => {
    if (selectedIdx === current.correctIdx) {
      if (typeof playCalmSound === 'function') playCalmSound('correct');
      setFeedback(true);
      addXP(30);
    } else {
      if (typeof playCalmSound === 'function') playCalmSound('incorrect');
      setFeedback(false);
    }
  };

  const handleNextClick = () => {
    if (typeof playCalmSound === 'function') playCalmSound('click');
    setFeedback(null);
    setIndex((prev) => (prev + 1) % questions.length);
  };

  const handleExitClick = () => {
    if (typeof playCalmSound === 'function') playCalmSound('click');
    onExit();
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200/60 dark:border-slate-800/80 shadow-md space-y-6 max-w-xl mx-auto text-left animate-in zoom-in-95 duration-200 transition-colors">
      <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3">
        <span className="text-xs font-black text-amber-500 dark:text-amber-400 uppercase tracking-wider">Visual Attention Path Tracking</span>
        <button 
          onClick={handleExitClick} 
          className="text-xs font-bold text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
        >
          Exit
        </button>
      </div>

      <p className="text-center font-black text-xl bg-amber-50/50 dark:bg-amber-950/20 py-4 rounded-xl text-amber-700 dark:text-amber-400 border border-amber-100 dark:border-amber-900/30 uppercase tracking-widest font-mono transition-colors">
        Find Sequence: {current.prompt}
      </p>

      <div className="grid grid-cols-2 gap-3">
        {current.distractors.map((d, idx) => {
          const isCorrectMatch = feedback === true && idx === current.correctIdx;
          return (
            <button 
              key={idx} 
              onClick={() => handleSelection(idx)} 
              disabled={feedback === true}
              className={`p-4 bg-white dark:bg-slate-950 border-2 text-xs font-bold rounded-xl transition-all transform active:scale-[0.97] shadow-sm ${
                isCorrectMatch 
                  ? 'border-teal-500 dark:border-teal-400 bg-teal-50/30 dark:bg-teal-950/40 text-teal-700 dark:text-teal-400 font-black shadow-none' 
                  : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:border-amber-500 dark:hover:border-amber-400'
              }`}
            >
              {d}
            </button>
          );
        })}
      </div>

      {feedback !== null && (
        <div className="text-center pt-2 animate-in fade-in duration-300">
          <p className={`text-xs font-bold mb-3 ${feedback ? 'text-teal-600 dark:text-teal-400' : 'text-rose-500 dark:text-rose-400'}`}>
            {feedback ? "Excellent pattern confirmation!" : "Sequence structural variance spotted. Review carefully."}
          </p>
          {feedback && (
            <button 
              onClick={handleNextClick} 
              className="w-full py-2.5 bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700 text-white font-bold text-xs rounded-xl shadow-sm transition-all transform active:scale-[0.99]"
            >
              Next Target
            </button>
          )}
        </div>
      )}
    </div>
  );
}