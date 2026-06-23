import React, { useState } from 'react';
import { BrainCircuit, ImageUp, Loader2, Sparkles, Volume2, Wand2, RefreshCw } from 'lucide-react';

export default function SpacerStudio({ 
  ocrResultText, setOcrResultText, 
  letterSpacing, setLetterSpacing, 
  lineHeight, setLineHeight, 
  wordSpacing, setWordSpacing, 
  typographyStyle,
  triggerAudioCue
}) {
  const [scanning, setScanning] = useState(false);
  const [aiProcessing, setAiProcessing] = useState(false);

  const handleActionClick = (callback) => {
    if (typeof triggerAudioCue === 'function') {
      triggerAudioCue('click');
    }
    if (callback) callback();
  };

  // Existing OCR upload processing pipeline
  const handleImageUpload = async (e) => {
    handleActionClick();
    const file = e.target.files[0];
    if (!file) return;

    setScanning(true);
    const formData = new FormData();
    formData.append('image', file);

    try {
      const res = await fetch('http://localhost:5000/api/ocr/scan', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (!res.ok || data.error) throw new Error(data.error || 'Failed scanning text asset.');

      setOcrResultText(data.text);
    } catch (err) {
      alert(err.message);
    } finally {
      setScanning(false);
    }
  };

  // Text Clean Up (Fixes broken OCR syntax artifacts)
  const cleanOcrText = () => {
    if (!ocrResultText) return;
    let cleaned = ocrResultText
      .replace(/\s+/g, ' ') 
      .replace(/([a-z])([A-Z])/g, '$1 $2') 
      .replace(/[^\w\s.,?!'’""-]/g, '') 
      .trim();
    setOcrResultText(cleaned);
  };

  // Native Browser Text-To-Speech (Audio integration)
  const speakText = () => {
    if (!ocrResultText) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(ocrResultText);
    utterance.rate = 0.9; 
    window.speechSynthesis.speak(utterance);
  };

  // AI Cognitive Simplifier (Proxies your backend Gemini module)
  const simplifyWithAI = async () => {
    if (!ocrResultText) return;
    setAiProcessing(true);
    try {
      const token = localStorage.getItem('token');

      const res = await fetch('http://localhost:5000/api/ai/chat', { 
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({ 
          message: `Please rewrite and simplify the following text to make it easy to read for someone with reading difficulties. Keep it brief, split long sentences, and clear out confusing language: "${ocrResultText}"` 
        }),
      });

      const data = await res.json();
      if (!res.ok || data.error) throw new Error(data.error || "AI processing failed");
      
      if (data.reply) setOcrResultText(data.reply);
    } catch (err) {
      alert(`AI Adjustment Error: ${err.message}`);
    } finally {
      setAiProcessing(false);
    }
  };

  return (
    <div className="space-y-6 text-left animate-in fade-in duration-300">
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/60 dark:border-slate-800/80 shadow-sm space-y-4 transition-colors">
        <h3 className="font-black text-3xl flex items-center gap-2 text-indigo-600 dark:text-white">
          <BrainCircuit className="text-indigo-600 dark:text-indigo-400" size={20} /> Live Spacing Customizer
        </h3>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2">
            <textarea 
              rows="4" 
              value={ocrResultText} 
              onChange={(e) => setOcrResultText(e.target.value)} 
              placeholder="Paste homework material or check scanned text metrics directly inside this workspace..." 
              className="w-full h-full p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 text-sm font-semibold rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500/20 resize-none transition-colors" 
            />
          </div>

          <div className="relative border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl flex flex-col items-center justify-center p-4 bg-slate-50/50 dark:bg-slate-950/30 text-center transition-colors hover:border-indigo-500">
            {scanning ? (
              <div className="space-y-2 text-indigo-500 dark:text-indigo-400 font-bold text-xs animate-pulse">
                <Loader2 className="animate-spin mx-auto" size={24} />
                <span>Reading Text Matrix...</span>
              </div>
            ) : (
              <label className="cursor-pointer flex flex-col items-center gap-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 h-full w-full justify-center">
                <ImageUp size={24} className="text-slate-400 dark:text-slate-500" />
                <span className="text-xs font-black">Scan Homework Sheet</span>
                <span className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold block">PNG, JPG format types</span>
                <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
              </label>
            )}
          </div>
        </div>

        {/* Core Sliders Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-bold text-slate-500 dark:text-slate-400 pt-2">
          <div className="space-y-1">
            <div className="flex justify-between"><span>Letter Gap</span><span className="text-indigo-600 dark:text-indigo-400">{letterSpacing}em</span></div>
            <input type="range" min="0.05" max="0.3" step="0.01" value={letterSpacing} onChange={(e) => setLetterSpacing(parseFloat(e.target.value))} onInput={() => handleActionClick()} className="w-full accent-indigo-600 dark:accent-indigo-500" />
          </div>
          <div className="space-y-1">
            <div className="flex justify-between"><span>Line Height</span><span className="text-indigo-600 dark:text-indigo-400">{lineHeight}</span></div>
            <input type="range" min="1.4" max="2.6" step="0.1" value={lineHeight} onChange={(e) => setLineHeight(parseFloat(e.target.value))} onInput={() => handleActionClick()} className="w-full accent-indigo-600 dark:accent-indigo-500" />
          </div>
          <div className="space-y-1">
            <div className="flex justify-between"><span>Word Gap</span><span className="text-indigo-600 dark:text-indigo-400">{wordSpacing}em</span></div>
            <input type="range" min="0.1" max="0.5" step="0.02" value={wordSpacing} onChange={(e) => setWordSpacing(parseFloat(e.target.value))} onInput={() => handleActionClick()} className="w-full accent-indigo-600 dark:accent-indigo-500" />
          </div>
        </div>

        {/* Processing Utility Tray Toolbar */}
        {ocrResultText && (
          <div className="flex flex-wrap gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
            <button
              onClick={() => handleActionClick(cleanOcrText)}
              className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 dark:bg-slate-950 text-slate-600 dark:text-slate-300 rounded-xl text-xs font-bold hover:bg-slate-200 dark:hover:bg-slate-800 transition-all border border-transparent dark:border-slate-800"
            >
              <Wand2 size={13} className="text-teal-500 dark:text-teal-400" /> Clean Layout
            </button>
            <button
              onClick={() => handleActionClick(speakText)}
              className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 dark:bg-slate-950 text-slate-600 dark:text-slate-300 rounded-xl text-xs font-bold hover:bg-slate-200 dark:hover:bg-slate-800 transition-all border border-transparent dark:border-slate-800"
            >
              <Volume2 size={13} className="text-indigo-600 dark:text-indigo-400" /> Text to Speech
            </button>
            <button
              onClick={() => handleActionClick(simplifyWithAI)}
              disabled={aiProcessing}
              className="flex items-center gap-1.5 px-3 py-2 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 border border-indigo-100/50 dark:border-indigo-900/30 rounded-xl text-xs font-bold hover:bg-indigo-100 dark:hover:bg-indigo-900/40 transition-all disabled:opacity-50"
            >
              {aiProcessing ? (
                <RefreshCw size={13} className="animate-spin" />
              ) : (
                <Sparkles size={13} className="text-amber-500 fill-amber-500" />
              )}
              {aiProcessing ? "Simplifying..." : "AI Cognitive Simplify"}
            </button>
          </div>
        )}
      </div>

      {/* Accessible Dynamic Output Pane Element */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200/60 dark:border-slate-800/80 shadow-sm transition-colors">
        <span className="text-[10px] uppercase font-black text-teal-600 dark:text-teal-400 tracking-wider mb-4 block">Interactive Accessibility Output Area</span>
        <div style={typographyStyle} className="p-5 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-2xl leading-relaxed whitespace-pre-wrap select-text text-slate-800 dark:text-slate-100">
          {ocrResultText || "The workspace configuration preview renders live updates as you modify custom dimensions variables above or upload scanned materials."}
        </div>
      </div>
    </div>
  );
}