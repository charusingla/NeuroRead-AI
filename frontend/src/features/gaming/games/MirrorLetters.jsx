import React, { useState } from 'react';

export default function MirrorLetters({ questions, onExit, addXP, playCalmSound }) {
  const [index, setIndex] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const current = questions[index];

  const handleChoice = (choice) => {
    if (choice === current.correct) {
      if (typeof playCalmSound === 'function') playCalmSound('correct');
      setFeedback("Excellent! You found the perfect letter matching match.");
      addXP(30);
    } else {
      if (typeof playCalmSound === 'function') playCalmSound('incorrect');
      setFeedback("Almost! Let's check out our memory trick guidelines below.");
    }
  };

  const handleNext = () => {
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
        <span className="text-xs font-black text-teal-600 dark:text-teal-400 uppercase tracking-wider">Symmetry Matching Sandbox</span>
        <button 
          onClick={handleExitClick} 
          className="text-xs font-bold text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
        >
          Exit
        </button>
      </div>

      <div className="text-center space-y-4 py-6 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-900 rounded-2xl transition-colors">
        <div className="text-6xl animate-bounce duration-1000">{current.visual}</div>
        <div className="text-3xl font-black tracking-widest text-slate-800 dark:text-slate-100 uppercase font-mono">{current.missing}</div>
      </div>

      <div className="flex justify-center gap-4 py-2">
        {current.choices.map((c, idx) => (
          <button 
            key={idx} 
            onClick={() => handleChoice(c)} 
            disabled={!!feedback}
            className="w-16 h-16 bg-white dark:bg-slate-950 text-2xl font-black border-2 border-slate-200 dark:border-slate-800 rounded-2xl text-slate-700 dark:text-slate-100 hover:border-teal-500 dark:hover:border-teal-400 disabled:opacity-50 transition-all transform active:scale-[0.95] shadow-sm"
          >
            {c}
          </button>
        ))}
      </div>

      {feedback && (
        <div className="space-y-3 animate-in fade-in duration-300">
          <p className="text-xs font-bold text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/30 p-3.5 rounded-xl border border-indigo-100 dark:border-indigo-900/40 leading-relaxed transition-colors">
            <span className="font-black uppercase tracking-wider block mb-1 text-indigo-800 dark:text-indigo-400">💡 Memory Rule:</span> 
            {current.mnemonic}
          </p>
          <button 
            onClick={handleNext} 
            className="w-full py-3 bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700 text-white font-bold text-xs rounded-xl shadow-sm transition-all transform active:scale-[0.99]"
          >
            Progress to Next Challenge
          </button>
        </div>
      )}
    </div>
  );
}