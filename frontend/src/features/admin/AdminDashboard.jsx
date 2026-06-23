import React, { useState, useEffect } from 'react';
import { ShieldAlert, LogOut, Users, Activity, Radio, RefreshCw, UserMinus, Trophy, Star, Flame } from 'lucide-react';

export default function AdminDashboard({ apiBase, showToast, triggerAudioCue, onLogOut }) {
  const [activeTab, setActiveTab] = useState('live'); // 'live' | 'progress'
  const [liveSessions, setLiveSessions] = useState([]);
  const [allStudents, setAllStudents] = useState([]);
  const [isPolling, setIsPolling] = useState(true);
  const [loadingMetrics, setLoadingMetrics] = useState(false);

  const handleActionClick = (callback) => {
    if (typeof triggerAudioCue === 'function') triggerAudioCue('click');
    if (callback) callback();
  };

  // 📡 Sync real-time online connections
  const fetchLiveStatus = async () => {
    try {
      const res = await fetch(`${apiBase}/admin/live-status`);
      if (res.ok) {
        const data = await res.json();
        setLiveSessions(data.onlineStudents || []);
      }
    } catch (err) {
      console.error("Failed to sync live student login status streams:", err);
    }
  };

  // 📈 Fetch global student metrics from Atlas (Streaks, Points, Levels)
  const fetchStudentMetrics = async (silent = false) => {
    if (!silent) setLoadingMetrics(true);
    try {
      const res = await fetch(`${apiBase}/admin/students-metrics`);
      if (res.ok) {
        const data = await res.json();
        setAllStudents(data.students || []);
      }
    } catch (err) {
      if (!silent) showToast("Could not load student metrics ledger", "error");
    } finally {
      if (!silent) setLoadingMetrics(false);
    }
  };

  // 🔄 BACKGROUND POLLING ENGINE: Automatically fetches live lists and metrics tracks every 4s
  useEffect(() => {
    fetchLiveStatus();
    fetchStudentMetrics(true);

    let intervalId;
    if (isPolling) {
      intervalId = setInterval(() => {
        fetchLiveStatus();
        fetchStudentMetrics(true); // Continually track and push updates for both views seamlessly
      }, 4000);
    }
    return () => clearInterval(intervalId);
  }, [isPolling, activeTab]);

  const handleKickStudent = async (username) => {
    handleActionClick(async () => {
      try {
        const res = await fetch(`${apiBase}/admin/logout-student`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username })
        });
        if (res.ok) {
          setLiveSessions(prev => prev.filter(s => s.username !== username));
          showToast(`Disconnected active session for ${username}`, "warning");
        }
      } catch (err) {
        showToast("Error disconnecting session", "error");
      }
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 font-sans flex flex-col transition-colors duration-300">
      
      {/* 👑 Global Administration Header Control Panel */}
      <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 h-20 flex items-center justify-between px-8 sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-700 rounded-xl text-white shadow-md shadow-indigo-500/20">
            <ShieldAlert size={20} />
          </div>
          <div>
            <h1 className="text-xl text-indigo-600 dark:text-white font-black tracking-tight">System Admin Console</h1>
          </div>
        </div>

        <button 
          onClick={() => handleActionClick(onLogOut)}
          className="flex items-center gap-2 px-4 py-2.5 bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/20 dark:hover:bg-rose-950/40 text-rose-600 dark:text-rose-400 text-xs font-black rounded-xl border border-rose-100 dark:border-rose-900/40 transition-all transform active:scale-95 shadow-sm"
        >
          <LogOut size={14} /> Close
        </button>
      </header>

      {/* Main Workspace Frame */}
      <div className="max-w-7xl w-full mx-auto px-6 py-8 flex-1 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Navigation Sidebar Tabs */}
        <nav className="lg:col-span-3 space-y-2">
          <button 
            onClick={() => handleActionClick(() => setActiveTab('live'))}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-xl font-bold text-sm transition-all border ${
              activeTab === 'live' 
                ? 'bg-indigo-600 text-white border-transparent shadow-md shadow-indigo-500/10' 
                : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-500 hover:bg-slate-100'
            }`}
          >
            <div className="flex items-center gap-3">
              <Radio size={16} className={activeTab === 'live' ? 'animate-bounce' : ''} />
              <span>Live Student Logins</span>
            </div>
            {liveSessions.length > 0 && (
              <span className={`px-2 py-0.5 text-xs font-black rounded-md ${activeTab === 'live' ? 'bg-white text-indigo-600' : 'bg-indigo-500 text-white'}`}>
                {liveSessions.length}
              </span>
            )}
          </button>

          <button 
            onClick={() => handleActionClick(() => setActiveTab('progress'))}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-xl font-bold text-sm transition-all border ${
              activeTab === 'progress' 
                ? 'bg-indigo-600 text-white border-transparent shadow-md shadow-indigo-500/10' 
                : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-500 hover:bg-slate-100'
            }`}
          >
            <div className="flex items-center gap-3">
              <Trophy size={16} />
              <span>Student Performance</span>
            </div>
            {allStudents.length > 0 && (
              <span className={`px-2 py-0.5 text-xs font-black rounded-md ${activeTab === 'progress' ? 'bg-white text-indigo-600' : 'bg-indigo-500 text-white'}`}>
                {allStudents.length}
              </span>
            )}
          </button>
        </nav>

        {/* Dynamic Workspace Container */}
        <main className="lg:col-span-9 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 rounded-3xl p-6 shadow-sm min-h-[400px] transition-colors relative">
          
          {/* TAB 1: LIVE ONLINE MONITOR */}
          {activeTab === 'live' && (
            <>
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4 mb-6">
                <div>
                  <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                    <Activity size={18} className="text-emerald-500" /> Active Session Watch
                  </h2>
                  <p className="text-xs font-semibold text-slate-400 mt-0.5">Students currently executing platform activities in real-time.</p>
                </div>
                
                <button
                  onClick={() => handleActionClick(() => setIsPolling(!isPolling))}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-[10px] font-black uppercase tracking-wider transition-all ${
                    isPolling 
                      ? 'bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900/30' 
                      : 'bg-slate-50 text-slate-400 border-slate-200 dark:bg-slate-950'
                  }`}
                >
                  <RefreshCw size={10} className={isPolling ? 'animate-spin' : ''} />
                  {isPolling ? 'Auto-Syncing live' : 'Sync paused'}
                </button>
              </div>

              {liveSessions.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center space-y-3">
                  <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-full border border-dashed border-slate-200 dark:border-slate-800">
                    <Users size={28} className="text-slate-300 dark:text-slate-700" />
                  </div>
                  <p className="text-xs font-bold text-slate-400 dark:text-slate-500 tracking-wide max-w-xs">
                    No students are currently logged in. Active rows will manifest here instantly as user sessions initialize.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {liveSessions.map((session, idx) => (
                    <div 
                      key={idx}
                      className="p-4 bg-slate-50 dark:bg-slate-950/60 border border-slate-200/50 dark:border-slate-850 rounded-2xl flex items-center justify-between shadow-sm animate-in fade-in"
                    >
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <div className="w-10 h-10 bg-indigo-600 text-white rounded-xl flex items-center justify-center font-black uppercase shadow-sm">
                            {session.username ? session.username.charAt(0) : 'S'}
                          </div>
                          <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white dark:border-slate-950 rounded-full animate-pulse" />
                        </div>
                        <div>
                          <h4 className="font-black text-sm text-slate-900 dark:text-white">{session.username}</h4>
                          
                          <div className="flex flex-wrap items-center gap-2 mt-1">
                            <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 bg-indigo-100 text-indigo-700 dark:bg-indigo-950/50 dark:text-indigo-300 rounded text-[9px] font-bold">
                              Lvl {session.gamification?.level || 1}
                            </span>
                            <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300 rounded text-[9px] font-black">
                              {session.gamification?.xp || 0} XP
                            </span>
                            <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400 rounded text-[9px] font-black">
                              🔥 {session.gamification?.streak || 0} Days
                            </span>
                          </div>
                          
                          <p className="text-[9px] font-bold text-slate-400 tracking-wide mt-1">Logged: {session.lastActive}</p>
                        </div>
                      </div>

                      <button
                        onClick={() => handleKickStudent(session.username)}
                        className="p-2 text-slate-400 hover:text-rose-500 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-xl transition-all border border-transparent hover:border-rose-100 dark:hover:border-rose-900/30"
                        title="Disconnect Student Session"
                      >
                        <UserMinus size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {/* TAB 2: ALL REGISTERED STUDENTS & SCORES PROGRESS */}
          {activeTab === 'progress' && (
            <>
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4 mb-6">
                <div>
                  <h2 className="text-xl font-black text-indigo-600 dark:text-indigo-400 flex items-center gap-2">
                    <Trophy size={18} className="text-amber-500" /> Student Performance Ledger
                  </h2>
                  <p className="text-xs font-semibold text-slate-400 mt-0.5">Comprehensive tracking history recorded straight from your cloud database cluster.</p>
                </div>
                
                <button
                  onClick={() => handleActionClick(() => fetchStudentMetrics(false))}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-[10px] font-black uppercase bg-slate-50 hover:bg-slate-100 border-slate-200 dark:bg-slate-950 dark:border-slate-800"
                  disabled={loadingMetrics}
                >
                  <RefreshCw size={10} className={loadingMetrics ? 'animate-spin' : ''} />
                  Reload Core
                </button>
              </div>

              {loadingMetrics ? (
                <div className="text-center py-16 font-bold text-slate-400 animate-pulse text-xs uppercase tracking-widest">
                  Querying MongoDB Atlas Collection Streams...
                </div>
              ) : allStudents.length === 0 ? (
                <div className="text-center py-16 text-slate-400 text-xs font-bold">
                  No registered student accounts found in the database.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm border-collapse">
                    <thead>
                      <tr className="border-b border-slate-100 dark:border-slate-800 text-[10px] uppercase font-black text-slate-400 tracking-wider">
                        <th className="py-3 px-4">Student Identity</th>
                        <th className="py-3 px-4 text-center">Current Level</th>
                        <th className="py-3 px-4 text-center">Total Learning XP</th>
                        <th className="py-3 px-4 text-center">Active Streak</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                      {allStudents.map((student) => (
                        <tr key={student._id || student.username} className="hover:bg-slate-50/50 dark:hover:bg-slate-950/20 transition-colors">
                          <td className="py-3.5 px-4">
                            <div className="font-bold text-slate-900 dark:text-white">{student.username}</div>
                            <div className="text-[11px] font-medium text-slate-400 mt-0.5">{student.email || "N/A"}</div>
                          </td>
                          <td className="py-3.5 px-4 text-center">
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 rounded-lg text-xs font-black">
                              <Star size={11} className="fill-current" /> Lvl {student.gamification?.level ?? 1}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-center font-black text-indigo-600 dark:text-indigo-400">
                            {student.gamification?.xp ?? 0} XP
                          </td>
                          <td className="py-3.5 px-4 text-center">
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-500 rounded-lg text-xs font-black">
                              <Flame size={12} /> {student.gamification?.streak ?? 0} Days
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )}

        </main>
      </div>
    </div>
  );
}