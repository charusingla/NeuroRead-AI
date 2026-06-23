import React, { useState } from 'react';
import { User, Star, Award, Fingerprint, Camera } from 'lucide-react';

export default function MyProfile({ currentUser, triggerAudioCue }) {
  if (!currentUser) return null;

  const [profileImage, setProfileImage] = useState(
    localStorage.getItem(`profile_img_${currentUser.username}`) || ''
  );

  const handleActionClick = () => {
    if (typeof triggerAudioCue === 'function') {
      triggerAudioCue('click');
    }
  };

  const handleImageUpload = (e) => {
    handleActionClick();
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert("Image is too large! Please choose a picture under 2MB.");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const base64Data = reader.result;
        setProfileImage(base64Data);
        localStorage.setItem(`profile_img_${currentUser.username}`, base64Data);
        window.dispatchEvent(new Event('profile_image_updated'));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="p-0 max-w-4xl mx-auto space-y-6 text-left transition-colors">
      
      {/* Profile Header Deck Panel */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/60 dark:border-slate-800/80 shadow-sm flex items-center gap-4 transition-colors">
        
        {/* UPGRADED AVATAR PICKER CONTAINER */}
        <div className="relative group w-20 h-20 flex-shrink-0">
          <label className="cursor-pointer block w-full h-full relative rounded-full overflow-hidden border-2 border-indigo-100 dark:border-indigo-950 hover:border-indigo-500 dark:hover:border-indigo-400 transition-all shadow-sm">
            <input 
              type="file" 
              accept="image/*" 
              onChange={handleImageUpload} 
              className="hidden" 
            />
            
            {profileImage ? (
              <img 
                src={profileImage} 
                alt="User Profile avatar" 
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                <User size={32} />
              </div>
            )}

            {/* Hover overlay badge prompt layer */}
            <div className="absolute inset-0 bg-slate-900/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
              <Camera size={16} />
            </div>
          </label>
        </div>

        <div className="space-y-1.5">
          <h2 className="text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
            {currentUser.username || "Student Profile"}
          </h2>
          <span className="inline-flex items-center px-3 py-0.5 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-400 border border-indigo-100/30 dark:border-indigo-900/30 uppercase tracking-wider">
            ⭐ Student Space
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Progress Statistics Card */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/60 dark:border-slate-800/80 shadow-sm space-y-4 transition-colors">
          <h3 className="text-xs font-extrabold uppercase tracking-widest text-slate-400 dark:text-slate-500 flex items-center gap-1.5 px-1">
            <Award size={16} className="text-indigo-500" /> Progress Statistics
          </h3>
          <div className="space-y-3 font-semibold text-xs">
            <div className="flex justify-between items-center p-3.5 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-850 rounded-2xl transition-colors">
              <span className="text-slate-500 dark:text-slate-400">Total Learning Experience:</span>
              <span className="text-sm font-black text-amber-600 dark:text-amber-400 flex items-center gap-1">
                <Star size={14} className="fill-amber-400 text-amber-400 dark:fill-amber-500" /> {currentUser.gamification?.xp || 0} XP
              </span>
            </div>
            <div className="flex justify-between items-center p-3.5 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-850 rounded-2xl transition-colors">
              <span className="text-slate-500 dark:text-slate-400">Active Progress Level:</span>
              <span className="px-2.5 py-1 bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-100/40 dark:border-indigo-900/30 text-indigo-700 dark:text-indigo-400 rounded-lg text-xs font-black">
                Level {currentUser.gamification?.level || 1}
              </span>
            </div>
          </div>
        </div>

        {/* Account Parameters Card */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/60 dark:border-slate-800/80 shadow-sm space-y-4 transition-colors">
          <h3 className="text-xs font-extrabold uppercase tracking-widest text-slate-400 dark:text-slate-500 flex items-center gap-1.5 px-1">
            <Fingerprint size={16} className="text-teal-500" /> Account Parameters
          </h3>
          <div className="space-y-3 font-semibold text-xs">
            <div className="flex justify-between items-center p-3.5 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-850 rounded-2xl transition-colors">
              <span className="text-slate-500 dark:text-slate-400">Assigned Access Permissions:</span>
              <span className="font-black text-slate-700 dark:text-slate-300 capitalize">
                Student Account
              </span>
            </div>
            <div className="p-3.5 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-800 dark:text-emerald-400 border border-emerald-100/40 dark:border-emerald-900/30 rounded-2xl text-xs font-bold leading-relaxed transition-colors">
              🛡️ COPPA Secure Workspace Policy Active.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}