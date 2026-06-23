import React, { useState } from 'react';
import { Sliders, Eye, Highlighter, Type } from 'lucide-react';

export default function OcrReaderLab({ triggerAudioCue }) {
  const [imagePreview, setImagePreview] = useState('');
  const [fileAsset, setFileAsset] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [textLines, setTextLines] = useState([]);
  
  // Local Accessibility Overlay States
  const [overlayColor, setOverlayColor] = useState('none');
  const [activeTrackingLine, setActiveTrackingLine] = useState(null);
  const [customFontSize, setCustomFontSize] = useState(18);

  const handleActionClick = (callback) => {
    if (typeof triggerAudioCue === 'function') {
      triggerAudioCue('click');
    }
    if (callback) callback();
  };

  const handleFileAttachment = (e) => {
    handleActionClick();
    const file = e.target.files[0];
    if (file) {
      setFileAsset(file);
      setImagePreview(URL.createObjectURL(file));
      setTextLines([]);
    }
  };

  const handleDocumentParsing = async (e) => {
    e.preventDefault();
    if (!fileAsset) return;

    handleActionClick();
    setIsProcessing(true);

    const packet = new FormData();
    packet.append('image', fileAsset);

    try {
      const response = await fetch('http://localhost:5000/api/ocr-lab/analyze', {
        method: 'POST',
        body: packet,
      });
      const data = await response.json();
      if (response.ok) {
        setTextLines(data.lines);
      } else {
        alert(data.error || "Processing interruption event.");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  const colorTints = {
    none: 'transparent',
    'soft-aqua': 'rgba(194, 229, 245, 0.25)',
    'soft-canary': 'rgba(252, 240, 200, 0.25)',
    'soft-mint': 'rgba(225, 248, 195, 0.25)',
  };

  return (
    <div className="p-0 max-w-6xl mx-auto space-y-6 text-left transition-colors">
      {/* Feature Header */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/60 dark:border-slate-800/80 shadow-sm transition-colors">
        <h2 className="text-3xl font-black text-indigo-600 dark:text-white tracking-wide flex items-center gap-2">
          <span className="text-4xl leading-none">📷</span> Real Tesseract OCR Tracking Lab
        </h2>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1 font-semibold leading-relaxed">
          Upload textbook snapshots to overlay personalized Irlen tints and line tracking rulers directly onto text blocks.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Management Controls Panel Left */}
        <div className="lg:col-span-4 bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200/60 dark:border-slate-800/80 shadow-sm space-y-5 h-fit transition-colors">
          <form onSubmit={handleDocumentParsing} className="space-y-3">
            <div className="border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl p-4 text-center relative bg-slate-50 dark:bg-slate-950/40 hover:bg-slate-100 dark:hover:bg-slate-950/80 transition-colors cursor-pointer">
              <input type="file" accept="image/*" onChange={handleFileAttachment} className="absolute inset-0 opacity-0 cursor-pointer z-10" />
              {imagePreview ? (
                <img src={imagePreview} alt="Snapshot source" className="max-h-44 mx-auto rounded-xl shadow-sm object-contain" />
              ) : (
                <p className="text-xs font-bold text-slate-400 dark:text-slate-500 py-6">Click or drag print screen layout here</p>
              )}
            </div>
            <button 
              type="submit" 
              disabled={isProcessing || !fileAsset} 
              className={`w-full font-bold py-3 rounded-xl text-xs shadow-sm transition-all transform active:scale-[0.99] ${
                isProcessing || !fileAsset 
                  ? 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-600 cursor-not-allowed shadow-none' 
                  : 'bg-indigo-600 dark:bg-indigo-500 text-white hover:bg-indigo-700 dark:hover:bg-indigo-600'
              }`}
            >
              {isProcessing ? 'Running Spatial Mapping...' : 'Extract Interactive Text Matrix'}
            </button>
          </form>

          {/* Configuration Controls */}
          {textLines.length > 0 && (
            <div className="border-t border-slate-100 dark:border-slate-800 pt-4 space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] uppercase font-black text-slate-400 dark:text-slate-500 tracking-wider block px-1">Contrast Filter Overlay</label>
                <div className="grid grid-cols-4 gap-2">
                  {Object.keys(colorTints).map((colorKey) => (
                    <button
                      key={colorKey}
                      type="button"
                      onClick={() => handleActionClick(() => setOverlayColor(colorKey))}
                      className={`py-2 px-1 text-[10px] font-black rounded-xl border capitalize transition-all ${
                        overlayColor === colorKey 
                          ? 'ring-2 ring-indigo-500/30 border-indigo-500 dark:border-indigo-400 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-400' 
                          : 'bg-white dark:bg-slate-950 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                      }`}
                    >
                      {colorKey.replace('soft-', '')}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between px-1"><label className="text-[10px] uppercase font-black text-slate-400 dark:text-slate-500 tracking-wider block">Target Reading Font Size</label><span className="text-[10px] font-mono font-bold text-indigo-600 dark:text-indigo-400">{customFontSize}px scale</span></div>
                <input 
                  type="range" min="14" max="28" step="1" 
                  value={customFontSize} 
                  onChange={(e) => setCustomFontSize(parseInt(e.target.value))}
                  onInput={() => handleActionClick()}
                  className="w-full accent-indigo-600 dark:accent-indigo-500" 
                />
              </div>
            </div>
          )}
        </div>

        {/* Dynamic Display Tracker Desktop Panel Right */}
        <div className="lg:col-span-8 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/60 dark:border-slate-800/80 shadow-sm p-6 relative overflow-hidden min-h-[400px] transition-colors">
          {/* Irlen Filter Overlay Shield layer */}
          <div className="absolute inset-0 pointer-events-none transition-colors duration-300 z-10" style={{ backgroundColor: colorTints[overlayColor] }} />

          <h3 className="text-xs uppercase font-extrabold tracking-widest text-slate-400 dark:text-slate-500 mb-4 border-b border-slate-100 dark:border-slate-800 pb-2 px-1">Tracking View Sandbox Frame</h3>
          
          {textLines.length === 0 ? (
            <div className="h-64 flex flex-col items-center justify-center text-slate-400 dark:text-slate-500 text-sm italic transition-colors">
              <span className="text-3xl filter grayscale opacity-60 mb-2">📖</span>
              <p className="font-semibold text-xs">Awaiting active document extraction payload data stream...</p>
            </div>
          ) : (
            <div 
              className="space-y-2 select-none relative z-20 font-semibold tracking-wide leading-relaxed"
              style={{ fontSize: `${customFontSize}px`, fontFamily: '"Lexend", sans-serif' }}
            >
              {textLines.map((line, idx) => {
                const isFocused = activeTrackingLine === idx;
                return (
                  <p
                    key={idx}
                    onClick={() => handleActionClick(() => setActiveTrackingLine(isFocused ? null : idx))}
                    className={`p-2.5 rounded-xl transition-all cursor-pointer relative ${
                      isFocused 
                        ? 'bg-indigo-500/10 border-l-4 border-indigo-600 text-indigo-950 dark:text-indigo-400 font-black shadow-sm' 
                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/40'
                    }`}
                  >
                    {/* Visual guiding underline tracker element */}
                    {isFocused && (
                      <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-indigo-500/20 animate-pulse" />
                    )}
                    {line}
                  </p>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}