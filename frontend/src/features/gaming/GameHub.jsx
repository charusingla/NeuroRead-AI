import React, { useState } from 'react';
import GameCard from './GameCard';
import SyllableQuest from './games/SyllableQuest';
import MirrorLetters from './games/MirrorLetters';
import VisualPath from './games/VisualPath';
import SoundBlender from './games/SoundBlender';

export default function GameHub({ 
  wordPool, 
  reversalPool, 
  trackingPool, 
  blenderPool, 
  addXP, 
  showToast, 
  playCalmSound,
  triggerAudioCue 
}) {
  const [activeGame, setActiveGame] = useState(null);

  // Sound-safe exit wrapper
  const handleGameExit = () => {
    if (typeof triggerAudioCue === 'function') {
      triggerAudioCue('click');
    }
    setActiveGame(null);
  };

  if (activeGame === 'syllables') {
    return <SyllableQuest wordPool={wordPool} onExit={handleGameExit} addXP={addXP} showToast={showToast} playCalmSound={playCalmSound} />;
  }
  if (activeGame === 'reversals') {
    return <MirrorLetters questions={reversalPool} onExit={handleGameExit} addXP={addXP} playCalmSound={playCalmSound} />;
  }
  if (activeGame === 'tracking') {
    return <VisualPath questions={trackingPool} onExit={handleGameExit} addXP={addXP} playCalmSound={playCalmSound} />;
  }
  if (activeGame === 'blender') {
    return <SoundBlender pool={blenderPool} onExit={handleGameExit} addXP={addXP} playCalmSound={playCalmSound} />;
  }

  return (
    <div className="space-y-6 text-left animate-in fade-in duration-300 transition-colors">
      <div>
        <h2 className="text-indigo-600 dark:text-white text-3xl font-black tracking-tight">Interactive Play Station Arcade</h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold mt-1">Cognitive visual parsing spaces mapped to game states natively.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        <GameCard 
          title="Syllable Quest" 
          category="Phonology Space" 
          description="Sort visual structural syllable bits in spoken pronunciation order streams cleanly." 
          badgeColor="indigo" 
          onLaunch={() => setActiveGame('syllables')} 
          triggerAudioCue={triggerAudioCue}
        />
        <GameCard 
          title="Mirror Letters" 
          category="Symmetry Map" 
          description="Isolate spatial character configurations to tackle structural b/d/p/q orientation swaps." 
          badgeColor="teal" 
          onLaunch={() => setActiveGame('reversals')} 
          triggerAudioCue={triggerAudioCue}
        />
        <GameCard 
          title="Visual Path" 
          category="Attention Focus" 
          description="Pinpoint correct pattern sequence validations efficiently along distraction-filled rows." 
          badgeColor="amber" 
          onLaunch={() => setActiveGame('tracking')} 
          triggerAudioCue={triggerAudioCue}
        />
        <GameCard 
          title="Sound Blender" 
          category="Acoustic Synthesis" 
          description="Blend split phonic segment blocks natively using contextual reference framework guidelines." 
          badgeColor="rose" 
          onLaunch={() => setActiveGame('blender')} 
          triggerAudioCue={triggerAudioCue}
        />
      </div>
    </div>
  );
}