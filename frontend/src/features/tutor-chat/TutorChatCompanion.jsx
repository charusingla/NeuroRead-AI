import React, { useState, useRef, useEffect } from 'react';
import { Send, Volume2, VolumeX, Sparkles, User } from 'lucide-react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import neuroThinkingAnimation from '../../assets/neuro-buddy.lottie?url';

export default function TutorChatCompanion({ triggerAudioCue }) {
  const [messages, setMessages] = useState([
    { sender: "Neuro", text: "Hi there! I'm Neuro, your friendly reading buddy. What fun things are we exploring together today? 🌟" }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [chatSoundEnabled, setChatSoundEnabled] = useState(true);
  
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleActionClick = (callback) => {
    if (typeof triggerAudioCue === 'function') {
      triggerAudioCue('click');
    }
    if (callback) callback();
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim() || isLoading) return;

    const userText = inputMessage.trim();
    setInputMessage('');
    
    handleActionClick();
    const updatedHistory = [...messages, { sender: "User", text: userText }];
    setMessages(updatedHistory);
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/tutor-chat/message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userText,
          chatHistory: messages 
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessages((prev) => [...prev, { sender: "Neuro", text: data.reply }]);
        
        if (chatSoundEnabled) {
          speakText(data.reply);
        }
      } else {
        setMessages((prev) => [...prev, { sender: "Neuro", text: "Uh oh! My brain got crossed up. Can you repeat that? 🧠" }]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const speakText = (text) => {
    window.speechSynthesis.cancel();
    const cleanText = text
      .replace(/•/g, "") 
      .replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F700}-\u{1F77F}\u{1F900}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, ""); 
      
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 0.85; 
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="p-0 max-w-4xl mx-auto h-[80vh] flex flex-col space-y-4 text-left transition-colors">
      {/* Header Section */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-3xl border border-slate-200/60 dark:border-slate-800/80 shadow-sm flex items-center justify-between transition-colors">
        <div>
          <h2 className="text-3xl font-black text-indigo-600 dark:text-white tracking-tight flex items-center gap-2">
            🗣️ Companion Chat Bot Hub
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-xs mt-1 font-semibold leading-relaxed">
            Practice conversational sentences or ask tricky homework questions.
          </p>
        </div>

        <button
          type="button"
          onClick={() => handleActionClick(() => {
            const nextSoundState = !chatSoundEnabled;
            setChatSoundEnabled(nextSoundState);
            if (!nextSoundState) window.speechSynthesis.cancel(); 
          })}
          className={`flex items-center gap-2 p-3 text-xs font-bold rounded-xl border transition-all transform active:scale-[0.93] ${
            chatSoundEnabled
              ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-900/40 text-emerald-700 dark:text-emerald-400 shadow-sm'
              : 'bg-rose-50 dark:bg-rose-950/30 border-rose-200 dark:border-rose-900/40 text-rose-700 dark:text-rose-400'
          }`}
        >
          {chatSoundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
        </button>
      </div>

      {/* Chat Messages Frame Window Box */}
      <div className="flex-1 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/60 dark:border-slate-800/80 shadow-sm p-6 overflow-y-auto space-y-4 min-h-[300px] transition-colors relative">

        {/* Dynamic Messages Map Rendering Group */}
        <div className="relative z-10 space-y-4">
          {messages.map((msg, index) => {
            const isNeuro = msg.sender === 'Neuro';
            return (
              <div key={index} className={`flex items-start gap-3 max-w-[85%] ${isNeuro ? 'mr-auto' : 'ml-auto flex-row-reverse'}`}>
                <div className={`p-2 rounded-xl border shadow-sm flex-shrink-0 transition-colors ${
                  isNeuro 
                    ? 'bg-indigo-50 dark:bg-indigo-950/40 border-indigo-100 dark:border-indigo-900/30 text-indigo-600 dark:text-indigo-400' 
                    : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400'
                }`}>
                  {isNeuro ? <Sparkles size={16} /> : <User size={16} />}
                </div>

                <div className={`p-4 rounded-2xl shadow-sm relative group transition-colors ${
                  isNeuro 
                    ? 'bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-100 rounded-tl-sm border border-slate-100 dark:border-slate-850' 
                    : 'bg-gradient-to-r from-indigo-600 to-indigo-500 dark:from-indigo-500 dark:to-indigo-400 text-white rounded-tr-sm'
                }`}>
                  <p className="text-sm tracking-wide font-semibold leading-relaxed font-sans whitespace-pre-wrap">{msg.text}</p>
                  
                  {isNeuro && (
                    <button 
                      onClick={() => handleActionClick(() => speakText(msg.text))}
                      className="absolute top-2 right-2 p-1.5 rounded-lg bg-white dark:bg-slate-900 shadow-sm border border-slate-200/40 dark:border-slate-800 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity"
                      title="Read text aloud"
                    >
                      <Volume2 size={12} />
                    </button>
                  )}
                </div>
              </div>
            );
          })}

          {/* AI Active Thinking State Layout Block */}
          {isLoading && (
            <div className="flex items-start gap-3 max-w-[70%] mr-auto">
              <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/30 text-indigo-600 dark:text-indigo-400 flex-shrink-0">
                <Sparkles size={16} className="animate-spin" />
              </div>
              <div className="p-4 bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-850 rounded-2xl rounded-tl-sm flex flex-col items-center gap-1 shadow-sm min-w-[180px]">
                <div className="w-20 h-20 flex items-center justify-center overflow-hidden">
                  <DotLottieReact
                    src={neuroThinkingAnimation}
                    loop
                    autoplay
                    style={{ width: '100%', height: '100%' }}
                  />
                </div>
                <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 tracking-wide animate-pulse">
                  Neuro is thinking...
                </span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Action Input form dashboard element layout */}
      <form onSubmit={handleSendMessage} className="flex gap-3 bg-white dark:bg-slate-900 p-2 rounded-2xl border border-slate-200/60 dark:border-slate-800/80 shadow-sm items-center transition-colors relative z-10">
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder="Ask Neuro a question or type a chat message..."
          disabled={isLoading}
          className="flex-1 p-3 bg-transparent outline-none text-sm tracking-wide font-semibold font-sans border-0 focus:ring-0 text-slate-800 dark:text-slate-100 placeholder-slate-400"
        />
        <button 
          type="submit" 
          disabled={isLoading || !inputMessage.trim()} 
          className={`p-3 rounded-xl text-white shadow-sm transition-all transform active:scale-[0.95] ${
            isLoading || !inputMessage.trim() 
              ? 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-600 cursor-not-allowed shadow-none' 
              : 'bg-indigo-600 dark:bg-indigo-500 hover:bg-indigo-700 dark:hover:bg-indigo-600'
          }`}
        >
          <Send size={14} />
        </button>
      </form>
    </div>
  );
}