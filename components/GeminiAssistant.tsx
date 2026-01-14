
import React, { useState, useRef, useEffect } from 'react';
import { getBeautyAdvice } from '../services/geminiService';

const GeminiAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{role: 'user' | 'assistant', text: string}[]>([
    { role: 'assistant', text: 'Olá! Sou sua assistente do KamiLuz Space. Em que posso te ajudar hoje com suas unhas?' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;

    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsTyping(true);

    const aiResponse = await getBeautyAdvice(userMsg);
    
    setIsTyping(false);
    setMessages(prev => [...prev, { role: 'assistant', text: aiResponse }]);
  };

  return (
    <div className="fixed bottom-24 md:bottom-8 right-6 z-50">
      {isOpen ? (
        <div className="bg-white w-80 md:w-96 h-[500px] rounded-[2rem] shadow-2xl border border-rose-50 flex flex-col overflow-hidden animate-slideUp">
          <div className="bg-rose-400 p-4 text-white flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-rose-300 rounded-full flex items-center justify-center">
                <i className="fas fa-sparkles text-sm"></i>
              </div>
              <div>
                <p className="text-sm font-bold">Assistente KamiLuz</p>
                <p className="text-[10px] text-rose-100">Online agora</p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="hover:rotate-90 transition-all opacity-70">
              <i className="fas fa-times"></i>
            </button>
          </div>

          <div ref={scrollRef} className="flex-1 p-4 overflow-y-auto space-y-4 bg-stone-50/30">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${
                  m.role === 'user' 
                    ? 'bg-rose-400 text-white rounded-tr-none shadow-sm' 
                    : 'bg-white text-gray-700 rounded-tl-none border border-stone-100 shadow-sm'
                }`}>
                  {m.text}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white p-3 rounded-2xl rounded-tl-none border border-stone-100 shadow-sm">
                  <div className="flex gap-1">
                    <div className="w-1.5 h-1.5 bg-rose-200 rounded-full animate-bounce"></div>
                    <div className="w-1.5 h-1.5 bg-rose-200 rounded-full animate-bounce delay-75"></div>
                    <div className="w-1.5 h-1.5 bg-rose-200 rounded-full animate-bounce delay-150"></div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="p-4 bg-white border-t border-stone-100 flex gap-2">
            <input 
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Digite sua dúvida..."
              className="flex-1 px-4 py-2 rounded-xl bg-stone-50 border border-transparent focus:border-rose-200 focus:bg-white transition-all text-sm text-gray-800 outline-none"
            />
            <button 
              onClick={handleSend}
              className="w-10 h-10 bg-rose-400 text-white rounded-xl flex items-center justify-center hover:bg-rose-500 transition-all"
            >
              <i className="fas fa-paper-plane"></i>
            </button>
          </div>
        </div>
      ) : (
        <button 
          onClick={() => setIsOpen(true)}
          className="w-14 h-14 bg-rose-400 text-white rounded-full shadow-lg shadow-rose-100 flex items-center justify-center text-xl hover:scale-110 transition-all group relative"
        >
          <i className="fas fa-magic"></i>
        </button>
      )}
    </div>
  );
};

export default GeminiAssistant;
