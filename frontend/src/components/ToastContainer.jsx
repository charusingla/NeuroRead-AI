import React from 'react';
import { AlertCircle, Bell, CheckCircle2 } from 'lucide-react';

export default function ToastContainer({ toasts }) {
  if (!toasts || toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 pointer-events-none">
      {toasts.map((toast) => {
        // Assign the icon dynamically based on the warning state
        let IconComponent = Bell;
        let iconColorClass = "text-indigo-400";

        // Check if it's an error message like the security PIN restriction
        const isWarning = 
          toast.type === 'error' || 
          toast.type === 'warning' || 
          (toast.message && toast.message.toLowerCase().includes('must be'));

        if (isWarning) {
          IconComponent = AlertCircle;
          iconColorClass = "text-rose-500";
        } else if (toast.type === 'success') {
          IconComponent = CheckCircle2;
          iconColorClass = "text-emerald-400";
        }

        return (
          <div 
            key={toast.id} 
            className="flex items-center gap-3 bg-slate-900 text-white px-5 py-3.5 rounded-2xl shadow-xl border border-slate-800 animate-in slide-in-from-bottom-5 max-w-md pointer-events-auto transition-all"
          >
            {/* Dynamic Icon replacement */}
            <IconComponent size={18} className={`${iconColorClass} flex-shrink-0`} />
            
            <span className="text-sm font-bold tracking-wide">
              {toast.message}
            </span>
          </div>
        );
      })}
    </div>
  );
}