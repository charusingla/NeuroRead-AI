import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Compass, Shield, Sun, Moon, LogOut, ArrowRight, BrainCircuit, Star, Volume2, VolumeX } from 'lucide-react';
import InteractiveBrainCanvas from './components/InteractiveBrainCanvas';
import Toolbar from './components/Toolbar';
import ToastContainer from './components/ToastContainer';
import AuthScreen from './features/auth/AuthScreen';
import NavigationSidebar from './features/dashboard/NavigationSidebar';
import StudentDashboard from './features/dashboard/StudentDashboard';
import SpacerStudio from './features/ai-reader/SpacerStudio';
import GameHub from './features/gaming/GameHub';
import VisualAnchorLab from './features/anchor-lab/VisualAnchorLab'; 
import OcrReaderLab from './features/ocr-lab/OcrReaderLab';
import TutorChatCompanion from './features/tutor-chat/TutorChatCompanion';
import AcousticSpeechLab from './features/speech-lab/AcousticSpeechLab';
import MyProfile from './features/profile/MyProfile';
import AdminDashboard from './features/admin/AdminDashboard'; // 👑 Added Admin Panel Import
import BrainFeaturesMap from './assets/brain-features-map.png';
import { motion } from "framer-motion";
import { SYLLABLE_WORDS, REVERSAL_QUESTIONS, TRACKING_WORDS, BLENDER_WORDS } from './data/gameData';

const playCalmSound = (type = 'click') => {
  try {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain); gain.connect(ctx.destination);
    if (type === 'click') {
      osc.frequency.setValueAtTime(320, ctx.currentTime);
      gain.gain.setValueAtTime(0.5, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
    } else if (type === 'correct') {
      osc.frequency.setValueAtTime(523.25, ctx.currentTime);
      gain.gain.setValueAtTime(0.06, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);
    } else {
      osc.frequency.setValueAtTime(220, ctx.currentTime);
      gain.gain.setValueAtTime(0.04, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
    }
    osc.start(); osc.stop(ctx.currentTime + 0.35);
  } catch (err) { console.warn("Audio Context permissions skipped."); }
};

export default function App() {
  const API_BASE = window.location.hostname === 'localhost' 
  ? "http://localhost:5000/api" 
  : "https://your-backend-name.onrender.com/api";
  
  const [currentView, setCurrentView] = useState('landing');
  const [theme, setTheme] = useState('light');
  const [toasts, setToasts] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const cleanView = currentView === 'landing' ? '' : currentView;
    if (window.location.pathname !== `/${cleanView}`) {
      navigate(`/${cleanView}`);
    }
  }, [currentView, navigate]);

  // 👑 2. Safely read browser URLs on refresh without causing blank screen locks
  useEffect(() => {
    const rawPath = window.location.pathname.replace('/', '').trim();
    
    // Explicit array whitelist of your application views
    const validViews = [
      'dashboard', 'ai-reader', 'gaming-zone', 'anchor-lab', 
      'ocr-scanner', 'tutor-chat', 'speech-practice', 'my-profile', 'auth'
    ];

    if (validViews.includes(rawPath)) {
      setCurrentView(rawPath);
    } else {
      setCurrentView('landing'); // Fallback ensures your app never opens a blank screen
    }
  }, []);

  // Layout Adjustment Visual Controls Core States
  const [fontSize, setFontSize] = useState(15);
  const [letterSpacing, setLetterSpacing] = useState(0.14);
  const [lineHeight, setLineHeight] = useState(1.9);
  const [wordSpacing, setWordSpacing] = useState(0.28);
  const [useOpenDyslexic, setUseOpenDyslexic] = useState(false);
  const [showRuler, setShowRuler] = useState(false);
  const [rulerPosition, setRulerPosition] = useState(150);
  const [irlenColor, setIrlenColor] = useState('none');

  // Interactive AI & Media Workspaces Cache States
  const [ocrResultText, setOcrResultText] = useState("");
  const [soundEnabled, setSoundEnabled] = useState(true); // Sound defaults to ON

  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [headerImage, setHeaderImage] = useState('');

  const showToast = (message, type = 'success') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3000);
  };

  // 👑 SYNCHRONIZED BACKEND XP AND CALENDAR STREAK LOGIC
  const addXP = async (amount) => {
    if (!currentUser) return;

    try {
      const response = await fetch(`${API_BASE}/progress/earn-xp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: currentUser._id, xpGained: amount })
      });

      if (response.ok) {
        const data = await response.json();
        
        // Securely update frontend dashboard metrics with exact database numbers
        setCurrentUser(prev => ({
          ...prev,
          gamification: data.gamification
        }));
        
        showToast(`✨ +${amount} Learning XP Gained!`);
      } else {
        const errData = await response.json();
        console.error("Progress engine calculation warning:", errData.error);
      }
    } catch (err) {
      console.error("Failed to sync metrics stream with MongoDB Atlas:", err);
    }
  };

  const typographyStyle = useMemo(() => ({
    fontSize: `${fontSize}px`,
    letterSpacing: `${letterSpacing}em`,
    lineHeight: `${lineHeight}`,
    wordSpacing: `${wordSpacing}em`,
    fontFamily: useOpenDyslexic ? '"Lexend", sans-serif' : 'inherit'
  }), [fontSize, letterSpacing, lineHeight, wordSpacing, useOpenDyslexic]);

  useEffect(() => {
    const rootElement = window.document.documentElement; // References the <html> tag
    
    if (theme === 'dark') {
      rootElement.setAttribute('data-theme', 'dark');
      rootElement.classList.add('dark'); // Safe legacy selector fallback
    } else {
      rootElement.setAttribute('data-theme', 'light');
      rootElement.classList.remove('dark');
    }
  }, [theme]);
  
  useEffect(() => {
    document.documentElement.style.setProperty('--global-font-size', `${fontSize}px`);
  }, [fontSize]);

  useEffect(() => {
    if (useOpenDyslexic) {
      document.body.classList.add('dyslexia-font');
    } else {
      document.body.classList.remove('dyslexia-font');
    }
  }, [useOpenDyslexic]);

  useEffect(() => {
    if (!currentUser?.username) {
      setHeaderImage('');
      return;
    }
    
    setHeaderImage(localStorage.getItem(`profile_img_${currentUser.username}`) || '');

    const handleImageSync = () => {
      setHeaderImage(localStorage.getItem(`profile_img_${currentUser.username}`) || '');
    };
    
    window.addEventListener('profile_image_updated', handleImageSync);
    return () => window.removeEventListener('profile_image_updated', handleImageSync);
  }, [currentUser?.username]);

  const triggerAudioCue = (type = 'click') => {
    if (soundEnabled) {
      playCalmSound(type);
    }
  };

  // Dedicated Sound Switch Trigger
  const toggleGlobalAudio = () => {
    const nextState = !soundEnabled;
    setSoundEnabled(nextState);
    if (!nextState) {
      window.speechSynthesis.cancel(); // Stop talking instantly if muted
    } else {
      playCalmSound('click'); // Click indicator confirmation when unmuted
    }
  };

  return (
    <div 
      className={`min-h-screen relative flex flex-col transition-colors duration-300 ${theme === 'dark' ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-800'}`}
      onMouseMove={(e) => showRuler && setRulerPosition(e.clientY - 24)}
    >
      <InteractiveBrainCanvas />
      {irlenColor !== 'none' && (
        <div className="fixed inset-0 pointer-events-none z-50 mix-blend-multiply opacity-15" style={{ backgroundColor: irlenColor === 'soft-blue' ? '#C2E5D3' : irlenColor === 'soft-yellow' ? '#FCF0C8' : irlenColor === 'soft-green' ? '#E1F8C3' : '#FAD4D8' }} />
      )}
      {showRuler && (
        <div className="fixed left-0 right-0 pointer-events-none z-40 bg-indigo-500/10 border-y-2 border-indigo-500/40 shadow-sm" style={{ top: `${rulerPosition}px`, height: `48px` }} />
      )}

      <ToastContainer toasts={toasts} />

      <header className="sticky top-0 z-30 bg-white/80 dark:bg-slate-900/60 backdrop-blur-md border-b border-slate-200/50 dark:border-slate-800/80 h-20 flex items-center justify-between px-6 transition-colors">
        {/* 🛡️ ADAPTIVE LOGO INTERCEPT ROUTER */}
        <div 
          className="flex items-center gap-1.5 cursor-pointer" 
          onClick={() => { 
            triggerAudioCue('click'); 
            if (currentUser) {
              setCurrentView(currentUser.role === 'admin' ? 'admin-dashboard' : 'dashboard');
            } else {
              setCurrentView('landing');
            }
          }}
        >
          <BrainCircuit size={24} className="text-indigo-600 dark:text-indigo-400" /> 
          <span className="font-bold text-indigo-600 dark:text-white" style={{ fontSize: '16px', fontStyle: 'normal' }}>NeuroRead AI</span>
        </div>
        
        <div className="flex items-center gap-1.5">
          {/* 🔊 NEW GLOBAL AUDIO TOGGLE BUTTON */}
          <button 
            onClick={toggleGlobalAudio} 
            className={`p-2.5 rounded-xl cursor-pointer border transition-all transform active:scale-95 ${
              soundEnabled 
                ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900/40 text-emerald-600 dark:text-emerald-400' 
                : 'bg-rose-50/50 dark:bg-rose-950/20 border-rose-200 dark:border-rose-900/40 text-rose-500 dark:text-rose-400'
            }`}
            title={soundEnabled ? "Mute Sounds" : "Unmute Sounds"}
          >
            {soundEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
          </button>

          {/* THEME SWITCH BUTTON */}
          <button onClick={() => { triggerAudioCue('click'); setTheme(theme === 'light' ? 'dark' : 'light'); }} className="p-2.5 rounded-xl cursor-pointer bg-transparent hover:bg-slate-100 dark:hover:bg-slate-900/60 border border-transparent dark:hover:border-slate-800 text-slate-500 dark:text-slate-400 transition-all">
            {theme === 'light' ? <Sun size={20} className="text-amber-500" /> : <Moon size={20} className="text-indigo-400" />}
          </button>

          {currentUser ? (
            <div className="relative">
              <button
                type="button"
                onClick={() => { triggerAudioCue('click'); setProfileMenuOpen(!profileMenuOpen); }}
                className={`flex items-center gap-2 p-1.5 pr-3 cursor-pointer rounded-xl border transition-all ${
                  profileMenuOpen 
                    ? 'bg-indigo-50/50 border-indigo-200 dark:bg-indigo-950/20 dark:border-indigo-900/50' 
                    : 'bg-transparent border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900/40'
                }`}
              >
                <div className="w-8 h-8 rounded-lg overflow-hidden bg-indigo-600 text-white flex items-center justify-center font-black text-sm uppercase shadow-sm flex-shrink-0">
                  {headerImage ? (
                    <img src={headerImage} alt="Nav Avatar" className="w-full h-full object-cover" />
                  ) : (
                    currentUser.username ? currentUser.username.charAt(0) : 'S'
                  )}
                </div>
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300 hidden sm:inline">
                  {currentUser.username || 'Profile'}
                </span>
              </button>

              {profileMenuOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setProfileMenuOpen(false)} />
                  
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-900 border rounded-2xl shadow-xl py-2 z-50 animate-fadeIn text-left border-slate-100 dark:border-slate-800">
                    <div className="px-4 py-2 border-b dark:border-slate-800">
                      <p className="text-xs font-black text-indigo-700 dark:text-indigo-400 truncate">
                        {currentUser.username || 'Account'}
                      </p>
                      <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 tracking-wider mt-0.5 uppercase">
                        {currentUser.role === 'admin' ? '👑 Admin Space' : '⭐ Student Space'}
                      </p>
                    </div>
                    
                    {currentUser.role !== 'admin' && (
                      <button
                        onClick={() => {
                          triggerAudioCue('click');
                          setProfileMenuOpen(false);
                          setCurrentView('my-profile');
                        }}
                        className="w-full px-4 py-2.5 text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60 flex items-center gap-2 transition-colors"
                      >
                        👤 My Profile 
                      </button>
                    )}
                    
                    <button
                      onClick={() => {
                        triggerAudioCue('click');
                        setProfileMenuOpen(false);
                        setCurrentUser(null);
                        localStorage.removeItem('token');
                        setCurrentView('landing');
                      }}
                      className="w-full px-4 py-2.5 text-sm font-bold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2 transition-colors"
                    >
                      <LogOut size={14} /> Log Out
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <button onClick={() => { triggerAudioCue('click'); setCurrentView('auth'); }} className="px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-indigo-500 text-white rounded-xl font-bold text-xs shadow-md shadow-indigo-500/10 hover:opacity-95 transition-all">Access Platform</button>
          )}
        </div>
      </header>

      {currentUser && currentUser.role !== 'admin' && currentView !== 'landing' && currentView !== 'auth' && (
        <Toolbar 
          theme={theme}
          useOpenDyslexic={useOpenDyslexic} setUseOpenDyslexic={setUseOpenDyslexic}
          showRuler={showRuler} setShowRuler={setShowRuler}
          irlenColor={irlenColor} setIrlenColor={setIrlenColor}
          fontSize={fontSize} setFontSize={setFontSize}
        />
      )}

      <main className="flex-1 z-10 relative max-w-7xl w-full mx-auto px-6 py-8">
        {currentView === 'landing' && (
          <div className="py-0 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center text-left">
            <div className="lg:col-span-6 space-y-5">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-full text-xs font-black uppercase tracking-wider"><Sparkles size={12} /> Refactored Architecture Bundle</div>
              <h1 className="text-5xl md:text-6xl font-black tracking-tight leading-none text-black dark:text-white transition-colors duration-300 ease-in-out">Learning should feel{" "} <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-teal-400">FUN.</span></h1>
              <p className="text-slate-500 dark:text-slate-400 text-justify font-semibold text-lg leading-relaxed">Welcome to your personalized dyslexia support dashboard, designed to make learning simpler, engaging, and stress-free. Access interactive tools, track your progress, and explore activities tailored to strengthen reading, writing, and comprehension skills at your own pace. Our goal is to create an accessible and confidence-building learning environment where every student can grow, learn, and succeed without barriers.</p>
              <button onClick={() => { triggerAudioCue('click'); setCurrentView('auth'); }} className="px-6 py-3.5 bg-gradient-to-r from-indigo-600 to-indigo-500 text-white rounded-2xl font-bold text-sm shadow-xl shadow-indigo-500/10 hover:opacity-95 transition-all flex items-center gap-2">Enter Studio Sandbox <ArrowRight size={16} /></button>
            </div>

            <div className="lg:col-span-6 flex justify-center items-center">
              <div className="w-full max-w-2xl transition-all transform scale-[1.01] duration-500">
                <motion.div initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} viewport={{ once: true }} className="relative overflow-hidden rounded-3xl" >
                  <motion.div animate={{ opacity: [0.3, 0.6, 0.3], scale: [1, 1.03, 1] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }} className="absolute -inset-3 rounded-3xl bg-gradient-to-r from-cyan-500/20 via-blue-300/20 to-purple-500/20 blur-2xl" />
                  <motion.div animate={{ x: ["-100%", "200%"] }} transition={{ duration: 3, repeat: Infinity, ease: "linear" }} className="absolute top-0 left-0 h-full w-24 bg-gradient-to-r from-transparent via-cyan-400/20 to-transparent skew-x-12 pointer-events-none z-10" />
                  <motion.img src={BrainFeaturesMap} alt="NeuroRead AI Core Functionality Mind Map" animate={{ y: [0, -8, 0] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }} className="relative z-0 w-full h-auto object-contain rounded-3xl shadow-xl border border-slate-200/50 dark:border-slate-800/50 bg-white dark:bg-slate-900" />
                </motion.div>
              </div>
            </div>
          </div>
        )}

        {currentView === 'auth' && (
          <AuthScreen 
            onAuthSuccess={(user) => { 
              setCurrentUser(user); 
              setCurrentView(user.role === 'admin' ? 'admin-dashboard' : 'dashboard'); 
            }}
            apiBase={API_BASE} 
            showToast={showToast} 
            triggerAudioCue={triggerAudioCue}
            onExit={() => setCurrentView('landing')} // 👑 Redirects cleanly back to your Landing Home Sandbox layout!
          />
        )}

        {/* 🎛️ SYSTEM WORKSPACE MANAGER PANEL CORRIDOR */}
        {currentUser && currentView !== 'landing' && currentView !== 'auth' && (
          currentUser.role === 'admin' ? (
            /* 👑 SECURE ADMINISTRATIVE DASHBOARD PLATFORM PANEL */
            <AdminDashboard 
              apiBase={API_BASE}
              showToast={showToast}
              triggerAudioCue={triggerAudioCue}
              onLogOut={() => {
                triggerAudioCue('click');
                setCurrentUser(null);
                localStorage.removeItem('token');
                setCurrentView('landing');
              }}
            />
          ) : (
            /* 🎒 PROTECTED STUDENT INTERACTIVE ENVIRONMENT DESKTOP GRID */
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              <div className="lg:col-span-3">
                <NavigationSidebar currentView={currentView} setCurrentView={setCurrentView} currentUser={currentUser} triggerAudioCue={triggerAudioCue} />
              </div>
              <div className="lg:col-span-9">
                {currentView === 'dashboard' && <StudentDashboard currentUser={currentUser} setCurrentView={setCurrentView} triggerAudioCue={triggerAudioCue} />}
                
                {currentView === 'ai-reader' && (
                  <SpacerStudio 
                    ocrResultText={ocrResultText} setOcrResultText={setOcrResultText}
                    letterSpacing={letterSpacing} setLetterSpacing={setLetterSpacing}
                    lineHeight={lineHeight} setLineHeight={setLineHeight}
                    wordSpacing={wordSpacing} setWordSpacing={setWordSpacing}
                    typographyStyle={typographyStyle}
                    triggerAudioCue={triggerAudioCue}
                  />
                )}

                {currentView === 'anchor-lab' && <VisualAnchorLab triggerAudioCue={triggerAudioCue} />}

                {currentView === 'ocr-scanner' && <OcrReaderLab triggerAudioCue={triggerAudioCue} />}

                {currentView === 'tutor-chat' && <TutorChatCompanion triggerAudioCue={triggerAudioCue} />}

                {currentView === 'gaming-zone' && (
                  <GameHub 
                    wordPool={SYLLABLE_WORDS} reversalPool={REVERSAL_QUESTIONS} trackingPool={TRACKING_WORDS} blenderPool={BLENDER_WORDS}
                    addXP={addXP} showToast={showToast} playCalmSound={playCalmSound} triggerAudioCue={triggerAudioCue}
                  />
                )}

                {currentView === 'speech-practice' && <AcousticSpeechLab triggerAudioCue={triggerAudioCue} />}

                {currentView === 'my-profile' && <MyProfile currentUser={currentUser} triggerAudioCue={triggerAudioCue} />}

                {!['dashboard', 'ai-reader', 'gaming-zone', 'anchor-lab', 'ocr-scanner', 'tutor-chat', 'speech-practice', 'my-profile'].includes(currentView) && (
                  <div className="bg-white dark:bg-slate-900/40 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 text-center font-bold text-slate-400 dark:text-slate-500 animate-pulse">
                    Workspace Submodule view placeholder mounted successfully.
                  </div>
                )}
              </div>
            </div>
          )
        )}
      </main>

      <footer className="h-16 border-t border-slate-200/50 dark:border-slate-800/80 text-slate-400 dark:text-slate-500 text-[10px] font-bold flex items-center justify-between px-6 z-10 relative bg-white dark:bg-slate-950 transition-colors">
        <div className="flex items-center gap-1.5"><BrainCircuit size={14} className="text-indigo-600 dark:text-indigo-400" /> <span>NeuroRead AI Framework Services.</span></div>
        <div><a href="#" className="hover:underline dark:text-slate-400">COPPA Secure Architecture Policy Matrix</a></div>
      </footer>
    </div>
  );
}