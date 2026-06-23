import React from 'react';
import { Compass, BookOpen, Trophy, Camera, MessageSquare, Mic, BrainCircuit} from 'lucide-react';

export default function NavigationSidebar({ currentView, setCurrentView, triggerAudioCue }) {
  const menuItems = [
    { id: 'dashboard', label: 'Student Core Hub', icon: Compass },
    { id: 'ai-reader', label: 'Spacers Workspace', icon: BookOpen },
    { id: 'gaming-zone', label: 'Phonics Game Station', icon: Trophy },
    { id: 'anchor-lab', label: 'Visual Anchor Lab', icon: BrainCircuit },
    { id: 'ocr-scanner', label: 'Real Tesseract OCR', icon: Camera },
    { id: 'tutor-chat', label: 'Companion Chat Bot', icon: MessageSquare },
    { id: 'speech-practice', label: 'Acoustic Speech Lab', icon: Mic },
  ];

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 p-6 rounded-3xl space-y-2 h-fit text-left shadow-sm transition-colors">
      <p className="text-[11px] uppercase font-black text-indigo-900 dark:text-indigo-400 mb-3 px-2 tracking-wider opacity-80">
        Workspace Modules
      </p>
      
      {menuItems.map((item) => {
        const Icon = item.icon;
        const isActive = currentView === item.id;
        return (
          <button
            key={item.id}
            onClick={() => {
              if (typeof triggerAudioCue === 'function') {
                triggerAudioCue('click');
              }
              setCurrentView(item.id);
            }}
            className={`w-full p-3 text-sm font-bold rounded-xl text-left flex items-center gap-2.5 transition-all border border-transparent ${
              isActive 
                ? 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-white font-black border-indigo-100/50 dark:border-indigo-500/20' 
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Icon 
              size={16} 
              className={isActive ? 'text-indigo-600 dark:text-white' : 'text-slate-400 dark:text-slate-400'} 
            />
            <span>{item.label}</span>
          </button>
        );
      })}
    </div>
  );
}