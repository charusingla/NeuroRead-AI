import React, { useState } from 'react';
import { Mic, MicOff, CheckCircle, AlertCircle, Sparkles, Volume2, Plus } from 'lucide-react';
import { sampleWords } from '../../data/gameData';

export default function AcousticSpeechLab({ triggerAudioCue }) {
  const [targetWord, setTargetWord] = useState('Butterfly');
  const [customWordInput, setCustomWordInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [isTutorPlaying, setIsTutorPlaying] = useState(false);

  let recognition = null;

  if (typeof window !== 'undefined') {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.lang = 'en-US';
      recognition.interimResults = false;
    }
  }

  const handleActionClick = (callback) => {
    if (typeof triggerAudioCue === 'function') {
      triggerAudioCue('click');
    }
    if (callback) callback();
  };

  const toggleListeningLoop = () => {
    if (!recognition) {
      alert("Speech recognition is not supported in this browser version. Try Chrome!");
      return;
    }

    handleActionClick();

    if (isListening) {
      recognition.stop();
      setIsListening(false);
    } else {
      setTranscript('');
      setAnalysisResult(null);
      setIsListening(true);
      
      recognition.start();

      recognition.onresult = (event) => {
        const speechToTextResult = event.results[0][0].transcript;
        setTranscript(speechToTextResult);
        triggerBackendAnalysis(speechToTextResult);
      };

      recognition.onerror = (err) => {
        console.error(err);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };
    }
  };

  const triggerBackendAnalysis = async (spokenTextResult) => {
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/speech-lab/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          spokenText: spokenTextResult,
          targetWord: targetWord
        }),
      });

      const data = await response.json();
      if (response.ok) {
        setAnalysisResult(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const teachCorrectPronunciation = () => {
    window.speechSynthesis.cancel();

    if (isTutorPlaying) {
      setIsTutorPlaying(false);
      return;
    }

    setIsTutorPlaying(true);
    const cleanWord = targetWord.replace(/•/g, "");
    const utterance = new SpeechSynthesisUtterance(cleanWord);
    utterance.rate = 0.75; 
    
    utterance.onend = () => {
      setIsTutorPlaying(false);
    };

    window.speechSynthesis.speak(utterance);
  };

  const handleCustomWordSubmit = (e) => {
    e.preventDefault();
    if (!customWordInput.trim()) return;
    
    handleActionClick(() => {
      setTargetWord(customWordInput.trim());
      setCustomWordInput('');
      setAnalysisResult(null);
      setTranscript('');
    });
  };

  return (
    <div className="p-0 max-w-4xl mx-auto space-y-6 text-left transition-colors">
      {/* Header Container */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/60 dark:border-slate-800/80 shadow-sm transition-colors">
        <h2 className="text-3xl font-black text-indigo-600 dark:text-white tracking-tight flex items-center gap-2">
          🎙️ Acoustic Speech Lab
        </h2>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1 font-semibold leading-relaxed">
          Practice sounding out words phoneme-by-phoneme with real-time feedback loops.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        {/* Left Setup Menu & Custom Word Creator Column */}
        <div className="md:col-span-4 bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200/60 dark:border-slate-800/80 shadow-sm space-y-5 h-fit transition-colors">
          {/* Custom Word Input Module Form */}
          <div className="space-y-2">
            <label className="block text-[10px] uppercase tracking-wider font-extrabold text-slate-400 dark:text-slate-500 px-1">Practice Your Own Word</label>
            <form onSubmit={handleCustomWordSubmit} className="flex gap-2">
              <input 
                type="text"
                value={customWordInput}
                onChange={(e) => setCustomWordInput(e.target.value)}
                placeholder="Type a word..."
                className="flex-1 px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 outline-none focus:border-indigo-500 dark:focus:border-indigo-500/50 text-slate-800 dark:text-slate-100 transition-colors bg-slate-50 dark:bg-slate-950 font-semibold"
              />
              <button 
                type="submit"
                className="p-2 bg-indigo-600 dark:bg-indigo-500 text-white rounded-xl shadow-sm transition-all transform active:scale-[0.93]"
                title="Load custom word"
              >
                <Plus size={16} />
              </button>
            </form>
          </div>

          <div className="space-y-2 border-t border-slate-100 dark:border-slate-800 pt-4">
            <label className="block text-[10px] uppercase tracking-wider font-extrabold text-slate-400 dark:text-slate-500 px-1">Select Lab Library Word</label>
            <div className="flex flex-wrap gap-1.5 max-h-48 overflow-y-auto pr-1">
              {sampleWords.map((word) => {
                const isSelected = targetWord.toLowerCase() === word.toLowerCase();
                return (
                  <button
                    key={word}
                    type="button"
                    onClick={() => handleActionClick(() => { setTargetWord(word); setAnalysisResult(null); setTranscript(''); })}
                    className={`px-2.5 py-1.5 text-[11px] font-bold rounded-xl border transition-all ${
                      isSelected 
                        ? 'bg-indigo-600 dark:bg-indigo-500 text-white border-indigo-600 dark:border-indigo-500 shadow-sm' 
                        : 'bg-white dark:bg-slate-950 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                    }`}
                  >
                    {word}
                  </button>
                );
              })}
            </div>
          </div>
          
          <div className="border-t border-slate-100 dark:border-slate-800 pt-4 px-1">
            <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider block mb-1">Target Phonetics Goal:</span>
            <p className="text-3xl font-black text-indigo-950 dark:text-slate-100 tracking-wide py-1 select-all font-sans">{targetWord}</p>
          </div>
        </div>

        {/* Right Active Recording Core Dashboard Panel */}
        <div className="md:col-span-8 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/60 dark:border-slate-800/80 shadow-sm p-6 flex flex-col items-center justify-center space-y-6 min-h-[380px] transition-colors">
          {/* Main Microphone Interaction Circle Button */}
          <button
            type="button"
            onClick={toggleListeningLoop}
            className={`p-6 rounded-full border-4 shadow-xl transition-all transform hover:scale-105 active:scale-95 flex items-center justify-center ${
              isListening 
                ? 'bg-rose-500 border-rose-200 dark:border-rose-950 text-white animate-pulse ring-4 ring-rose-500/20' 
                : 'bg-indigo-600 border-indigo-200 dark:border-indigo-950 text-white hover:bg-indigo-700 dark:hover:bg-indigo-500'
            }`}
          >
            {isListening ? <MicOff size={32} /> : <Mic size={32} />}
          </button>
          
          <p className="text-xs font-black text-slate-500 dark:text-slate-400 tracking-wide text-center">
            {isListening ? "🎤 Listening closely... Speak the target word now!" : "Click the microphone button to practice speaking"}
          </p>

          {/* Captured Voice Transcriptions Output Nodes */}
          {transcript && (
            <div className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl w-full max-w-md text-center transition-colors">
              <span className="text-[9px] uppercase font-black text-slate-400 dark:text-slate-500 tracking-widest block mb-1">We Heard You Say</span>
              <p className="text-lg font-bold text-slate-800 dark:text-slate-200 font-mono italic">"{transcript}"</p>
            </div>
          )}

          {/* AI Phonemic Results Breakdown Output Module */}
          {isLoading && (
            <div className="flex items-center gap-2 text-xs font-mono text-amber-600 dark:text-amber-400 font-bold animate-pulse">
              <Sparkles size={14} /> Deconstructing phonetic sound structures...
            </div>
          )}

          {analysisResult && (
            <div className={`w-full max-w-md p-5 rounded-3xl border transition-all text-center space-y-4 shadow-sm ${
              analysisResult.isMatch 
                ? 'bg-emerald-50/60 dark:bg-emerald-950/20 border-emerald-100 dark:border-emerald-900/30' 
                : 'bg-amber-50/60 dark:bg-amber-950/20 border-amber-100 dark:border-amber-900/30'
            }`}>
              <div className="flex items-center justify-center gap-2">
                {analysisResult.isMatch ? (
                  <CheckCircle size={18} className="text-emerald-600 dark:text-emerald-400" />
                ) : (
                  <AlertCircle size={18} className="text-amber-600 dark:text-amber-400" />
                )}
                <span className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  {analysisResult.isMatch ? "Pronunciation Match!" : "Keep Trying! Sound Check Needed"}
                </span>
              </div>

              <div>
                <span className="text-[9px] uppercase font-black text-slate-400 dark:text-slate-500 tracking-widest block mb-0.5">Phoneme Breakdown Structure</span>
                <p className="text-2xl font-black font-mono text-slate-900 dark:text-slate-100 tracking-widest">{analysisResult.phonemes}</p>
              </div>

              <p className="text-xs font-semibold leading-relaxed text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-950 p-3 rounded-xl border border-slate-100 dark:border-slate-800">{analysisResult.feedback}</p>

              {!analysisResult.isMatch && (
                <div className="pt-2 border-t border-amber-200/40 dark:border-amber-900/20">
                  <button
                    type="button"
                    onClick={() => handleActionClick(teachCorrectPronunciation)}
                    className={`w-full py-2.5 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-sm transform active:scale-[0.99] ${
                      isTutorPlaying 
                        ? 'bg-rose-600 text-white animate-pulse' 
                        : 'bg-amber-600 hover:bg-amber-700 text-white dark:bg-amber-500 dark:hover:bg-amber-600'
                    }`}
                  >
                    <Volume2 size={14} />
                    <span>{isTutorPlaying ? "🎧 Listening to Tutor..." : "Listen to Correct Pronunciation"}</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}