// frontend/src/features/anchor-lab/VisualAnchorLab.jsx
import React, { useState } from 'react';
import { Trash2 } from 'lucide-react'; // 👑 Added clean delete icon reference

export default function VisualAnchorLab({ triggerAudioCue }) {
  const [wordInput, setWordInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [savedCards, setSavedCards] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');

  const handleActionClick = () => {
    if (typeof triggerAudioCue === 'function') {
      triggerAudioCue('click');
    }
  };

  const handleCreateAnchor = async (e) => {
    e.preventDefault();
    if (!wordInput.trim()) return;

    handleActionClick();
    setIsLoading(true);
    setErrorMessage('');

    try {
      const response = await fetch('http://localhost:5000/api/mnemonic/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ word: wordInput.trim() }),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.error || 'Server error.');

      // 👑 Injecting a runtime unique ID so we can reliably target this card for deletion later
      const cardWithId = { ...data, id: Date.now() };

      setSavedCards((prev) => [cardWithId, ...prev]);
      setWordInput(''); 
    } catch (err) {
      setErrorMessage(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // 👑 NEW: Filter out card matching unique ID state trace arrays
  const handleDeleteAnchor = (idToKill) => {
    handleActionClick();
    setSavedCards((prev) => prev.filter((card) => card.id !== idToKill));
  };

  return (
    <div className="p-0 max-w-6xl mx-auto space-y-6 text-left transition-colors">
      {/* Feature Header */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/60 dark:border-slate-800/80 shadow-sm transition-colors">
        <h2 className="text-3xl font-black text-indigo-600 dark:text-white tracking-wide flex items-center gap-2">
          🧠 Visual Anchor Lab
        </h2>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1 font-semibold leading-relaxed">
          Type any complex or confusing word below. Neuro will instantly deconstruct it into a visual memory card designed for dyslexic learners.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        {/* Left Hand Card Creator Form Panel */}
        <div className="md:col-span-4 bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200/60 dark:border-slate-800/80 shadow-sm h-fit space-y-4 transition-colors">
          <form onSubmit={handleCreateAnchor} className="space-y-3">
            <label className="block text-xs uppercase tracking-wider font-bold text-slate-400 dark:text-slate-500">Target Learning Word</label>
            <input
              type="text"
              value={wordInput}
              onChange={(e) => { setWordInput(e.target.value); }}
              onKeyDown={() => { if(wordInput === '') handleActionClick(); }}
              placeholder="e.g., Metamorphosis"
              disabled={isLoading}
              className="w-full p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl font-mono text-lg tracking-wide focus:ring-2 focus:ring-indigo-500/20 outline-none text-slate-800 dark:text-slate-100 transition-colors"
            />
            <button
              type="submit"
              disabled={isLoading || !wordInput.trim()}
              className={`w-full py-3 rounded-xl font-bold text-white shadow-sm transition-all transform active:scale-[0.99] ${
                isLoading || !wordInput.trim() 
                  ? 'bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-600 cursor-not-allowed shadow-none' 
                  : 'bg-indigo-600 dark:bg-indigo-500 hover:bg-indigo-700 dark:hover:bg-indigo-600'
              }`}
            >
              {isLoading ? 'Building visual link...' : 'Transform into Anchor'}
            </button>
          </form>

          {errorMessage && (
            <p className="text-xs font-mono text-red-500 dark:text-red-400 bg-red-50 dark:bg-red-950/30 p-2.5 rounded-lg border border-red-100 dark:border-red-900/30">
              {errorMessage}
            </p>
          )}
        </div>

        {/* Right Hand Dynamic Card Grid Output Deck */}
        <div className="md:col-span-8 space-y-4">
          <h3 className="text-xs uppercase font-extrabold tracking-widest text-slate-400 dark:text-slate-500 px-1">Your Active Flashcard Deck</h3>
          
          {savedCards.length === 0 ? (
            <div className="h-64 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl flex flex-col items-center justify-center bg-white dark:bg-slate-900 text-slate-400 dark:text-slate-500 text-sm italic transition-colors">
              <span className="text-3xl filter grayscale opacity-60 mb-2">🎴</span>
              <p className="font-semibold text-xs">No mnemonic anchors generated in this session yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-start">
              {savedCards.map((card) => (
                <div 
                  key={card.id || card.word} 
                  className="group relative bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 rounded-3xl p-5 shadow-sm space-y-4 flex flex-col items-center text-center transition-all h-fit hover:border-indigo-200 dark:hover:border-indigo-900/60"
                >
                  {/* 👑 FLOATING HOVER-REVEAL TRASH ICON BUTTON */}
                  <button
                    type="button"
                    onClick={() => handleDeleteAnchor(card.id)}
                    className="absolute top-3 right-3 p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-xl border border-transparent hover:border-rose-100 dark:hover:border-rose-900/40 transition-all opacity-0 group-hover:opacity-100 focus:opacity-100"
                    title="Remove Anchor Card"
                  >
                    <Trash2 size={15} />
                  </button>

                  {/* High Contrast Dual Emoji Frame */}
                  <div className="text-5xl select-none p-4 bg-slate-50 dark:bg-slate-950 rounded-full border border-slate-100 dark:border-slate-800 shadow-inner">
                    {card.visualEmojis}
                  </div>

                  {/* Syllable Splitting Output */}
                  <div className="space-y-0.5">
                    <h4 className="text-xl font-black text-slate-900 dark:text-slate-100 tracking-widest font-mono">{card.syllables}</h4>
                    <p className="text-[10px] font-black text-indigo-500 dark:text-indigo-400 uppercase tracking-wider">{card.word}</p>
                  </div>

                  {/* Child Friendly Context Blocks */}
                  <div className="w-full text-left bg-indigo-50/40 dark:bg-indigo-950/20 p-3 rounded-2xl border border-indigo-100/40 dark:border-indigo-900/40 text-xs text-slate-700 dark:text-slate-300 space-y-1.5 transition-colors">
                    <p className="leading-relaxed"><strong>What it means:</strong> {card.definition}</p>
                    <p className="text-emerald-700 dark:text-emerald-400 pt-2 border-t border-indigo-100/50 dark:border-indigo-900/30 font-semibold leading-relaxed">
                      💡 <strong>Memory Trick:</strong> {card.memoryTrick}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}